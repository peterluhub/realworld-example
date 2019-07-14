import agent from '../agent';
import {set} from 'xsm';

const LIMIT = 10;


  let isLoading = false;
  let page = 0;
  let totalPagesCount = 0;
  let articlesRegistry = new Map();
  let predicate = {};

  function clear() {
    articlesRegistry.clear();
    page = 0;
    set('page', page)
  }

  export  function getArticle(slug) {
    const val = articlesRegistry.get(slug);
    //console.log('slug', slug, 'articlesRegistry', articlesRegistry, 'val', val);
    if( !val ) {
      //loadArticle(slug)
    }
    return val;
  }

  export function setPage(pg) {
    page = pg;
    set('page', page)
  }

  export function setPredicate(mypredicate) {
    if (JSON.stringify(predicate) === JSON.stringify(mypredicate)) return;
    clear();
    predicate = mypredicate;
  }

  function $req() {
    if (predicate.myFeed) return agent.Articles.feed(page, LIMIT);
    if (predicate.favoritedBy) return agent.Articles.favoritedBy(predicate.favoritedBy, page, LIMIT);
    if (predicate.tag) return agent.Articles.byTag(predicate.tag, page, LIMIT);
    if (predicate.author) return agent.Articles.byAuthor(predicate.author, page, LIMIT);
    return agent.Articles.all(page, LIMIT, predicate);
  }

  export function loadArticles() {
    isLoading = true;
    return $req()
      .then(({ articles, articlesCount }) => {
        articlesRegistry.clear();
        articles.forEach(article => articlesRegistry.set(article.slug, article));
        totalPagesCount = Math.ceil(articlesCount / LIMIT);
        set('articles', articles)
        set('totalPagesCount', totalPagesCount)
      })
      .finally(() => { isLoading = false; });
  }

  export function loadArticle(slug, { acceptCached = false } = {}) {
    set('slug', slug)
    if (acceptCached) {
      const article = getArticle(slug);
      if (article) return Promise.resolve(article);
    }
    let isArticleLoading = true;
    set('isArticleLoading', isArticleLoading)
    return agent.Articles.get(slug)
      .then(({ article }) => {
        articlesRegistry.set(article.slug, article);
        set('article', article)
        return article;
      })
      .finally(() => { 
        isArticleLoading = false;
        set('isArticleLoading', isArticleLoading)
      });
  }

  export function makeFavorite(slug) {
    const article = getArticle(slug);
    if (article && !article.favorited) {
      article.favorited = true;
      article.favoritesCount++;
      return agent.Articles.favorite(slug)
        .catch(err => {
          article.favorited = false;
          article.favoritesCount--;
          throw err;
        });
    }
    return Promise.resolve();
  }

  export function unmakeFavorite(slug) {
    const article = getArticle(slug);
    if (article && article.favorited) {
      article.favorited = false;
      article.favoritesCount--;
      return agent.Articles.unfavorite(slug)
        .catch(err => {
          article.favorited = true;
          article.favoritesCount++;
          throw err;
        });
    }
    return Promise.resolve();
  }

  export function createArticle(article) {
    return agent.Articles.create(article)
      .then(({ article }) => {
        articlesRegistry.set(article.slug, article);
        return article;
      })
  }

  export function updateArticle(data) {
    return agent.Articles.update(data)
      .then(({ article }) => {
        articlesRegistry.set(article.slug, article);
        return article;
      })
  }

  export function deleteArticle(slug) {
    articlesRegistry.delete(slug);
    return agent.Articles.del(slug)
      .catch(err => { loadArticles(); throw err; });
  }
