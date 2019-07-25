import Banner from './Banner';
import MainView from './MainView';
import React from 'react';
import xsm from 'xsm';
import {dataHandler} from 'rw-xsm-handlers';
import Tags from './Tags';
import { withRouter } from 'react-router-dom';

const {bindState, get} = xsm;
const { loadTags, setAppName, setToken} = dataHandler;

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
