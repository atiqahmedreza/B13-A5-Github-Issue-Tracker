1. Difference between var, let, and const:

var: Function-scoped, hoisted, can be redeclared and reassigned.
let: Block-scoped, not hoisted (temporal dead zone), can be reassigned but not redeclared.
const: Block-scoped, not hoisted, cannot be reassigned or redeclared (but objects can be mutated).


2. Spread Operator (...):

Expands an iterable (array/string/object) into individual elements. Used for copying, merging, passing arguments, or destructuring.
[...arr1, ...arr2]  // merge arrays.
Math.max(...numbers)  // pass as arguments.
{...obj1, ...obj2}  // merge objects.


3. Difference between map(), filter(), and forEach():

map(): Transforms each element and returns a NEW array.
filter(): Returns a NEW array with elements that pass a condition.
forEach(): Executes a function for each element, returns undefined (side effects only).


4. Arrow Function:

Shorter syntax for function expressions using =>. Inherits this from parent scope (lexical binding).
javascriptconst add = (a, b) => a + b;
Cannot be used as constructors; no arguments object.


5. Template Literals:

String syntax using backticks ` that allows:

Multi-line strings without escape characters.
Variable interpolation with ${expression}.
Tagged template literals for custom processing.

javascriptconst name = "Atiq";
const msg = `Hello ${name}`;







