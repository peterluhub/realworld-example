import ArticleList from './ArticleList';
import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import RedError from './RedError';
import { NavLink, Link, withRouter } from 'react-router-dom';
import xsm from 'xsm';
import {articleHandler as ah, profileHandler as ph} from 'rw-xsm-handlers';

const {get,bindState} = xsm;

const EditProfileSettings = props => {
  if (props.isUser) {
    return (
      <Link
        to="/settings"
        className="btn btn-sm btn-outline-secondary action-btn">
        <i className="ion-gear-a" /> Edit Profile Settings
      </Link>
    );
  }
  return null;
};

const FollowUserButton = props => {
  if (props.isUser) {
    return null;
  }

  let classes = 'btn btn-sm action-btn';
  if (props.following) {
    classes += ' btn-secondary';
  } else {
    classes += ' btn-outline-secondary';
  }

  const handleClick = ev => {
    ev.preventDefault();
    if (props.following) {
      props.unfollow(props.username)
    } else {
      props.follow(props.username)
    }
  };

  return (
    <button
      className={classes}
      onClick={handleClick}
    >
      <i className="ion-plus-round" />
      &nbsp;
      {props.following ? 'Unfollow' : 'Follow'} {props.username}
    </button>
  );
};


@withRouter
export default class Profile extends React.Component {
  constructor(props) {
    super(props)
    bindState(this)
  }

  componentWillMount() {
    ah.setPredicate(this.getPredicate());
  }

  componentDidMount() {
    ph.loadProfile(this.props.match.params.username);
    ah.loadArticles();
  }

  componentDidUpdate(previousProps) {
    if (this.props.location !== previousProps.location) {
      ph.loadProfile(this.props.match.params.username);
      ah.setPredicate(this.getPredicate());
      ah.loadArticles();
    }
  }

  getTab() {
    if (/\/favorites/.test(this.props.location.pathname)) return 'favorites';
    return 'all'
  }

  getPredicate() {
    switch (this.getTab()) {
      case 'favorites': return { favoritedBy: this.props.match.params.username }
      default: return { author: this.props.match.params.username }
    }
  }

  handleFollow = () => {
      const curUser = get('currentUser');
      if( curUser && curUser.username)
          ph.follow();
      else
          this.props.history.replace('/register');
  };
  handleUnfollow = () => ph.unfollow();

  handleSetPage = page => {
    ah.setPage(page);
    ah.loadArticles();
  };

  renderTabs() {
    const { profile } = this;
    return (
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <NavLink
            className="nav-link"
            isActive={
              (match, location) => {
                return location.pathname.match("/favorites") ? 0 : 1;
              }
            }
            to={`/@${profile.username}`}
          >
            My Articles
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            className="nav-link"
            to={`/@${profile.username}/favorites`}
          >
            Favorited Articles
          </NavLink>
        </li>
      </ul>
    );
  }

  render() {
    const { totalPagesCount, articles, isArticlesLoading, profile, isLoadingProfile, currentUser } = this;

    if (isLoadingProfile && !profile) return <LoadingSpinner />;
    if (!profile) return <RedError message="Can't load profile" />;

    const isUser = currentUser && profile.username === currentUser.username;

    return (
      <div className="profile-page">

        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">

                <img src={profile.image} className="user-img" alt="" />
                <h4>{profile.username}</h4>
                <p>{profile.bio}</p>

                <EditProfileSettings isUser={isUser} />
                <FollowUserButton
                  isUser={isUser}
                  username={profile.username}
                  following={profile.following}
                  follow={this.handleFollow}
                  unfollow={this.handleUnfollow}
                />

              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">

            <div className="col-xs-12 col-md-10 offset-md-1">

              <div className="articles-toggle">
                {this.renderTabs()}
              </div>

              <ArticleList
                history = {this.props.history}
                articles={articles}
                totalPagesCount={totalPagesCount}
                onSetPage={this.handleSetPage}
                loading={isArticlesLoading}
              />
            </div>

          </div>
        </div>

      </div>
    );
  }
}

export { Profile };
