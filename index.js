class Emitter {
  #wasDestroyed = false
  #listenersToDestroy = []

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

    if (self.#wasDestroyed) {
      throw new Error("This emitter was already destroyed!")
    }

    if (!self.subscriptions) return null

    if (!obj.subscriptions[eventName]) {
      obj.subscriptions[eventName] = []
    }

    obj.subscriptions[eventName].push(callback)
    self.#listenersToDestroy.push({ obj, eventName, callback })
    return self
  }

  off(obj, eventName, callback) {
    if (!(obj instanceof Emitter)) {
      throw new Error("`obj` must be an Emitter!")
    }

    const self = this

    if (self.#wasDestroyed) {
      throw new Error("This emitter was already destroyed!")
    }

    if (!self.subscriptions) return null
    if (!obj.subscriptions[eventName]) return self

    const index = obj.subscriptions[eventName].indexOf(callback)
    obj.subscriptions[eventName].splice(index, 1)

    if (obj.subscriptions[eventName].length === 0) {
      delete obj.subscriptions[eventName]
    }

    self.#listenersToDestroy = self.#listenersToDestroy.filter(item => {
      return !(
        item.obj === obj &&
        item.eventName === eventName &&
        item.callback === callback
      )
    })

    return self
  }

  emit(eventName, payload) {
    const self = this

    if (self.#wasDestroyed) {
      throw new Error("This emitter was already destroyed!")
    }

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

    Object.keys(self.subscriptions).forEach(channel => {
      delete self.subscriptions[channel]
    })

    self.#listenersToDestroy.forEach(item => {
      const { obj, eventName, callback } = item
      self.off(obj, eventName, callback)
    })

    self.#wasDestroyed = true
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
