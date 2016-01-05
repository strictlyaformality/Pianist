(function($){
  $.fn.pianist = function(method, options){
    options = options || {};
    method = method || 'init';

    //either there are two aguments (method and options) or none (init)
    if(!(arguments.length === 2 || aguments.length === 0)) { return; }

    //start private methods ---------------------------------|

    //stop event propagation / event defaults
    var _killEvent = function(event){
      event.stopPropagation();
      event.stopImmediatePropagation();
      event.preventDefault();
    };

    //do nothing
    var _noop = function(){};

    //create event listeners for the events specified in the keymap
    var _createListeners = function(){
      var eventList = [];

      //compile a list of events that need to be handled
      for(key in this._pianist.keyMap){
        var currentEventList = _getEvents(keyMap[key]);
        eventList = _union(currentEventList, eventList);
      }

      //create event listeners for all of the events
      for(e in eventList){
          _createListner(e);
      }

      //return the compiled list of events
      return eventList;
    };

    //create event listeners for newly added keys
    var _addListeners = function(handlerObj){
      var newEvents = _getEvents(handlerObj),
          eventsToAdd = _getNewEvents(
            this._pianist.listenerList,
            newEvents,
            []
          );

      for(e in eventsToAdd){ _createListener(e); }
    };

    //eventType : Typeof String
    var _createListener = function(eventType){
      //add a listener for the specified event type
      this.on(eventType, function(event){
        return handle(event);
      });
    };

    //handlerObj : Typeof Function | Typeof Object
    var _getEvents = function(handlerObj){
      return (typeof handlerObj === 'function'
        ? [this._pianist.defaultEvent]
        : Object.keys(handlerObj))
    }

    //list : [ [Typeof X] ... ]
    //memo : [ Typeof X ]
    var _uniqueFlatten = function(list, memo){
      if(list.length === 0) { return memo; }

      //at this point, we know the list is non-empty
      var arr = list.pop(),
          union = _union(arr, memo);

      //recurse
      return _uniqueFlatten(list, union);
    };

    //arr1 : [Typeof X]
    //arr2 : [Typeof X]
    var _union = function(arr1, arr2){
      if(arr1.length === 0) { return arr2; }
      if(arr2.length === 0) { return arr1; }

      //at this point, we know both arr1 and arr2 are non-empty
      var item = arr1.pop();

      //if the item isn't in the second array, add it
      if(arr2.indexOf(item) !== -1) { arr2.push(item); }

      //recurse
      return _union(arr1, arr2);
    }

    //arr1: [Typeof String]
    //arr2: [Typeof String]
    //memo: [Typeof String]
    var _getNewEvents = function(currentEvents, newEvents, memo){
      if(newEvents.length === 0) { return memo; }

      //at this point, we know both arr1 and arr2 are non-empty
      var event = newEvents.pop();
      if(currentEvents.indexOf(event) === -1) { memo.push(event); }
      return _getNewEvents(currentEvents, newEvents, memo);
    };
    //end private methods -----------------------------------|

    //start exposed methods ---------------------------------|

    //initialize the pianist object
    var init = function(options){
      this._pianist = {
        keyMap : options.keyMap || {},
        defaultEvent : options.defaultEvent || 'keydown',
        killList : options.killList || [],
        createListeners : !(options.createListeners === false)
      }

      this._pianist.listenerList = this._pianist.createListeners
                                    ? _createListeners()
                                    : []
    };

    //receive an event and dispatch the correct handler
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
        ? (type === this._pianist.defaultEvent ? handler : _noop)
        : (typeof handler === 'object' ? handler[type] || _noop : _noop);

      //execute the function, store result if there is one
      var retObj = keyFunction.call(this, event);

      //if the key is in the kill list, kill the event
      if (this._pianist.killList.indexOf(key) !== -1) _killEvent(event);

      //return the stored result
      return retObj;
    };

    //handlers: {x0 : f0, ... , xN : fN}
    //  such that: xT = Typeof Number, fT = Typeof Function
    //keyKillList: [Typeof Number]
    //add a key to t he key mapping
    var addHandler = function(handlers, killList){
      if(!this._pianist){ return; }

      $.extend(this._pianist.keyMap, keymap || {});
      $.extend(this._pianist.killList, killList || []);

      if(this._pianist.createListeners){ _addListeners(handlers); }
    };

    //key: Typeof Number
    //remove a key from the key mapping
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
    return (methods[method] || _noop).call(this, options);
  };
})(window.jQuery);
