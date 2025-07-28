# Vue 3 快速入门

本文介绍了Vue 3的快速入门，包括自定义Hook函数、toRef、其他组合API、新组件等内容。其中，自定义Hook函数可以将setup中使用的组合式API进行封装，toRef可以创建一个ref对象，其value指向另一个对象中的某个属性，新组件包括Fragment、Teleport和Suspense等。此外，Vue 3还对全局API进行了调整，将其调整到应用实例(app)上。（本文章并不包含全部官方文档内容，只是部分常用内容）

# 一、setup

setup 函数的两种返回值：

1. 返回一个对象，则对象中的属性、方法，在模板中均可以直接使用。
2. 返回一个渲染函数：则可以自定义渲染内容

- (**返回一个对象**)这个例子展示了如何在 `setup` 函数中定义数据和方法，并在模板中使用它们。在这个例子中，`setup` 函数返回一个对象，对象中包含了三个属性：`name`、`age` 和 `sayHello`。它们可以直接在模板中使用。当用户点击"说话"按钮时，`sayHello` 方法会弹出一个窗口，显示用户的姓名和年龄。

```jsx
<template>
  <h1>一个人的信息</h1>
  <h2>姓名：{{ name }}</h2>
  <h2>年龄：{{ age }}</h2>
  <button @click="sayHello">说话</button>
</template>
<script>
export default{
  name:"app",
  setup(){
    // 数据
    let name = "张三"
    let age = 18
    // 方法
    function sayHello(){
      alert(`我叫${name},我${age}岁了，你好！！！`)
    }
    return {
      name,
      age,
      sayHello
    }
  }
}
</script>
```

vue3的如果和vue2.x混用，但是在setup中不能访问到Vue2.x的配置，如果两者之间的变量或属性有冲突，以setup中的变量或属性为准。

setup执行的时机：在beforeCreate之前执行一次，this是undefined

setup的参数：

props： 组件外部传递出来，且组件内部声明接受了属性

context：上下文对象

- attrs：值为对象，包含：组件外部传递过来，但没有在props配置中生命的属性
- slots：受到的插槽内容
- emit：分发自定义事件的函数

# 二、Vue3的响应式

## 1. Ref函数（处理基本类型）

<aside>
💡 ref 接受一个参数值并返回一个响应式且可以改变的ref对象。ref对象拥有一个指向内部值得单一属性值.value

</aside>

语法： `const xxx = ref(initValue)`

- 创建一个包含响应式数据的引用对象（reference对象）
- js中操作数据：xxx.value

备注：

- 接受对象可以是基本类型、也可以是对象类型
- 基本类型数据：响应式依然是靠Object.defineProperty()的get和set完成
- 对象类型的数据：内部“求助”Vue3.0中的一个新函数——reactive函数

```jsx
<template>
  <h1>一个人的信息</h1>
  <h2>姓名：{{ name }}</h2>
  <h2>年龄：{{ age }}</h2>
  <h3>工作种类:{{ job.type }}</h3>
  <h3>工作薪水:{{ job.salary }}</h3>
  <button @click="sayHello">说话</button>
  <button @click="changeInfo">修改信息</button>
</template>

<script>
import {ref} from "vue"
export default{
  name:"app",
  setup(){
    // 数据
    let name = ref("张三")
    let age = ref(18)
    let job = ref({
      type:"前端工程师",
      salary:"20k"
    })
    // 方法
    function sayHello(){
      alert(`我叫${name},我${age}岁了，你好！！！`)
    }

    function changeInfo(){
      name.value = "李四"
      age.value = 58
      job.value.type = "后端工程师"
      job.value.salary = '30k'
      console.log(name,age)
    }
    return {
      name,
      age,
      job,
      sayHello,
      changeInfo
    }
  }
}
</script>
```

## 2. reactive

作用： 定义一个对象类型的响应式数据（基本类型不要用它，要用ref函数）

