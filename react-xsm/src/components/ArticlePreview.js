import React from 'react';
import { Link } from 'react-router-dom';
import xsm from 'xsm';
import {articleHandler as ah} from 'rw-xsm-handlers';

const {get} = xsm;


const FAVORITED_CLASS = 'btn btn-sm btn-primary';
const NOT_FAVORITED_CLASS = 'btn btn-sm btn-outline-primary';


export default class ArticlePreview extends React.Component {

  handleClickFavorite = ev => {
    ev.preventDefault();
    const user = get('currentUser');
    if( !user || !user.username )
          return this.props.history.replace('/login');
    const { article } = this.props;
    if (article.favorited) {
      ah.unmakeFavorite(article.slug).then(()=> {
            this.forceUpdate();
      })
    } else {
      ah.makeFavorite(article.slug).then(()=> {
            this.forceUpdate();
      })
    }
  };

  render() {
    const { article } = this.props;
    const favoriteButtonClass = article.favorited ? FAVORITED_CLASS : NOT_FAVORITED_CLASS;

    return (
      <div className="article-preview">
        <div className="article-meta">
          <Link to={`/@${article.author.username}`}>
            <img src={article.author.image} alt="" />
          </Link>

          <div className="info">
            <Link className="author" to={`/@${article.author.username}`}>
              {article.author.username}
            </Link>
            <span className="date">
            {new Date(article.createdAt).toDateString()}
          </span>
          </div>

          <div className="pull-xs-right">
            <button className={favoriteButtonClass} onClick={this.handleClickFavorite}>
              <i className="ion-heart" /> {article.favoritesCount}
            </button>
          </div>
        </div>

        <Link to={`/article/${article.slug}`} className="preview-link">
          <h1>{article.title}</h1>
          <p>{article.description}</p>
          <span>Read more...</span>
          <ul className="tag-list">
            {
              article.tagList.map(tag => {
                return (
                  <li className="tag-default tag-pill tag-outline" key={tag}>
                    {tag}
                  </li>
                )
              })
            }
          </ul>
        </Link>
      </div>
    );
  }
}
