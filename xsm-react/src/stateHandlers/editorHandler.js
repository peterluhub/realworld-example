import * as articlesHandler from './articleHandler';
import {set, get } from 'xsm';


  let inProgress = false;
  let editorErrors = undefined;
  let articleSlug = undefined;

  let tagList = [];

  export function setArticleSlug(aSlug) {
    if (articleSlug !== aSlug) {
      reset();
      articleSlug = aSlug;
    }
  }

  export function loadInitialData() {
    if (!articleSlug) return Promise.resolve();
    inProgress = true;
    return articlesHandler.loadArticle(articleSlug, { acceptCached: true })
      .then((article) => {
        if (!article) throw new Error('Can\'t load original article');
        tagList = article.tagList;
        set('title', article.title)
        set('description', article.description)
        set('body', article.body)
        set('tagList', tagList)
      })
      .finally(() => { inProgress = false; });
  }

  export function reset() {
    tagList = [];
    set('title', '')
    set('description', '')
    set('body', '')
    set('tagList', [])
  }

  export function setTitle(title) {
    set('title', title)
  }

  export function setDescription(description) {
    set('description', description)
  }

  export function setBody(body) {
    set('body', body)
  }

  export function addTag(tag) {
    if (tagList.includes(tag)) return;
    tagList.push(tag);
    set('tagList', tagList)
  }

  export function removeTag(tag) {
    tagList = tagList.filter(t => t !== tag);
    set('tagList', tagList)
  }

  export function submit() {
    inProgress = true;
    editorErrors = undefined;
    const article = {
      title: get('title'),
      description: get('description'),
      body: get('body'),
      tagList: get('tagList'),
      slug: articleSlug,
    };
    return (articleSlug ? articlesHandler.updateArticle(article) : articlesHandler.createArticle(article))
      .catch((err) => {
        editorErrors = err.response && err.response.body && err.response.body.errors; throw err;
        set('editorErrors', editorErrors)
      })
      .finally(() => { inProgress = false; });
  }
