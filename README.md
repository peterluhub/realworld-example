This repo contains the [realworld example app](https://github.com/gothinkster/realworld) implementations that use [XSM](https://github.com/peterluhub/xsm) to manage the app state.  It uses [rw-xsm-handlers](https://www.npmjs.com/package/rw-xsm-handlers) as the common module to manage the app state as well as the API logic to the realworld example app backend for all the XSM supported frameworks.
It strides to demostrate that you can write the state and API code once and use it for all the supported frameworks with XSM.


## Install
Install this package: 
```sh
npm install realworld_example_apps_with_xsm
```

Run in the same directory(package root directory) of this README.md:
```sh
npm install
```

Run in the framework directory(./react-xsm for React):
```sh
npm install
```
Build the js bundle by running:
```sh
npm run build
```

Run the following to bring up the web server and see it in the browser:
```sh
npm run serve ./react-xsm/dist
```

##### Note
The status of angular-xsm app is work-in-progress.  The work has just started.
