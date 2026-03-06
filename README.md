### 1️⃣ What is the difference between var, let, and const?

These are three ways to declare variables in JavaScript, but they behave differently:

**var** is the old way of declaring variables. It has function scope (or global scope), meaning it's accessible throughout the entire function where it's declared. It also gets "hoisted" to the top, so you can reference it before declaration (though it'll be undefined). You can reassign and redeclare it.

**let** is the modern way introduced in ES6. It has block scope, meaning it only exists within the curly braces `{}` where it's declared (like inside an if statement or loop). You can reassign its value, but you can't redeclare it in the same scope. It's not hoisted in a usable way.

**const** is also block-scoped like let, but once you assign a value to it, you cannot reassign it. However, if it holds an object or array, you can still modify the contents of that object/array—you just can't reassign the variable itself to point to something else. Use const by default unless you know the value needs to change.

### 2️⃣ What is the spread operator (...)?

The spread operator `...` takes something iterable (like an array or object) and "spreads out" its elements or properties.

For arrays, it unpacks all elements. For example, if you have `arr1 = [1, 2, 3]` and you do `arr2 = [...arr1, 4, 5]`, you get `[1, 2, 3, 4, 5]`. It's great for copying arrays or combining them without modifying the originals.

For objects, it spreads out all properties. You can use it to clone objects or merge them: `{...obj1, ...obj2}`. If properties overlap, the later ones overwrite the earlier ones.

It's also useful in function calls to pass array elements as individual arguments: `Math.max(...numbers)`.

### 3️⃣ What is the difference between map(), filter(), and forEach()?

These are all array methods that loop through elements, but they serve different purposes:

**forEach()** simply executes a function for each element. It doesn't return anything (returns undefined). Use it when you need to do something with each item but don't need a new array. It's like a basic loop replacement.

**map()** transforms each element and returns a new array with the transformed values. If you have an array of numbers and want to double them, map returns a new array with all the doubled values. The original array stays unchanged. Use it when you need to transform data.

**filter()** tests each element with a condition and returns a new array containing only the elements that pass the test. If you want only the even numbers from an array, filter returns a new array with just those. Use it when you need to select certain items based on criteria.

Key difference: forEach returns nothing, map returns a transformed array, filter returns a filtered array.

### 4️⃣ What is an arrow function?

An arrow function is a shorter syntax for writing functions, introduced in ES6. Instead of writing `function(x) { return x * 2; }`, you write `(x) => x * 2`.

The syntax is: parameters in parentheses, then `=>`, then the function body. If there's only one parameter, you can skip the parentheses. If the body is a single expression, you can skip the curly braces and the return keyword—it returns automatically.

But arrow functions have an important behavioral difference: they don't have their own `this` context. They inherit `this` from their surrounding scope. This makes them great for callbacks and array methods, but not ideal for object methods or constructors where you need `this` to refer to the object itself.

They also can't be used as constructors and don't have an `arguments` object.

### 5️⃣ What are template literals?

Template literals are a way to write strings using backticks `` ` `` instead of quotes. They make strings much more powerful and readable.

The main feature is interpolation: you can embed variables or expressions directly in the string using `${expression}`. Instead of `"Hello " + name + "!"`, you write `` `Hello ${name}!` ``. The expression inside `${}` gets evaluated and converted to a string.

They also support multi-line strings naturally. You can just hit Enter and keep typing, no need for `\n` or string concatenation across lines.

You can even use expressions and function calls inside: `` `Total: ${price * quantity}` `` or `` `User: ${getUsername()}` ``.

This makes code cleaner and easier to read, especially when building HTML strings or complex messages.

---