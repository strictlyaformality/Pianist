(function($){
  $.fn.pianist = function(method, options){
    options = options || {};
    method = method || 'init';

    //either there are two aguments (method and options) or none (init)
    if(!(arguments.length === 2 || aguments.length === 0)) { return; }

    //start utilities ----------------------------------------|

    //stop event propagation / event defaults
    var killEvent = function(event){
      event.stopPropagation();
      event.stopImmediatePropagation();
      event.preventDefault();
    };

    //do nothing
    var noop = function(){};
    //end utilities ------------------------------------------|

    //start exposed methods ---------------------------------|

    //initialize the pianist object
    var init = function(options){
      this._pianist = {
        keyMap : options.keyMap || {},
        defaultEvent : options.defaultEvent || 'keydown',
        killList : options.killList || []
      }
    };

    var handle = function(event){
      //if pianist hasn't been initialized, don't handle anything
      if (!this._pianist) { return; }

      //get the key code and event type
      var key = event.keyCode || event.which,
          type = event.type;

      //get the handler function or object from the keyMap
      var handler = this._pianist.keyMap[key];

      //case 1: handler is a function...
      //  case 1a: event is the default event type, execute handler
      //  case 1b: event is not the default type, execute a no-op
      //case 2: handler is an object...
      //  case 2a: event is in the object, execute retrieved function
      //  case 2b: event is not in the object, execute a no-op
      //case 3: handler is neither a function nor object, execute a no-op
      var keyFunction = typeof handler === 'function'
        ? (type === this._pianist.defaultEvent ? handler : noop)
        : (typeof handler === 'object' ? handler[type] || noop : noop);

      //execute the function
      keyFunction.call(this, event);

      //if the key is in the kill list, kill the event
      if (this._pianist.killList.indexOf(key) !== -1) killEvent(event);
    };

    //handlers: {x0 : f0, ... , xN : fN}
    //  such that: xT = Typeof Number, fT = Typeof Function
    //keyKillList: [Typeof Number]
    var addHandler = function(handlers, killList){
      if(!this._pianist){ return; }

      $.extend(this._pianist.keyMap, keymap || {});
      $.extend(this._pianist.killList, killList || []);
    };

    //key: Typeof Number
    var removeHandler = function(key){
      if(!this._pianist){ return; }

      var index = this._pianist.killList.indexOf(key);

      if (this._pianist.keyMap[key]) delete this._pianist.keyMap[key];
      if (index !== -1) this._pianist.killList.splice(index, 1);
    };
    //end exposed methods -----------------------------------|

    //return object with exposed methods
    var methods = {
      init : init,
      handle : handle,
      addHandler : addHandler,
      removeHandler : removeHandler
    }

    //the method either exists or is undefined. call a noop if undefined.
    return (methods[method] || noop).call(this, options);
  };
})(window.jQuery);
