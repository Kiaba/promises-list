'use strict';

var Q = require('q');

function queue(promise, list) {
  switch(list.length) {
    case 0:
      return promise;
    case 1:
      var callback = list.shift();
      return promise.then(callback);
    default:
      var callback = list.shift();
      var result = promise.then(callback);
      return queue(result, list);
  }
}

function stack(promise, list) {
  switch(list.length) {
    case 0:
      return promise;
    case 1:
      var callback = list.pop();
      return promise.then(callback);
    default:
      var callback = list.pop();
      var result = promise.then(callback);
      return queue(result, list);
  }
}

var PromiseList = function() {
  this.list = [];
}

PromiseList.prototype.reset = function() {
  this.list = [];
};

PromiseList.prototype.push = function(callback) {
  this.list.push(callback);
};

PromiseList.prototype.queue = function() {
  var deferred = Q.defer();
  var result = queue(deferred.promise, this.list);
  deferred.resolve();
  return result;
}

PromiseList.prototype.stack = function() {
  var deferred = Q.defer();
  var result = stack(deferred.promise, this.list);
  deferred.resolve();
  return result;
}

module.exports = PromiseList;