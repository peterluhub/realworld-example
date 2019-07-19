import Banner from './Banner';
import MainView from './MainView';
import React from 'react';
import {bindState, get} from 'xsm';
import { loadTags, setAppName, setToken} from '../../stateHandlers/datahandler';
import Tags from './Tags';
import { withRouter } from 'react-router-dom';

@withRouter
export default class Home extends React.Component {
  constructor(props) {
      super(props);
      bindState(this,
          /*
          { token: null,
            tags: null,
            appName: 'app'
          }
          */
      )
  }

  componentDidMount() {
    setAppName();
    const user = get('currentUser');
    if( !user || !user.username )
        setToken();
    loadTags();
  }

  render() {
    const { tags, token, appName } = this;
    return (
      <div className="home-page">

        <Banner token={token} appName={appName} />

        <div className="container page"> <div className="row">
            <MainView />

            <div className="col-md-3">
              <div className="sidebar">

                <p>Popular Tags</p>

                <Tags
                  tags={tags}
                />

              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}
