const Emitter = require(".")

test("", () => {
  const a = new Emitter()
  const b = new Emitter()
  let message = ""
  const blah = () => (message = "blah")
  a.on(b, "foo", blah)

  expect(Object.keys(a.subscriptions).length).toBe(0)
  expect(Object.keys(b.subscriptions).length).toBe(1)
  expect(b.subscriptions["foo"].length).toBe(1)
  expect(b.subscriptions["foo"][0]).toBe(blah)

  b.emit("foo")
  expect(message).toBe("blah")

  const c = new Emitter()
  const whatevs = () => (message = "goodbye")
  a.on(c, "bar", whatevs)

  expect(Object.keys(a.subscriptions).length).toBe(0)
  expect(Object.keys(b.subscriptions).length).toBe(1)
  expect(b.subscriptions["foo"].length).toBe(1)
  expect(b.subscriptions["foo"][0]).toBe(blah)
  expect(Object.keys(c.subscriptions).length).toBe(1)
  expect(c.subscriptions["bar"].length).toBe(1)
  expect(c.subscriptions["bar"][0]).toBe(whatevs)

  c.emit("bar")
  expect(message).toBe("goodbye")

  a.destroy()
  expect(Object.keys(a.subscriptions).length).toBe(0)
  expect(Object.keys(b.subscriptions).length).toBe(0)
  expect(Object.keys(c.subscriptions).length).toBe(0)

  expect(() => {
    a.emit("something")
  }).toThrow()

  expect(() => {
    a.on(b, "something", () => {})
  }).toThrow()

  expect(() => {
    a.on(c, "something", () => {})
  }).toThrow()

  expect(() => {
    c.on(a, "dead", () => {})
  }).toThrow()

  expect(() => {
    a.emit("dead")
  }).toThrow()
})
