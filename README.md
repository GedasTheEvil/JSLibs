JSLibs
======
Random libs of JavaScript that might be useful

### Closure Style Class style (BEFORE ES6) **Deprecated**


JavaScript is very flexible, however most of the tutorials found on the web are just WRONG. The original prototype based model for classes is fine ONLY if you want to have an object with ALL public methods and properties. What I propose is using the closure-based objects that only get properties AFTER construction.

```javascript
function ClassName() {
   "use strict";
 
   var $public = {},
       $private = {};
 
   $private.construct = function () {
       //Do something 
   };
 
   /**
    * Just appends Hello to a string
    * @param {string} name
    * @return {string}
   */
   $private.makeHello = function (name) {
       return ['Hello', name].join(' ');
   };
 
   /**
    * @param {string} name
    * @return {string}
   */
   $public.sayHello = function (name) {
      return $private.makeHello(name);
   };
 
   // Declaration end
   $private.construct();
   return $public;
}
```

The benefits of this style are:
* not leaking the variables to the global scope if the constructor is called as a function (without `new`)
* no need to use that elusive `this` keyword, refering only to `$public` and `$private` objects instead. Now added event listeners can easily call the methods of the class.

The cons:
* The only way to extend it is using decorating an intance in another class construction.

If the static prototype hybrid is wanted, with minimal changes; the result would be:

```javascript
function ClassName() {
   "use strict";
 
   var $public = this,
       $private = {};
 
   $private.construct = function () {
       //Do something 
   };
 
   /**
    * Just appends Hello to a string
    * @param {string} name
    * @return {string}
   */
   $private.makeHello = function (name) {
       return ['Hello', name].join(' ');
   };
 
   /**
    * @param {string} name
    * @return {string}
   */
   $public.sayHello = function (name) {
      return $private.makeHello(name);
   };
 
   // Declaration end
   $private.construct();
   return $public;
}

ClassName.prototype = {
  //Static methods and properties go here
};
```

However, this patter loses the "not leaking the variables to the global scope if the constructor is called as a function (without `new`)" property.


The Live template for PHPStorm is provided in "JavaScript.xml", as `class` and `sclass` short-names
