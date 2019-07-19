import agent from '../agent';
import {set} from 'xsm';


  let currentUser;
  let loadingUser;
  let updatingUser;

  export function pullUser() {
    loadingUser = true;
    return agent.Auth.current()
      .then(({ user }) => { currentUser = user; 
          set('currentUser', currentUser); 
      })
      .finally(() => { loadingUser = false; })
  }

  export function updateUser(newUser) {
    updatingUser = true;
    return agent.Auth.save(newUser)
      .then(({ user }) => { currentUser = user; 
        set('currentUser', currentUser); 
      })
      .finally(() => { updatingUser = false; })
  }

  export function forgetUser() {
    currentUser = undefined;
    set('currentUser', currentUser); 
  }

