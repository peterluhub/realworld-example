import ArticleList from '../ArticleList';
import React from 'react';
import { withRouter, NavLink } from 'react-router-dom'
import { parse as qsParse } from 'query-string';
import {articleHandler as ah} from 'rw-xsm-handlers';
import xsm from 'xsm';

const {bindState} = xsm;

const YourFeedTab = props => {
  if (props.currentUser && props.currentUser.username) {

    return (
      <li className="nav-item">
      <NavLink
          className="nav-link"
          isActive={
            (match, location) => {
              return location.search.match("tab=feed") ? 1 : 0;
            }
          }
          to={{
            pathname: "/",
            search: "?tab=feed"
          }}
        >
          Your Feed
        </NavLink>
      </li>
    );
  }
  return null;
};

const GlobalFeedTab = props => {
  return (
    <li className="nav-item">
      <NavLink
        className="nav-link"
        isActive={
          (match, location) => {
            return !location.search.match(/tab=(feed|tag)/) ? 1 : 0;
          }
        }
        to={{
          pathname: "/",
          search: "?tab=all"
        }}
      >
        Global Feed
      </NavLink>
    </li>
  );
};

const TagFilterTab = props => {
  if (!props.tag) {
    return null;
  }

  return (
    <li className="nav-item">
      <a href="" className="nav-link active">
        <i className="ion-pound" /> {props.tag}
      </a>
    </li>
  );
};

@withRouter
export default class MainView extends React.Component {

  constructor(props) {
    super(props);
    bindState(this) 
  }

  componentWillMount() {
  }

  componentDidMount() {
    ah.setPredicate(this.getPredicate());
    ah.loadArticles();
  }

  componentDidUpdate(previousProps) {
    if (
      this.getTab(this.props) !== this.getTab(previousProps) ||
      this.getTag(this.props) !== this.getTag(previousProps)
    ) {
      ah.setPredicate(this.getPredicate());
      ah.loadArticles();
    }
  }

  getTag(props = this.props) {
    return qsParse(props.location.search).tag || "";
  }

  getTab(props = this.props) {
    return qsParse(props.location.search).tab || 'all';
  }

  getPredicate(props = this.props) {
    switch (this.getTab(props)) {
      case 'feed': return { myFeed: true };
      case 'tag': return { tag: qsParse(props.location.search).tag };
      default: return {};
    }
  }

  handleTabChange = (tab) => {
    if (this.props.location.query.tab === tab) return;
    this.props.router.push({ ...this.props.location, query: { tab } })
  };

  handleSetPage = page => {
    ah.setPage(page);
    ah.loadArticles();
  };

  render() {
    const { articles, isLoading, page, totalPagesCount, currentUser } = this;

    return (
      <div className="col-md-9">
        <div className="feed-toggle">
          <ul className="nav nav-pills outline-active">

            <YourFeedTab
              currentUser={currentUser}
              tab={this.getTab()}
            />

            <GlobalFeedTab
              tab={this.getTab()}
            />

            <TagFilterTab tag={qsParse(this.props.location.search).tag} />

          </ul>
        </div>

        <ArticleList
          history = {this.props.history}
          ah={ah}
          articles={articles}
          loading={isLoading}
          totalPagesCount={totalPagesCount}
          currentPage={page}
          onSetPage={this.handleSetPage}
        />
      </div>
    );
  }
};
