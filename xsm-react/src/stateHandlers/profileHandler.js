import agent from '../agent';
import {set} from 'xsm';


  let profile = undefined;
  let isLoadingProfile = false;

  export function loadProfile(username) {
    isLoadingProfile = true;
    set('isLoadingProfile', isLoadingProfile)
    agent.Profile.get(username)
      .then(( pf ) => { 
        profile = pf.profile; 
        set('profile', profile)
      })
      .finally(() => { isLoadingProfile = false; 
        set('isLoadingProfile', isLoadingProfile)
      })
  }

  export function follow() {
      console.log('===profile', profile)
    if (profile && !profile.following) {
      profile.following = true;
      agent.Profile.follow(profile.username).then(()=>
          set('profile', profile))
        .catch(() => { profile.following = false 
          set('profile', profile)
        });
    }
  }

  export function unfollow() {
    if (profile && profile.following) {
      profile.following = false;
      agent.Profile.unfollow(profile.username)
        .catch(() => { profile.following = true 
          set('profile', profile)
        });
    }
  }
