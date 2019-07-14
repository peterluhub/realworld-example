let _data = {};
let config = {};
let sharedState = {};
let sublist = new Map();
let rmsublist = new Map();
let debug=false;
let keysep='.';


const frameworkcfg = {
    React: {
        umount: 'componentWillUnmount',
        wmount: 'componentWillmount',
        setstate: (self) => (key, val) => self.setState({[key]: val}),
        initstate: (self, key, val) =>  {
            //console.log('key', key, 'val', val);
            if( !self.state ) self.state={};
            if( key ) {
                let v = get(key);
                //console.log('v', v, 'key', key, 'val', val);
                if( v === undefined ) {
                    self.state[key] = val;
                    set(key, val);
                } else {
                    self.state[key] = v;
                }
            }
        },
    },
    Vue: {
        umount: 'destroyed',
        setstate: (self) => (key, val) => self[key] = val,
        initstate: ()=>null,
    },
    Angular: {
        umount: 'ngOnDestroy',
        setstate: (self) => (key, val) => self[key] = val,
        initstate: ()=>null,
    },
};

function rmkey(key) {
    let start, sep;
    if( config.sep )
        sep = config.sep;
    else
        sep = keysep;
    start = _data;
    const keystr = key + '';
    let keychain = keystr.split(sep);
    let len = keychain.length;
    let breaklen = len-1;
    let ref = start;
    let keyitem;
    for(let i=0; i<len; i++) {
        keyitem = keychain[i];
        if( i === breaklen ) {
            ref[keyitem] = undefined;
            //console.log('sublist.has', key, sublist.has(key));
      //console.log('store', _data);
      //console.log('i', i, 'key', key, 'store', _data, 'ref', ref, 'keyitem', keyitem);
            return;
        }
        if( !ref[keyitem] ) {
            ref[keyitem] = {};
        } 
        ref = ref[keyitem];
      //console.log('i', i, 'key', key, 'store', _data, 'ref', ref, 'keyitem', keyitem);
    }
      console.log('store', _data);
    if( debug )
        console.trace('trace for removing key=', key);
}

function rmsub(key, id) {
    //console.log('id', id);
      if( (id||id===0) && sublist.has(key) && (sublist.get(key).length) > id ) {
          sublist.get(key).splice(id, 1)
          if( sublist.get(key).length === 0 ) {
              sublist.delete(key)
              rmkey(key);
          }
      //console.log('key', key, sublist.get(key));
      }
      //console.log('sublist.get(key).length', sublist.has(key), 'key', key, sublist.get(key));
}

function addsub(key, cb) {
      if( !sublist.has(key) ) sublist.set(key, []);
      let subitem = sublist.get(key);
      subitem.push((key,val)=>cb(key,val))
      //console.log('sublist.has', key, sublist.has(key), sublist.get(key));
      return subitem.length-1;
}

function set(key, val, opt) {
    let start, sep;
    if( opt && opt.sep )
        sep = opt.sep;
    else
        sep = keysep;
    if( opt && opt.pathref instanceof Object ) {
        start = opt.pathref;
    } else {
        start = _data;
    }
    const keystr = key + '';
    let keychain = keystr.split(sep);
    let len = keychain.length;
    let breaklen = len-1;
    let ref = start;
    let keyitem;
    for(let i=0; i<len; i++) {
        keyitem = keychain[i];
        if( i === breaklen ) {
            ref[keyitem] = val;
            //console.log('sublist.has', key, sublist.has(key));
            if(  sublist.has(key) ) {
                let cblst = sublist.get(key);
                for(let i=0; i<cblst.length; i++) {
                    cblst[i](key, val);
                }
            }
        if( debug ) {
            console.trace('trace for key=', key, 'val=', val);
            console.log('store', _data);
        }
      //console.log('i', i, 'key', key, 'store', _data, 'ref', ref, 'keyitem', keyitem);
            return;
        }
        if( !ref[keyitem] ) {
            ref[keyitem] = {};
        } 
        ref = ref[keyitem];
      //console.log('i', i, 'key', key, 'store', _data, 'ref', ref, 'keyitem', keyitem);
    }
      console.log('store', _data);
}
function get(key, sep) {
    sep = sep || keysep;
    key = key + '';
    let keychain = key.split(sep);
    let len = keychain.length;
    let breaklen = len-1;
    let ref = _data;
    let keyval;
    for(let i=0; i<len; i++) {
        keyval = keychain[i];
        if( i === breaklen ) {
            return ref[keyval];
        }
        //console.log('keyval', keyval, 'ref[keyval]', ref[keyval]);
        if( !ref[keyval] ) {
            return undefined;
        } 
        ref = ref[keyval];
        if( !ref || typeof ref !== 'object' ) {
            return undefined;
        } 
    }
}

