var test = require('tap').test;
var ReadySet = require('../index');
var EventEmitter = require('events').EventEmitter;

test('Be ready', function (t) {

  t.plan(8);

  var i;
  var result = [];
  var rm = new ReadySet();

  // allow error to be emitted, will just quit.

  rm.on('ready', function(err, res) {
    t.equal(null, err, 'err must be null');
    t.deepEqual(res, result, 'result is all those ready');
    t.equal(rm.busy, 0, 'non are busy');
    t.equal(rm.queue.length, 0, 'queue is empty');
    t.end();
  });

  for (i = 0; i < 10; i++) {
    var em = rm.add(new EventEmitter());
    result.push(em);
    if (i < 5) {
      // not meant to track what is emitted
      // just meant to track when all is ready
      em.emit('ready', i);
    }
  }

  for (i = 5; i < 10; i++) {
    result[i].emit('ready', i);
  }

  rm.go(function(err, res) {
    t.equal(null, err, 'err must be null');
    t.deepEqual(res, result, 'result is all those ready');
    t.equal(rm.busy, 0, 'non are busy');
    t.equal(rm.queue.length, 0, 'queue is empty');
  });

});

test('Catch error', function (t) {

  t.plan(2);

  var i;
  var result = [];
  var rm = new ReadySet();

  // allow error to be emitted, will just quit.

  rm.on('ready', function(err) {
    t.type(err, 'Error', 'error event, err must be an Error');
    t.end();
  });

  for (i = 0; i <= 5; i++) {
    var em = rm.add(new EventEmitter());
    result.push(em);
    if (i === 5) {
      // not meant to track what is emitted
      // just meant to track when all is ready
      em.emit('error', Error('darn'));
    }
  }

  rm.go(function(err) {
    t.type(err, 'Error', 'error callback, err must be an Error');
  });

});
