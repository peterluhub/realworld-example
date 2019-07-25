const currentUser = 'currentUser'

const commentsVal = [] 
const nulval = null
const currentUserVal = nulval

export const    App = { 
        appLoaded: nulval
}
export const    Header = { 
        appName: 'conduit',
        [currentUser]: currentUserVal,
}
export const    Home = { 
        token: nulval,
        tags: nulval,
        appName: 'conduit'
}
export const    Login = {
        [currentUser]: currentUserVal,
        lerrors: nulval,
        linProgress: nulval,
}
export const    Register = {
        [currentUser]: currentUserVal,
        rerrors: nulval,
        rinProgress: nulval,
}
export const    Profile = {
       [currentUser]: currentUserVal,
       articles: [], 
       profile: nulval,
       isArticlesLoading: nulval,
       isLoadingProfile: nulval, 
       totalPagesCount: 0,
}
export const Article = {
        [currentUser]: currentUserVal,
        token: nulval,
        isArticleLoading: nulval,
        comments: commentsVal,
        commentError: nulval,
}
export const    Settings = {
        [currentUser]: currentUserVal,
        updatingUserErrors: nulval,
}
export const    SettingsForm = {
        [currentUser]: currentUserVal,
        updatingUser: nulval,
}
export const    MainView = {
       [currentUser]: currentUserVal,
       articles: [], 
       isLoading: nulval, 
       page: 0, 
       totalPagesCount: 0,
       predicate: nulval,
}
export const    Editor = {
      inProgressRemoveTag: nulval,
      editorErrors: nulval,
      title: '',
      description: '',
      body: '',
      tagList: [],
}
export const    CommentInput = {
        [currentUser]: currentUserVal,
        isCreatingComment: nulval,
}
export const    PrivateRoute = {
        [currentUser]: currentUserVal,
}
