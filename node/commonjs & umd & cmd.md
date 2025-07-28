# Commonjs & umd & Cmd 


## Commonjs 规范

Commonjs 主要用在 Node 开发上，每个文件就是一个模块，每个文件都有自己的作用域，通过module.exports暴露 成员


通过require()引入模块依赖

当一个js 文件中exports 和modules.exports同时存在，且导出不同对象时，要以modules.exports导出的对象为准，因为本质上，Node中要导出东西时都是通过moduels.exports导出的，（一般情况下，
moduel对象的exports属性的引用指针指向exports对象，但是当modeul.exports的引用指针不指向exports时，导出的东西以module.export为准

**缺点：**
1. 同步模块加载方式不适合浏览器环境
2. 不能非阻塞的并行加载多个模块

## AMD 规范

AMD （Asynchromous Module Definition） 缩写，意为 “异步模块定义”  采用异步方式加载模块，模块的加载不影响它后面的语句运行。所有依赖这个模块的语句都定义在一个回调函数中，等到加载完成，这个回调函数才会执行。

在AMD 中，我们使用`define`定义模块，使用`require`加载模块，不同于`Commonjs` 它需要两个参数

**定义模块**

```js
define(id?,dependencies?,factory);
```

`id` : 是定义的模块名，参数可选，如果没有定义该参数，模块名字应该默认为模块加载器请求的指定脚本名称，如果有该参数，模块名必须顶级的绝对的。
`dependencies` : 是定义的模块中所依赖的 模块数组，也是 可选的，依赖模块优先级执行，并且执行结果按照数组中的排序依次以参数的形式传入 factory。
`factory` : 是模块初始化要执行的函数或对象，是 必需的


**加载模块**

```js
require([module],callback);
```

`module` : 是一个数组，里面的成员就是要加载的模块
`callback` : 加载成功之后的回调函数


```js
require(['./math'], function (math) {
  math.add(2, 3);
});
```


**优点**
1. 适合在浏览器环境中异步加载模块
2. 可以并行加载多个模块
**缺点**
1. 提高了开发成本
2. 不符合通用模块思维方式



## UMD 规范

UMD 是 (Universal Module Definition) 通用模块定义 的缩写。UMD 是 AMD 和 CommonJS 的一个糅合。AMD 是浏览器优先，异步加载；
CommonJS 是服务器优先，同步加载。
既然要通用，怎么办呢？那就先判断是否支持 node 的模块，支持就使用 node；再判断是否支持 AMD，支持则使用 AMD 的方式加载。这就是所谓的 UMD。



```js
(function (window, factory) {
  if (typeof exports === "object") {
    // CommonJS
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    // AMD
    define(factory);
  } else {
    // 浏览器全局定义
    window.eventUtil = factory();
  }
})(this, function () {
  // do something
});

```


## CMD

CMD是SeaJS在推广过程中生产的对模块定义的规范，在Web浏览器端的模块加载器中，SeaJS与RequireJS并称，SeaJS作者为阿里的玉伯。

**SeaJS基本用法**
```js
//a.js
/*
* define 接受 factory 参数，factory 可以是一个函数，也可以是一个对象或字符串，
* factory 为对象、字符串时，表示模块的接口就是该对象、字符串。
* define 也可以接受两个以上参数。字符串 id 表示模块标识，数组 deps 是模块依赖.
*/
define(function(require, exports, module) {
  var $ = require('jquery');

  exports.setColor = function() {
    $('body').css('color','#333');
  };
});

//b.js
//数组中声明需要加载的模块，可以是模块名、js文件路径
seajs.use(['a'], function(a) {
  $('#el').click(a.setColor);
});

```

对于依赖的模块，CMD推崇依赖就近，延迟执行。也就是说，只有到require时依赖模块才执行。