function rmStateBinding(self, opt) {
    let map;
    console.log('rmStateBinding, opt=', opt, 'self', self);
    if( opt )
        map  = opt;
    else if( config.bindings )
        map  = config.bindings[self.constructor.name];
    else
        return;
    Object.keys(map).forEach(key => {
        rmsub(key, rmsublist.get(self)[key]);
    });
}

export function bindState(self, opt) {
    let map;
    if( opt )
        map  = opt;
    else if( config.bindings )
        map  = config.bindings[self.constructor.name];
    else
        return;
    let id;
    rmsublist.set(self, {});
    const ref = rmsublist.get(self)
    console.log('class sub binding with ', self.constructor.name);
    let framework = config.framework;
    Object.keys(map).forEach(key => {
        frameworkcfg[framework].initstate(self, key, map[key]);
        let frameworkcb =  frameworkcfg[framework].setstate(self);
        let statecb = (key, val) => {
                frameworkcb(key, val);
        }
        id = addsub(key, statecb);
        ref[key] = id;
    });
    let umount = self[frameworkcfg[framework].umount]
    if( framework ) {
        if( umount ) {
            umount = umount.bind(self);
            self[frameworkcfg[framework].umount] = function classDestroy() {
                rmStateBinding(self, map);
                umount();
    console.log('has umount framework', framework, 'umount', umount, 'self', self, 'store', _data)
            };
    //console.log('framework', framework, 'in umount', umount)
        } else {
            self[frameworkcfg[framework].umount] = function classDestroy() {
                rmStateBinding(self, map);
    console.log('no umount framework', framework, 'umount', umount, 'self', self, 'store', _data)
            };
    //console.log('framework', framework, 'in no umount', umount)
        }
    } else {
        //self[frameworkcfg['default'].umount] = function classDestroy() {rmStateBinding(self, map)};
    console.log('default framework', framework, 'umount', umount, 'self', self)
    }
}

function reset(key, opt) {
    if(key) {
      delete _data[key];
    } else {
      _data = {}; return
    }
}

function setSharedState(bindings) {
    let keylist = {};
    Object.keys(bindings).forEach(key => {
      const component = bindings[key];
      Object.keys(component).forEach(state => {
        if( keylist[state])
            keylist[state] += 1;
        else
            keylist[state]= 1;
      });
    });
    Object.keys(keylist).forEach(key => {
        if( keylist[key]>1 )
            sharedState[key] = true;
    });
    console.log('sharedState', sharedState);
}

export function setcfg(opt) {
    console.log('opt', opt);
    if( !opt ) return;
    Object.keys(opt).forEach(key => {
        config[key] = opt[key];
        if( key === 'bindings' )
            setSharedState(opt[key])
    });
    console.log('config', config);
}

export function willBind(bindings) {
    console.trace('config', config);
	return function inner_willBind(constructor) {
	  const wmount = frameworkcfg[config.framework].wmount;
	  const original = constructor.prototype[wmount];

	  constructor.prototype[wmount] = function() {
		console.log(`binding ${constructor.name}...`);
		bindState(this, bindings);
        if( typeof original === 'function' )
            return original.apply(this, arguments);
	  };
	};
}

	export function bindProps(tgt) {
	  const wmount = frameworkcfg[config.framework].wmount;

	  console.log(`binding ${tgt.constructor.name}...`);
    };
    /*
export function bindProps(bindings) {
    console.trace('config', config);
}
    */

/*
export function bbindState(bindings) {
    let done;
    return function bindS(target, name, descriptor) {
        if( done ) return;
        let curVal = descriptor.value;
        descriptor.value = function innerBind() {
            console.log('binds here', target.constructor.name, name, bindings, 'tgt.props', target);
            connectState(this, bindings);
            return curVal.apply(this, arguments);
        }
        return descriptor;
    };
}
*/

const usm = {
  setcfg,
  set,
  get,
  reset,
  rmsub,
  addsub,
  bindState,
  select: (key, opt) => {
  },
  debug: val => debug=val,
};

//Object.freeze(usm);
//export usm;
export default usm;
