/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

var app = {
  init: function init() {
    this.initKnockout();
    this.initPubnub();
    this.initLeaveButton();
  },
  initPubnub: function initPubnub() {
    var self = this; //Init pubnub

    var uuid = PubNub.generateUUID();
    self.pubnub = new PubNub($.extend(PUBNUBCONFIG, {
      uuid: uuid
    }));
    self.pubnub.addListener({
      message: function message(event) {
        console.log('Received message', event);

        if (event.message.type === 'call') {
          self.vm.waiting(false);
          self.vm.busy(false);
          self.vm.calling(true);
        } else if (event.message.type == 'callOther' && event.message.data.vsee_id != VSeeData.vsee_id) {
          self.vm.waiting(false);
          self.vm.calling(false);
          self.vm.busy(true);
        }
      },
      presence: function presence(event) {
        console.log('presence', event);
      },
      status: function status(event) {
        if (event.category == 'PNConnectedCategory') {
          //Push a message to notify the admin have someone join the room
          var joinData = $.extend({
            uuid: uuid,
            date: new Date()
          }, VSeeData);
          self.pubnub.publish({
            channel: chanelName,
            message: {
              "type": 'join',
              "data": joinData
            }
          }, function (status, response) {
            if (status.error) {
              console.error('Publish message failed', status);
            }
          });
        }
      }
    });
    self.pubnub.subscribe({
      //Subscribe to 2 chanel: main room channel and specified channel
      channels: [chanelName, chanelName + '_' + VSeeData.vsee_id],
      withPresence: true
    }); //Represent send

    window.onbeforeunload = function () {
      //Push a message to notify admin that user leaving
      self.pubnub.unsubscribe({
        channels: [chanelName]
      });
    };
  },
  initKnockout: function initKnockout() {
    var self = this;

    function ViewModel() {
      this.waiting = ko.observable(true);
      this.busy = ko.observable(false);
      this.calling = ko.observable(false);
    }

    self.vm = new ViewModel(); //KO Bindings

    ko.applyBindings(this.vm);
  },
  initLeaveButton: function initLeaveButton() {
    var self = this;
    $('body').on('click', '#btnLeavingRoom', function (e) {
      e.preventDefault();
      self.pubnub.unsubscribe({
        channels: ['waiting_room']
      });
      $('#backIndexForm').submit();
    });
  }
};
$(document).ready(function () {
  app.init();
});

/***/ }),

/***/ "./resources/sass/app.scss":
/*!*********************************!*\
  !*** ./resources/sass/app.scss ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 0:
/*!*************************************************************!*\
  !*** multi ./resources/js/app.js ./resources/sass/app.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /home/vagrant/vsee/resources/js/app.js */"./resources/js/app.js");
module.exports = __webpack_require__(/*! /home/vagrant/vsee/resources/sass/app.scss */"./resources/sass/app.scss");


/***/ })

/******/ });