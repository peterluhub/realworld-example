import agent from '../agent';
import {set} from 'xsm';


  export let appLoaded = false;
  let appName = 'Conduit';
  export let token = window.localStorage.getItem('jwt');
  if (!token) 
    window.localStorage.removeItem('jwt');

  export function loadTags() {
    return agent.Tags.getAll()
      .then(( tags ) => { 
          const alltags = tags.tags.map(t => t.toLowerCase()); 
          set('tags', alltags);
          return alltags;
      })
      .finally(() => { //isLoadingTags = false; 
      });
  }

  export function setToken(token) {
    set('token', token);
    if (!token) {
      window.localStorage.removeItem('jwt');
      token = undefined;
    }
  }

  export function setAppName() {
    set('appName', appName);
  }

  export function setAppLoaded() {
    appLoaded = true;
    set('appLoaded', appLoaded);
  }