语法： `const 代理对象 = reactive(源对象）接受一个对象（或数组），返回一个代理对象（proxy的实例对象）`

`reactive` 定义的响应式数据是“深层次的”。

内部基于`ES6`的`Proxy`实现，通过代理对象操作源对象内部数据进行操作

我们可以使用`reactive`代替`ref`函数，并且在修改引用类型时不需要使用     `xxx.value.property` 的形势来修改引用类型的数据，直接使用``xxx.property=xxx``来进行修改

```jsx
<script>
import {reactive} from 'vue';
setup(){
	let data = reactive({
      name:'xx',
      age:12
  })
	function changeReactiveData(){
      data.name = "male"
      data.age = 123
  }
	return {
	 data,
	 changeReactiveData
	}
}
</script>
```

## 3. Vue3 中的响应式原理

- vue2.x的响应式
    - 对象类型：通过Object.defineProperty()对属性的读取、修改进行拦截。
    - 数组类型：通过重写更新数组的一系列方法来实现拦截。
    - 缺点：
        - 新增属性、删除属性、界面不会更新
        - 直接通过下标修改数组，界面不会更新
- Vue3.0的响应式
    - 通过Proxy：拦截对象中任意属性的变化，包括：属性值的读取、属性的添加、属性的删除等
    - 通过Reflect（反射）：对被代理对象的属性进行操作

# 三、Computed

```jsx
<template>
    <h1>一个人信息：</h1>
    姓：<input type="text" v-model="person.firstName">
    名：<input type="text" v-model="person.lastName">
    <span>全名：{{ person.fullName }}</span>
    <button @click="test"> Demo 组件</button>
</template>

<script>
import { reactive,computed } from 'vue';

export default{
    name:"Demo",
    props:['name','msg'],
    emits:["sayHello"],
    setup(props,context){
        let person = reactive({
            firstName:'张',
            lastName:"三"
        })
        // 计算属性  只读
        // person.fullName = computed(()=>{
        //     return person.firstName + '-' + person.lastName
        // })
        // 计算属性完整写法
        person.fullName = computed({
            get(){
                return person.firstName +"-" +person.lastName
            },
            set(value){
                const nameArr = value.split("-")
                person.firstName = nameArr[0]
                person.lastName = nameArr[1]
            }
        })
        // Methods
        function test(){
            context.emit("sayHello","333")
        }
        return {
            test,
            person
        }
    }
}
</script>
```

# 五、Watch

```jsx
let mgs = ref("women")
let sum = ref(0)
watch(sum,(newValue,oldValue)=>{
  console.log(newValue,oldValue )
})
watch([sum,msg],(newValue,oldValue)=>{
  console.log(oldValue,newValue)
},{immediate:true,deep:true})
watch(person,(newValue,oldValue)=>{
  console.log("person变化")
  // 此处无法正确获得正确得oldValue， 使用reactive会出现这个问题，因为ref同样求助于reactive，同样也会出现这个问题
})
watch(()=>person.name,(newValue,oldValue)=>{
  console.log("监视对象中单个属性")
})

// 监视某些reactive所定义得一个响应式数据中得属性
watch([()=>person.name,()=>person.lastName],(newValue,oldValue)=>{
    console.log("监听reactive中某些属性得变化")
})
// 特殊情况
// 如果监视的是reactive中某个引用属性，需要开启deep深度监视
```

监听reactive 所定义得响应式数据

1. 此处无法正确获取oldValue
2. 强制开启了深度监听（deep配置无效）

**注意：**

**ref定义的基本数据类型不需要监听xxx.value**

**如果是引用类型，不监听xxx.value就需要开启深度监听**

# 六、自定义Hook函数

