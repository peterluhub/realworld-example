import ListErrors from './ListErrors';
import React from 'react';
import { withRouter } from 'react-router-dom';
import xsm from 'xsm';
import {editorHandler as eh} from 'rw-xsm-handlers';

const {bindState} = xsm;

@withRouter
export default class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tagInput: '',
    };
    bindState(this)
  }

  componentWillMount() {
    eh.setArticleSlug(this.props.match.params.slug);
  }

  componentDidMount() {
    eh.loadInitialData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.slug !== prevProps.match.params.slug) {
      eh.setArticleSlug(this.props.match.params.slug);
      eh.loadInitialData();
    }
  }

  changeTitle = e => eh.setTitle(e.target.value);
  changeDescription = e => eh.setDescription(e.target.value);
  changeBody = e => eh.setBody(e.target.value);
  changeTagInput = e => this.setState({ tagInput: e.target.value });

  handleTagInputKeyDown = ev => {
    switch (ev.keyCode) {
      case 13: // Enter
      case 9: // Tab
      case 188: // ,
        if (ev.keyCode !== 9) ev.preventDefault();
        this.handleAddTag();
        break;
      default:
        break;
    }
  };

  handleAddTag = () => {
    if (this.state.tagInput) {
      eh.addTag(this.state.tagInput.trim());
      this.setState({ tagInput: '' });
    }
  };

  handleRemoveTag = tag => {
    if (this.state.inProgressRemoveTag) return;
    eh.removeTag(tag);
  };

  submitForm = ev => {
    ev.preventDefault();
    eh.submit()
      .then(article => {
        eh.reset();
        this.props.history.replace(`/article/${article.slug}`)
      });
  };

  render() {
    const {
      inProgressRemoveTag,
      editorErrors,
      title,
      description,
      body,
      tagList,
    } = this;

    return (
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">

              <ListErrors errors={editorErrors} />

              <form>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Article Title"
                      value={title}
                      onChange={this.changeTitle}
                      disabled={inProgressRemoveTag}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="What's this article about?"
                      value={description}
                      onChange={this.changeDescription}
                      disabled={inProgressRemoveTag}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <textarea
                      className="form-control"
                      rows="8"
                      placeholder="Write your article (in markdown)"
                      value={body}
                      onChange={this.changeBody}
                      disabled={inProgressRemoveTag}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter tags"
                      value={this.state.tagInput}
                      onChange={this.changeTagInput}
                      onBlur={this.handleAddTag}
                      onKeyDown={this.handleTagInputKeyDown}
                      disabled={inProgressRemoveTag}
                    />

                    <div className="tag-list">
                      {
                        tagList.map(tag => {
                          return (
                            <span className="tag-default tag-pill" key={tag}>
                              <i
                                className="ion-close-round"
                                onClick={() => this.handleRemoveTag(tag)}
                              />
                              {tag}
                            </span>
                          );
                        })
                      }
                    </div>
                  </fieldset>

                  <button
                    className="btn btn-lg pull-xs-right btn-primary"
                    type="button"
                    disabled={inProgressRemoveTag}
                    onClick={this.submitForm}
                  >
                    Publish Article
                  </button>

                </fieldset>
              </form>

            </div>
          </div>
        </div>
      </div>
    );
  }
}
