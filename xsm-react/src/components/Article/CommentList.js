import Comment from './Comment';
import React from 'react';

const CommentList = (props => {
  return (
    <div>
      {
        props.comments.map(comment => {
          return (
            <Comment
              comment={comment}
              currentUser={props.currentUser}
              slug={props.slug}
              key={comment.id}
              onDelete={props.onDelete}
            />
          );
        })
      }
    </div>
  );
});

export default CommentList;
