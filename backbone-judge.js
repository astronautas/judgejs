//! Backbone-judge.js
//! version : 1.01
//! authors : Lukas Valatka
//! license : MIT
//! https://github.com/astronautas/backbone-judge.js
//! 1.01 changes: added backbone as module dependency

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // Register as an anonymous module
    define(['backbone'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root.returnExports = factory();
  }
})(this, function() {
  // Attaching the method to the prototype of all model instances allows
  // them to use the method (which is run before save)
  Backbone.Model.prototype.validate = function(attributes) {
    // Errors array will get returned by this method
    var errors = [];

    // Programmer should specify validations in a hash as a property of a model
    var validations = this.validations;

    // Iterate validations (keys are attributes, values are validating methods)
    for (var attrName in validations) {

      // Object might contain keys that are from base object (tldr; irrelevant info)
      if (validations.hasOwnProperty(attrName)) {
        var validatingFunctions = validations[attrName];

        // As one property might have multiple validations, iterate them all
        for (var i = 0; i < validatingFunctions.length; i++) {
          var fnName         = validatingFunctions[i].fn;
          var validatingFn   = this[fnName];
          var expectedValue  = validatingFunctions[i].val;
          var attributeValue = attributes[attrName];
          var errorMessage   = validatingFunctions[i].msg;
          var error          = validatingFn(attributeValue, expectedValue, errorMessage);

          if (error !== true) {
            errors.push(error);
          }
        }
      }
    }

    // If there are no errors, invalid event will not fire (as errors would be empty)
    if (errors.length) {
      return errors;
    } else {
      return 0;
    }
  };

  // Validates presence of an attribute
  Backbone.Model.prototype.presence = function(attrValue, condition, msg) {
    if ((attrValue.length !== 0 && condition) || (attrValue.length === 0 && !condition)) {
      return true;
    } else {
      return msg;
    }
  };

  // Validates whether attributes is number
  Backbone.Model.prototype.number = function(attrValue, condition, msg) {
    if (isNaN(attrValue)) {
      return msg;
    } else {
      return true;
    }
  };
});