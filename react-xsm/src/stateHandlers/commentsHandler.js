import agent from '../agent';
import {set, get} from 'xsm';

  let isCreatingComment = false;
  let isLoadingComments = false;
  let commentErrors = undefined;
  let articleSlug = undefined;
  let comments = [];

  export function setArticleSlug(aSlug) {
    if (articleSlug !== aSlug) {
      comments = [];
      set('comments', comments);
      articleSlug = aSlug;
    }
  }

  export function loadComments() {
    isLoadingComments = true;
    commentErrors = undefined;
    set('commentErrors', commentErrors);
    const articleSlug = get('slug')
    return agent.Comments.forArticle(articleSlug)
      .then(({ comments }) => { comments = comments;
        set('comments', comments);
       })
      .catch(err => {
        commentErrors = err.response && err.response.body && err.response.body.errors;
        set('commentErrors', commentErrors);
        throw err;
      })
      .finally(() => { isLoadingComments = false; });
  }


  export function createComment(comment) {
    isCreatingComment = true;
    return agent.Comments.create(articleSlug, comment)
      .then(() => loadComments())
      .finally(() => { isCreatingComment = false; });
  }

  export function deleteComment(id) {
    const idx = comments.findIndex(c => c.id === id);
    if (idx > -1) comments.splice(idx, 1);
    return agent.Comments.delete(articleSlug, id)
      .catch(err => { loadComments(); throw err });
  }

