//{"user":{"id":54351,"email":"usmstagemgmt@gmail.com","createdAt":"2019-04-29T02:28:09.475Z","updatedAt":"2019-04-29T02:28:09.483Z","username":"usmstatemgmt","bio":null,"image":null,"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NTQzNTEsInVzZXJuYW1lIjoidXNtc3RhdGVtZ210IiwiZXhwIjoxNTYxNjg4ODg5fQ.KyX9tsg1DfBc1NPmzhKw9YJC_9w6fruNCkTljpp38Fc"}} pw: usmgmail.com
/*
 "Unified State Management - incredibly simple and performant"
 createdAt
 :
 "2019-04-29T02:36:25.067Z"
 description
 :
 "state management"
 favorited
 :
 false
 favoritesCount
 :
 0
 slug
 :
 "usm-web-frontend-state-management-for-the-rest-of-us-nnvf40"
 tagList
 :
 (4) ["usm", "mobx", "redux", "state"]
 title
 :
 "USM Web Frontend State Management for the rest of us"
 */
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

