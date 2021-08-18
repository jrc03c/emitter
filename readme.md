# Intro

```bash
npm install --save @jrc03c/emitter
```

The `Emitter` class defined here is useful for enforcing a "props go down, events go up" OOP pattern. One can start by listening for events, for example:

```js
const Emitter = require("emitter")
const a = new Emitter()
const b = new Emitter()

a.on(b, "foo", () => {
  console.log("b says 'foo'!")
})

b.emit("foo")
// b says 'foo'!
```

But this base class only handles event emission; it doesn't define any particular properties (except a `subscriptions` property by which it keeps track of event handlers). So, properties must be defined in a subclass, like this:

```js
class Person extends Emitter {
  name = "Anonymous"
}
```

Then, to be reactive to prop changes, one can use setters:

```js
class Person extends Emitter {
  _name = "Anonymous"

  get name() {
    return this._name
  }

  set name(newName) {
    this._name = newName
    console.log("Hey! My new name is:", newName)
  }
}
```

# Justification

So, I made this class to help encourage a more "polite" pattern of object interaction in OOP contexts. I know that OOP has its flaws and that it'd probably be better to abandon it altogether, but short of that, I hope this pattern will make my OOP code more organized. I learned the "props go down, events go up" pattern from [Vue](https://vuejs.org), though I can't find that exact phrase in their docs any more. In any case, the point is that objects can no longer directly call each other's methods, which is what (in my code) accounts for a lot of confusion as it becomes increasingly unclear who has what responsibilities. Instead, this pattern forces me to truly treat objects as encapsulated code. At most, then, one object can set another's property values, and it's up to the other object to determine when and how to react to that prop change; and an object can listen for events emitted from another object. As I said, this establishes a more "polite" protocol for interaction among objects.

There are probably better ways of accomplishing the same thing in OOP, and I'm sure this is already a well-known problem with a well-known solution. But it's the solution that works well in Vue contexts, so I'm going with it!