本质是一个函数，把setup中使用的组合式API(ref函数、reactive，生命周期、计算属性和监视【即setup中所写的内容】）进行了封装

app.vue

```jsx
<template></template>
<script>
	import {ref} from 'vue';
	import usePoint from '../hooks/usePoint'
	export default{
		name:'App',
		setup(){
			let sum = ref(0)
			let point = usePoint()
			return {sum,point}
</script>
```

usePoint.js

```jsx
import {reactive,onMounted,onBeforeUnmounted} from 'vue'

export default function(){
	let point = reactive({
		x:0,
		y:0
	})
	
	// 实现鼠标打点方法
	function savePoint(event){
		point.x = event.pageX
		point.y = event.pageY
	}

	onMounted(()=>{
		window.addEventListener('click',savePoint);
	})

	onBeforeUnmount(()=>{
		window.removeEventListener('click',savePoint);
	})

	return point;

}
```

# 七、toRef

作用：创建一个ref对象，其value指向另一个对象中的某个属性,这样创建的ref与其源属性保持同步：改变源属性的值将更新ref的值，反之亦然。

语法：`const name = toRef(person,”name”)`

应用：要将响应式对象中的某个属性单独提供给外部使用

扩展：`toRefs`和`toRef`功能一致，但可以批量创建多个ref对象，语法：`toRefs(person)`

```jsx
<template>
    <h2>姓名：{{ name }}</h2>
		// 使用 toRef后可以省略person.xxx
    <h2>年龄：{{ age }}</h2>
    <h2>薪资：{{ job.j1.salary }}</h2>
		<!--改变ref对象，对应的对象中的属性也会跟着改变-->
    <button @click="name+='ddd'">改变姓名</button>
    <button @click="()=>age++">+1</button>
    <button @click="()=>job.j1.salary++">+1</button>
</template>
<script>
import { reactive, toRef,toRefs } from 'vue';
export default {
    name: '',
    setup(props, context) {
        let person = reactive({
            name: "Notion",
            age: 12,
            job: {
                j1: {
                    salary: 20
                }
            }
        })
        function changeName(){
          
            person.name = person.name +"dddd"
            console.log(person)
        }
        return {
            person,
            name: toRef(person, 'name'),
            ...toRefs(person),
            changeName
        }
    }
}
</script>
```

# 八、其他组合(Composition)API

## 1. shallowReactive和shallowRef

### shallowReactive()

`shallowReactive` 是 `reactive()`的浅层作用形式

**类型**

```jsx
function shallowReactive<T extends object>(target:T):T
```

**详细信息**

和`reactive()`不同，这里没有深层级的转换：一个浅层响应式对象里只有根级别的属性是响应式的。属性的值会被原样存储和暴露，这也意味着值为ref的属性不会被自动解包了。

**示例**

```jsx
const state = shallowReactive(
	foo:1,
	nested:{
		bar:2
	}
})
// 更改状态自身的属性是响应式的
state.foo++
// ... 但下层嵌套对象不会被转为响应式
isReactive(state.nested) // false

// 不是响应式的
state.nested.bar++
```

### ShallowRef()

`ref()`的浅层作用形式

**类型**

```jsx
function shallowRef<T>(value:T):ShallowRef<T>
interface ShallowRef<T>{
	value:T
}
```

**详细信息**

浅层ref的内部值将会原样存储和暴露，并且不会被深层递归地转为响应式。只有对.value的访问是响应式的

`shallowRef()`常常用于对大型数据结构的性能优化或者是与外部的状态管理系统集成。

**示例**

```jsx
const state = shallowRef({count:1})
// 不会触发更改
state.value.count = 2
// 会触发更改
state.value = {count:2}
```

## 2.readonly和shallowReadonly

### readonly

接受一个对象（不论是响应式还是普通的）或者是一个ref，返回一个原值只读的代理

**详细信息**

制度代理是深层的：对任何嵌套属性的访问都将是只读的。它的ref解包行为与`reactive()`相同，但解包得到的值是只读的。

要避免深层级的转换行为，请使用`shallowReadonly()`作替代

**示例**

```jsx
const original = reactive({count:0})
const copy = readonly(original)
watchEffect(()=>{
	// 用来做响应性追踪
	console.log(copy.count)
})
// 更改源属性会触发其以来的侦听器
original.count++
// 更改只读副本将会失败，并会得到一个警告
copy.count++ // warning!
```

## 3. toRaw于markRaw

### toRaw()

根据一个Vue创建的代理返回其原始对象。

**详细信息**

`toRaw()`可以返回由`reactive()`、`readonly()`、`shallowReactive()`或者`shallowReadonly()`创建的代理对应的原始对象。

这是一个可以用于临时读取而不引起代理访问/跟踪开销，或是写入而不触发更改的特殊方法。不建议保存原始对象的持久引用，谨慎使用。

**示例**

```jsx
const foo = {}
const reactiveFoo = reactive(foo)

console.log(toRaw(reactiveFoo)===foo) // true
```

### markRaw()

将一个对象标记为不可被转为代理。返回该对象本身。

**示例**

```jsx
const foo = markRaw({})
console.log(isReactive(reactive(foo)))  // false

// 也适用于嵌套在其他响应性对象
const bar = reactive({foo})
console.log(isReactive(bar.foo))  // false
```

## 4. customRef()

创建一个自定义的ref，显示生命对其以来追踪和更新触发的控制方式

**详细信息**

customRef ()预期接收一个工厂函数作为参数，这个工厂函数接受track和trigger两个函数作为参数，并返回一个带有get和set方法的对象。

一般来说，track()应该在get()方法中调用，而tigger()应该在set()中调用。然而事实上，你对何时调用、是否应该调用他们有完全的控制权。

**示例**

创建一个防抖ref，即旨在最近一次set调用后的一段固定间隔后再调用

```jsx
// xxx.js
import {customRef} from 'vue'

export function useDebouncedRef(value,delay = 200){
    let timeout
    return customRef((track,trigger)=>{
        return {
            get(){
                track() // 通知vue追踪value变化
                return value
            },
            set(newValue){
                clearTimeout(timeout)
                timeout = setTimeout(() => {
                    value = newValue
                    trigger() // 同志Vue重新解析模板
                }, delay);
            }
        }
    })
}

// Demo.vue
<template>
    <input type="text" v-model="text">
    <h1>{{ text }}</h1>
</template>

<script>
import {useDebouncedRef} from '../util/index'
export default {
    name:"",
    setup(){
        const text = useDebouncedRef("hello")
        return {
            text
        }
    }
}
</script>
```

## 5. 响应式数据的判断

- isRef： 检查一个值是否为一个ref对象
- isReactive：检查一个对象是否是由reactive创建的响应式代理
- isReadonly：检查一个对象是否是由readonly创建的只读代理
- isProxy：检查一个对象是否是由reactive或者readonly方法创建的代理

# 九、新组件

## 1. Fragment（片段）

- vue2中组件必须有一个根标签
- vue3中：组件可以没有根标签，内部会将多个标签包含再一个Fragment虚拟元素中
- 好处：减少标签层级，减小内存占用

## 2. Teleport （传送）

一种能将我们的组件html移动至指定位置的技术

## 3. Suspense

等待一部组件时渲染一些额外内容，让应用有更好的体验

# 十、Vue3其他改变

## 1. 全局API的转移

- 例如：注册全局组件、注册全局指令等
- vue3对这些API作出调整，将全局API调整到应用实例(app)上
    
    
    | 2.x 全局API | 3.x实例AP |
    | --- | --- |
    | Vue.config.xxx | app.config.xxx |
    | Vue.config.productionTip | 移除 |
    | Vue.Component | app.component |
    | Vue.directive | app.directive |
    | Vue.mixin | app.mixin |
    | Vue.use | app.use |
    | Vue.prototype | app.config.globalProperties |
- 移除KeyCode作为v-on的修饰符，同时也不支持config.keyCodes
- 移除`v-on.native`修饰符
- 移除过滤器（filter），推荐计算属性和方法调用来替代