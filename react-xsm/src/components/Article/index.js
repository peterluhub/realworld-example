import ArticleMeta from './ArticleMeta';
import CommentContainer from './CommentContainer';
import React from 'react';
import { withRouter } from 'react-router-dom';
import RedError from '../RedError';
import LoadingSpinner from '../LoadingSpinner';
import marked from 'marked';
import xsm from 'xsm';
import {commentsHandler as ch, articleHandler as ah} from 'rw-xsm-handlers';

const {bindState} = xsm;


@withRouter
export default class Article extends React.Component {
  constructor(props) {
    super(props)
    bindState(this)
  }
  componentDidMount() {
    const slug = this.props.match.params.id;
    ah.loadArticle(slug, { acceptCached: true });
    ch.setArticleSlug(slug);
    ch.loadComments();
  }

  handleDeleteArticle = slug => {
    ah.deleteArticle(slug)
      .then(() => this.props.history.replace('/'));
  };

  handleDeleteComment = id => {
    ch.deleteComment(id);
  };

  render() {
    const slug = this.props.match.params.id;
    const { currentUser, comments, commentErrors, isArticleLoading } = this;
    const article = ah.getArticle(slug);

    if (isArticleLoading) return <LoadingSpinner />;
    if (!article) return <RedError message="Can't load article" />;

    const markup = { __html: marked(article.body, { sanitize: true }) };
    const canModify = currentUser && currentUser.username === article.author.username;
    return (
      <div className="article-page">

        <div className="banner">
          <div className="container">

            <h1>{article.title}</h1>
            <ArticleMeta
              article={article}
              canModify={canModify}
              onDelete={this.handleDeleteArticle}
            />
          </div>
        </div>

        <div className="container page">

          <div className="row article-content">
            <div className="col-xs-12">

              <div dangerouslySetInnerHTML={markup} />

              <ul className="tag-list">
                {
                  article.tagList.map(tag => {
                    return (
                      <li
                        className="tag-default tag-pill tag-outline"
                        key={tag}
                      >
                        {tag}
                      </li>
                    );
                  })
                }
              </ul>

            </div>
          </div>

          <hr />

          <div className="article-actions" />

          <div className="row">
            <CommentContainer
              comments={comments}
              errors={commentErrors}
              slug={slug}
              currentUser={currentUser}
              onDelete={this.handleDeleteComment}
            />
          </div>
        </div>
      </div>
    );
  }
}
