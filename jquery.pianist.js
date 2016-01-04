(function($){
  $.fn.pianist = function(method, options){
    options = options || {};
    method = method || 'init';

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
      this._keyMap = options.keyMap || {};
      this._defaultEvent = options.defaultEvent || 'keydown';
      this._killList = options.killList || [];
    };

    var handle = function(event){
      //get the key code and event type
      var key = event.keyCode || event.which,
          type = event.type;

      //get the handler function or object from the keyMap
      var handler = this._keyMap[key];

      //case 1: handler is a function...
      //  case 1a: event is the default event type, execute handler
      //  case 1b: event is not the default type, execute a no-op
      //case 2: handler is an object...
      //  case 2a: event is in the object, execute retrieved function
      //  case 2b: event is not in the object, execute a no-op
      //case 3: handler is neither a function nor object, execute a no-op
      var keyFunction = typeof handler === 'function'
        ? (type === this._defaultEvent ? handler : noop)
        : (typeof handler === 'object' ? handler[type] || noop : noop);

      //execute the function
      keyFunction.call(this, event);

      //if the key is in the kill list, kill the event
      if (this._killList.indexOf(key) !== -1) killEvent(event);
    };

    //handlers: {x0 : f0, ... , xN : fN}
    //  such that: xT = Typeof Number, fT = Typeof Function
    //keyKillList: [Typeof Number]
    var addHandler = function(handlers, killList){
      $.extend(this._keyMap, keymap || {});
      $.extend(this._killList, killList || []);
    };

    //key: Typeof Number
    var removeHandler = function(key){
      var index = this._killList.indexOf(key);

      if (this._keyMap[key]) delete this._keyMap[key];
      if (index !== -1) this._killList.splice(index, 1);
    };
    //end exposed methods -----------------------------------|

    //return object with exposed methods
    var methods = {
      init : init,
      handle : handle,
      addHandler : addHandler,
      removeHandler : removeHandler
    }

    if(method in methods){ return methods[method].call(this, options); }
  };
})(window.jQuery);
