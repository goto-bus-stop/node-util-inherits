const inherits = typeof Object.setPrototypeOf === 'function'
  ? function (ctor, superCtor) {
    ctor.super_ = superCtor
    Object.setPrototypeOf(ctor.prototype, superCtor.prototype)
  }

  : typeof Object.create === 'function'
    ? function (ctor, superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }

    : function (ctor, superCtor) {
      ctor.super_ = superCtor
      function F () {}
      F.prototype = superCtor.prototype
      ctor.prototype = new F
      ctor.prototype.constructor = ctor
    }

function ERR_INVALID_ARG_TYPE (message) {
  const err = new TypeError(message)
  err.code = 'ERR_INVALID_ARG_TYPE'
  return err
}

module.exports = function (ctor, superCtor) {

  if (ctor === undefined || ctor === null) {
    throw ERR_INVALID_ARG_TYPE('The constructor to "inherits" must not be ' +
                        'null or undefined')
  }

  if (superCtor === undefined || superCtor === null) {
    throw ERR_INVALID_ARG_TYPE('The super constructor to "inherits" must not ' +
                        'be null or undefined')
  }

  if (superCtor.prototype === undefined) {
    throw ERR_INVALID_ARG_TYPE('The super constructor to "inherits" must ' +
                        'have a prototype')
  }

  inherits(ctor, superCtor)
}
