const inherits = require('./')
const test = require('ava')


test('basic', t => {
  function A () {
    this.a = 1
  }

  A.prototype.a = 2

  function B () {}

  inherits(B, A)

  t.is(new B().a, 2, 'should abandon A.constructor')
  t.is(B.super_, A, 'super_')
  t.is(new B().constructor, B, 'constructor')
})


test('fake prototype', t => {
  const A = {
    prototype: {
      a: 2
    }
  }

  function B () {}

  inherits(B, A)
  t.is(new B().a, 2, 'inherits')
  t.is(B.super_, A, 'super_')
  t.is(new B().constructor, B, 'constructor')
})


test('multiple levels of inheritance', t => {
  inherits(B, A)
  inherits(C, B)

  function A () { this._a = 'a' }
  A.prototype.a = function () { return this._a }
  function B (value) {
    A.call(this)
    this._b = value
  }
  B.prototype.b = function () { return this._b }
  function C () {
    B.call(this, 'b')
    this._c = 'c'
  }
  C.prototype.c = function () { return this._c }
  C.prototype.getValue = function () { return this.a() + this.b() + this.c() }

  t.is(C.super_, B)

  const c = new C()
  t.is(c.getValue(), 'abc')
  t.is(c.constructor, C)
})


test('can be called after setting prototype properties', t => {
  function A () { this.a = 1 }
  function B () { A.call(this) }
  B.prototype.b = function () { return this.a + 1 }
  inherits(B, A)

  t.is(B.super_, A)
  t.is(new B().b(), 2)
  t.is(new B().constructor, B)
})


test('throw', t => {
  function A () {}

  function B () {}

  function isInvalidArgTypeError (err) {
    return err instanceof TypeError && err.code === 'ERR_INVALID_ARG_TYPE'
  }

  t.throws(() => {
    inherits(undefined, A)
  }, isInvalidArgTypeError)

  t.throws(() => {
    inherits(null, A)
  }, isInvalidArgTypeError)

  t.throws(() => {
    inherits(B)
  }, isInvalidArgTypeError)

  t.throws(() => {
    inherits(B, null)
  }, isInvalidArgTypeError)

  t.throws(() => {
    inherits(B, {})
  }, isInvalidArgTypeError)
})
