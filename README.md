# ReadySet

Handy tool which waits for stuff to be ready.

Assumes the things to be watched all emit the same kind of `ready` event.

```javascript
var ReadySet = require('ready-set');

var rs = new ReadySet(
  // below are defaults
  on: 'on',
  readyEvent: 'ready',
  errorEvent: 'error'
);
rs.add(new ReadyEmitter());
rs.add(new WillEmitReady());
rs.add(new EmitReadyToo());
rs.add(new EmitReadyAlso());

// `err` will be set if one of the added instances emits an error event

// you can either listen to the `ready` event
rs.on('ready', function(err, set) {
  console.log(err, set);
});

// or/and pass a callback directly
rs.go(function(err, set) {
  console.log(err, set);
});
``
