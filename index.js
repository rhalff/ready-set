'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');

function ReadySet(config) {
  config = config || {};
  this.listenMethod = config.on || 'on';
  this.readyEvent = config.readyEvent || 'ready';
  this.errorEvent = config.errorEvent || 'error';
  this.queue = [];
  this.busy = 0;
  this._cb = function() {};
  this._go = false;
}

util.inherits(ReadySet, EventEmitter);

ReadySet.callback = function() {
  setTimeout(this.check.bind(this), 0);
};

ReadySet.err = function(err) {
  this.err = err;
};

ReadySet.prototype.add = function(obj) {
  this.busy++;
  this.queue.push(obj);
  obj[this.listenMethod](this.readyEvent, ReadySet.callback.bind(this));
  obj[this.listenMethod](this.errorEvent, ReadySet.err.bind(this));
  return obj;
};

ReadySet.prototype.check = function() {
  this.busy--;
  if (this._go && this.busy === 0) {
    this._finish(null);
  } else if (this.err) {
    this._finish(this.err);
  }
};

ReadySet.prototype._finish = function(err) {
  var queue;
  this._go = false;
  queue = this.queue;
  this.queue = null;
  this.queue = [];
  if (this._cb) {
    this._cb(err, queue);
  }
  this.emit(this.readyEvent, err, queue);
};

ReadySet.prototype.go = function(cb) {
  this._go = true;
  if (cb) {
    this._cb = cb;
  }
  this.check();
};

module.exports = ReadySet;
