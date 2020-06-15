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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/admin.js":
/*!*******************************!*\
  !*** ./resources/js/admin.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

var admin = {
  init: function init() {
    this.initKnockout();
    this.initPubnub();
    this.initButtons();
  },
  initKnockout: function initKnockout() {
    var self = this;
    self.patients = ko.observableArray([]);
    ko.applyBindings({
      patients: self.patients
    }); //Add function

    var durationCalculate = function durationCalculate(date, element) {
      var duration = moment.duration(date.diff(new Date()));
      var minutes = Math.abs(duration.asMinutes());
      $(element).text(Math.round(minutes));
    };

    ko.bindingHandlers.Duration = {
      update: function update(element, valueAccessor) {
        var value = valueAccessor();
        var date = moment(value);
        durationCalculate(date, element); //Run interval

        setInterval(function () {
          durationCalculate(date, element);
        }, 1000 * 60);
      }
    };
  },
  initPubnub: function initPubnub() {
    var self = this; //Init pubnub

    var uuid = PubNub.generateUUID();
    self.pubnub = new PubNub($.extend(PUBNUBCONFIG, {
      uuid: uuid
    }));
    self.pubnub.addListener({
      message: function message(event) {
        if (event.message.type == 'join') {
          self.patients.push(event.message.data);
        }
      },
      presence: function presence(event) {
        if (event.action === 'leave' || event.action === 'timeout') {
          //Remove patients
          self.patients.remove(function (patient) {
            return patient.uuid === event.uuid;
          });
        }
      }
    });
    self.pubnub.subscribe({
      channels: ['waiting_room'],
      withPresence: true
    });
  },
  initButtons: function initButtons() {
    var self = this;
    $('body').on('click', '#btnCall', function (e) {
      e.preventDefault();
      var patientId = $(this).data('vseeid'); //Call user

      self.pubnub.publish({
        channel: 'waiting_room_' + patientId,
        message: {
          "type": 'call'
        }
      }, function (status, response) {
        if (status.error) {
          console.error('Publish message failed', status);
        }
      }); //Push message to other user

      self.pubnub.publish({
        channel: 'waiting_room',
        message: {
          "type": 'callOther',
          'data': {
            vsee_id: patientId
          }
        }
      }, function (status, response) {
        if (status.error) {
          console.error('Publish message failed', status);
        }
      });
    });
  }
};
$(document).ready(function () {
  admin.init();
});

/***/ }),

/***/ 1:
/*!*************************************!*\
  !*** multi ./resources/js/admin.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/vagrant/vsee/resources/js/admin.js */"./resources/js/admin.js");


/***/ })

/******/ });