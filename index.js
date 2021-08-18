class Emitter {
  constructor() {
    const self = this

    Object.defineProperty(self, "subscriptions", {
      configurable: false,
      enumerable: false,
      value: {},
      writable: false,
    })
  }

  on(obj, eventName, callback) {
    if (!(obj instanceof Emitter)) {
      throw new Error("`obj` must be an Emitter!")
    }

    const self = this
    if (!self.subscriptions) return null

    if (!obj.subscriptions[eventName]) {
      obj.subscriptions[eventName] = []
    }

    obj.subscriptions[eventName].push(callback)
    return self
  }

  off(obj, eventName, callback) {
    if (!(obj instanceof Emitter)) {
      throw new Error("`obj` must be an Emitter!")
    }

    const self = this
    if (!self.subscriptions) return null
    if (!obj.subscriptions[eventName]) return self

    const index = obj.subscriptions[eventName].indexOf(callback)
    obj.subscriptions[eventName].splice(index, 1)
    return self
  }

  emit(eventName, payload) {
    const self = this
    if (!self.subscriptions) return null
    if (!self.subscriptions[eventName]) return self

    self.subscriptions[eventName].forEach(callback => {
      callback(payload)
    })

    return self
  }

  set shouldDestroySelf(value) {
    if (!value) return
    const self = this
    self.subscriptions = null
  }

  destroy() {
    const self = this
    self.shouldDestroySelf = true
    return null
  }
}

if (typeof module !== "undefined") {
  module.exports = Emitter
}

if (typeof window !== "undefined") {
  window.Emitter = Emitter
}
