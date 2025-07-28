# React review

```
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

# 一、react类式组件的this指向问题

react类式组件只有通过实例调用类中的方法，类中的方法的this才是类的实例，

下面代码，点击，输出this为undfined,这是因为，changeWeather作为onClick的回调，所以不是通过实例来调用的，是直接调用，加上react类中的方法默认开启了局部的严格模式，所以this指向为undefined

**示例**

```jsx
import React, { Component } from 'react'

export default class ThisDemo extends Component {
    constructor(props){
        super(props)
        this.state = {isHot:false}
    }
    changeWeather(){
       console.log(this)  // undefined
    }
  render() {
    const {isHot} = this.state
    return (
      <div>
        <h1 onClick={this.changeWeather}>今天天气很{isHot?'炎热':'凉爽'}</h1>
      </div>
    )
  }
}
```

**如何解决**

1. 使用bind改变this指向

```jsx
export default class ThisDemo extends Component {

    constructor(props){
        super(props)
        this.state = {isHot:false}
        this.changeWeather = this.changeWeather.bind(this) // 改变this指向
    }
}
```

1. 使用箭头函数（常规react组件精简写法）

```jsx
import React, { Component } from 'react'
export default class ThisDemo extends Component {
  state = {isHot:false,wind:'微风'}
  changeWeather = ()=>{
     console.log(this)  
  }
  render() {
    const {isHot} = this.state
    return (
      <div>
        <h1 onClick={this.changeWeather}>今天天气很{isHot?'炎热':'凉爽'}</h1>
      </div>
    )
  }
}
```

# 二、state

## 1. 定义

```jsx
export default class ThisDemo extends Component {
    constructor(props){
        super(props)
        this.state = {isHot:false}
    }
  render() {
    const {isHot} = this.state
    return (
      <div>
        <h1>今天天气很{isHot?'炎热':'凉爽'}</h1>
      </div>
    )
  }
}
```

## 2.正确使用state

1. 不能直接修改state，需要使用`setState()`进行修改，直接修改不会重新渲染组件。构造函数是唯一可以给 `this.state` 赋值的地方：****
    
    ```jsx
    // wrong
    this.state.comment = 'hello'
    
    // correct
    this.setState({comment:'hello'},callback)
    ```
    
2. state的更新可能是异步的：出于性能的考虑，React可能会将多个`setState`调用合并成一个调用。因为this.props和this.state可能会异步更新，所以不要以来他们的值来更新下一个状态。
    
    ```jsx
    // Wrong
    this.setState({
    	counter:state.counter + props.increment
    })
    
    // Correct
    this.setState((state,props) => (
    	{
    		counter:state.counter + props.increment
    	}
    ),callback)
    ```
    
3. state的更新会被合并
    
    ```jsx
    constructor(props) {
      super(props);
      this.state = {
        posts: [],
        comments: []
      };
    }
    
    componentDidMount() {
      fetchPosts().then(response => {
        this.setState({
          posts: response.posts
        });
      });
    
      fetchComments().then(response => {
        this.setState({
          comments: response.comments
        });
      });
    }
    
    // 这里的合并是浅合并，所以 this.setState({comments}) 完整保留了 this.state.posts， 但是完全替换了 this.state.comments。
    ```
    

# 三、props

无论是函数组件还是类式组件，都绝不能修改自身props

## 1. 函数组件

```
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

```jsx
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}

// 使用
<Avatar user={props.author} />
```

## 2. 类式组件

```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

## 3. 批量传递props

```jsx
let person = {
	name:"",
	age:12,
	subject:'Math'
}

<Person {...person} />

// 注意：这可不是对象的解构赋值，而是react本身的实现，且仅仅适用于标签上的传递
```

## 4. 对props进行限制

```jsx
npm i prop-types -S
```

类式组件写法

```jsx
import React, { Component } from "react";
import PropTypes from 'prop-types'
export default class PropLimit extends Component {

    // 对标签属性进行类型、必要性限制
    static propTypes = {
        name:PropTypes.string.isRequired,
        age:PropTypes.number,
        sex:PropTypes.string
    }

    // 指定默认标签属性值

    static defaultProps = {
        sex: '男',
        age:18
    }

  render() {
    return <div>
        <h1>{this.props.age}</h1>
        <h1>{this.props.sex}</h1>
        <h1>{this.props.name}</h1>
    </div>;
  }
}
```

## 5. 函数组件使用props

```jsx
import React from "react";
import PropTypes from 'prop-types'
function FPropLimit(props) {
  return (
    <div>
      <h1>{props.age}</h1>
      <h1>{props.sex}</h1>
      <h1>{props.name}</h1>
    </div>
  );
}

FPropLimit.propTypes = {
    name:PropTypes.string.isRequired,
    age:PropTypes.number,
    sex:PropTypes.string
}
FPropLimit.defaultProps = {
    sex: '男',
    age:18
}
export default FPropLimit
```

# 四、ref

## 1. 字符串形式ref(不推荐）

这是一个过时得API

```jsx
import React, { Component } from 'react'

export default class RefDemo extends Component {
  getRefs=()=>{
      console.log(this.refs.input.value)
  }    
  render() {
    return (
      <div>
        <input ref="input"></input>
        <button onClick={this.getRefs}>获取内容</button>
      </div>
    )
  }
```

## 2. 回调形式得ref

```jsx
import React, { Component } from 'react'

export default class RefDemo extends Component {
	getRefs=()=>{
	    console.log(this.input2.value)
	}   
	getInput = (currentNode)=>{
      console.log("this. currentNode")
      this.input2 = currentNode
  }
  render() {
    return (
      <div>
	       <input ref={(currentNode)=>{this.input2 = currentNode}}></input>
					{// 或者}
					<input ref={this.getInput}></input>
         <button onClick={this.getRefs}>获取内容</button>
      </div>
    )
  }
}
```

回调ref中调用次数问题,内联写法，ref 会在更新时调用两次，使用class类得方式（getInput)，可以避免两次调用，但实际使用没有影响

## 3. createRef

```jsx
import React, { Component } from "react";

export default class RefDemo extends Component {
  myRef = React.createRef();

  getRefs = () => {
    console.log(this.myRef.current.value);
  };
  render() {
    return (
      <div>
        <button onClick={this.getRefs}>获取内容</button>
        <input ref={this.myRef}></input>
      </div>
    );
  }
}
```

# 五、受控组件和非受控组件

非受控组件将数据存储在`DOM`中，而不是组件内，这比较类似于传统的`HTML`表单元素。

1. 非受控组件的值不受组件自身的`state`和`props`控制
2. 非受控组件使用`ref`从`DOM`中获取元素数据

受控组件

1. 受控组件通过`props`获取其当前值，并通过回调函数(比如`onChange`)通知变化
2. 表单状态发生变化时，都会通知`React`，将状态交给`React`进行处理，比如可以使用`useState`存储
3. 受控组件中，组件渲染出的状态与它的`value`或`checked`属性相对应
4. 受控组件会更新`state`的流程

**受控组件示例代码**

```jsx
export default function App() {
    const [name, setName] = useState('');
  
    const handleNameChange = e => {
      setName(e.target.value);
    }
  
    return (
      <div className="App">
        <div>hello {name}</div>
        姓名：<Input onChange={handleNameChange} />
      </div>
    );
  }
```

# 六、生命周期

## React 16.0前

![Untitled](React%20review/Untitled.png)

- `shouldComponentUpdate`在`props`和`state`更新时都会触发，返回`true`则继续更新，返回`false`不更新，是可以提升应用性能得生命周期函数；
- 在更新阶段的几个生命周期中不能使用`setState`，（`shouldComponentUpdate`,`componentWillUpdate`,`render`,`componentDidUpdate`)容易造成无限循环，除非通过某些判断停下来；
- `componentWillReceiveProps`父组件传递的props发生改变，即传入`new props`后会调用，并且接受一个参数`props`

**示例**

```jsx
import React, { Component } from "react";

export default class LifeCycle extends Component {
  componentWillMount() {
    console.log("componentWillMount...");
  }

  componentDidMount() {
    console.log("componentDidMount...");
  }

  componentWillReceiveProps() {
    console.log("componentWillReceiveProps...");
  }

  shouldComponentUpdate() {
    console.log("shouldComponentUpdate...");
    return true;
  }

  componentWillUpdate() {
    console.log("componentWillUpdate...");
  }

  componentDidUpdate(preProps,preState) {
    console.log("componentDidUpdate...");
  }

  componentWillUnmount() {
    console.log("componentWillUnmount...");
  }

  changeHot = () => {
    console.log(this.state.isHot);
    this.setState({ isHot: !this.state.isHot });
  };

  state = {
    isHot: false,
  };

  render() {
    console.log("render...");
    return (
      <div>
        <div>Life cycle{this.state.isHot ? "热" : "冷"}</div>
        <button onClick={this.changeHot}>改变内容</button>
      </div>
    );
  }
}
```

## 2. React v16.3生命周期

![Untitled](React%20review/Untitled%201.png)

新增了两个生命周期，弃用了三个生命周期

新增的生命周期

- `getDerivedStateFromProps` 接收一个props参数和一个state参数，适用罕见用例，即state的值任何时候都取决于props，
    
    ```jsx
    import React, { Component } from "react"
    export default class LifeCycle extends Component {
    	// 必须是静态的，必须返回一个状态对象
    	static getDerivedStateFromProps(props,state){
    	  return props  // state任何时候都取决于props
      }
      render() {
        console.log("render...");
        return (
          <div>
          </div>
        );
      }
    }
    ```
    
- `getSnapshotBeforeUpdate` 在最近一次渲染输出之前调用，使得组件能在发生更改之前从DOM中捕获一些信息（例如：滚动位置）。此生命周期的任何返回值将作为参数传递给`componentDidUpdate()`。
    
    ```jsx
    getSnapshotBeforeUpdate(){
    	return {
    		msg:"1"
    	}
    }
    
    componentDidUpdate(preProps,preState,data){
    		console.log(data) // {msg:"1"}
    }
    ```
    

弃用的生命周期

- `componentWillMount`
- `componentWillUpdate`
- `componentWillReceiveProps`

# 七、 React Router

## 1. React Router v5

**路由的基本使用**

1. 使用`BrowerRouter`包裹App,除了该组件外还有`HashRouter`。

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'antd/dist/reset.css';
import {BrowserRouter} from 'react-router-dom'
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

1. 路由简单使用示例

```jsx
import Login from "./views/Login/Login";
import Layout from "./views/Layout/Layout";
import {Route,Link} from 'react-router-dom'

function App() {
  return(
    <article>
      <header>
        <ul style={{display:'flex'}}>
          <li>
            <Link to="/login">登录</Link >
          </li>
          <li>
            <Link to="/layout">布局</Link >
          </li>
        </ul>
      </header>
      <main style={{border:'1px solid black',height:'200px'}}>
          <Route path="/login" component={Login}/>
          <Route path="/layout" component={Layout}/>
      </main>
    </article>
  )
  
}
export default App;
```

**路由组件与一般组件**

1. 任何一个拥有路由跳转功能的React应用的核心都必须是一个路由组件，对于Web项目来说，`react-router-dom`提供了`<BrowerRouter>`和`<HashRouter>`这两种路由。它们会创建一个专业的history对象。
2. 路由组件始终会接收到三个固定属性：`history`、`location`、`match`

**路由匹配组件**

- `<Route>`
    - 路由匹配组件通常比较`<Route>`的path属性和当前页面地址栏路径来工作。当一个`Route`匹配成功，它会渲染出对应的内容，当匹配不成功时，任何内容都不会被渲染出来。当一个`Route`没有`path`属性时，它对任何路径都会匹配成功
    - 你可以设置 exact属性来要求精准匹配，默认模糊匹配
        
        ```jsx
        <Route exact path="/about" component={About}/>
        ```
        
    - 对于该组件，你可以设置三个属性：`component`,`render`,`children`来渲染出对应的内容。
        - 当你有一个已存在的组件，想要渲染时应该使用`component`。
        - 当你必须传递一些参数变量给组件时应该使用`render`属性，它采用内联函数的形式。不要使用`component`属性来渲染一个带有参数变量的内联函数组件，这将会导致不必要的组件的挂在和卸载。
        
        **示例**
        
        ```jsx
        const Home = () => <div>Home</div>
        
        const App = () => {
        	const someVariable = true;
        	
        	return (
        		<Switch>
        			<Route exact path="/" component={Home} />
        			<Route path="/about" render={props => <About {...props} extra={someVariable} />}/>
        			
        			{/* 不要这样做 */}
        			<Route path="/contact" component={props => <Contact {...props} extra={someVariable} />} />
        		</Switch>
        	)
        ```
        
- `<Switch>`
    - `Switch`将多个`Route`组合在一起，这不是必须的。组合在一起的目的时单一匹配，即仅渲染当前路径匹配的第一个子元素。
    
    ```jsx
    <Switch>
      <Route path="/login" component={Login}/>    路径匹配到就会显示
      <Route path="/layout" component={Layout}/>  路径匹配到就会显示
      <Route path="/login" component={Login} />   <!-- 这里的组件将不会显示-->
    	<Route component={Always} />   <!-- 这里的组件将会一直显示-->
    </Switch>
    ```
    

导航组件

- `React Router` 提供了`< Link >`组件用来在你的应用中创建超链接。`replace`属性可写，`<Link>`会在页面的任何地方被渲染成< a >标签
- `< NavLink >`是一种特殊的`<Link>`组件，当她的to属性匹配地址栏的路径时，她渲染成的`<a>`标签会带有'active'的样式。
- 如果你想要强制跳转，你可以使用`< Redirect >`。当一个`< Redirect >`组件被渲染时，她会导航到其to属性匹配的路径。

```jsx
<Link to="/">Home</Link>
// <a href='/'>Home</a>

// location = { pathname: '/react' }
<NavLink to="/react" activeClassName="hurray">
  React
</NavLink>
// <a href='/react' className='hurray'>React</a>

<Redirect to="/login" />
```

**NavLink与封装NavLink**

Link与NavLink 的区别在于，NavLink在被激活时会被赋予一个样式类来表现激活的样式，默认为active

我们可以进行二次封装NavLink，方便之后对NavLink的一些列设置进行更改

**示例**

```jsx
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
export default class MyNavLink extends Component {
  render() {
    return (
      <NavLink {...this.props}></NavLink>
    )
  }
}
```

**嵌套路由**

1. 注册子路由时要写上父路由的path值
2. 路由匹配是按照注册路由的顺序进行的

**向路由组件传递参数**

- 传递param参数
    
    ```jsx
    <MyNavLink to={`/layout/${data[0].id}/${data[0].content}`}>布局</MyNavLink>
    <Route path="/layout/:id/:content" component={Layout}/>   // 声明接受内容
    
    // 这样在组件中的props.match.params中就包含了该信息了
    ```
    
- 传递search参数(不需要声明接收）
    
    ```jsx
    <MyNavLink to="/login?id=02&content=02">登录</MyNavLink>
    
    import qs from 'querystring'
    export default function Login(props) {
        console.log(props,"login")
    
        console.log(qs.parse(props.location.search.slice(1)),"qs"); //
    }
    ```
    
- 传递state参数(不需要声明接收)
    
    ```jsx
    <MyNavLink to={{pathname:'/layout',state:{id:'03',content:'03'}}} children="myNavlink"/>
    
    // props.location.state中获取数据
    ```
    

**withRouter的使用**

一般组件没有像路由组件的API，不能使用编程式路由导航，像`this.props.history.goBack()`等

withRouter是一个函数，接受一个一般组件，可以给一般组件加上路由组件所具有的属性

```jsx
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
class Help extends Component {
  render() {
		console.log(this.props.history)
    return <div>Help</div>;
  }
}

export default withRouter(Help)
```

**路由懒加载 lazyLoad**

## 2. react router v6

**变动内容**

- 内置组件变化：移除<Switch/>，新增<Routes/>
- 语法变化：component={About} 改为element={<About/>}等
- 新增多个hook：useParams、useNavigate、useMatch等。
- 官方明确推荐函数式组件

**重定向**

```jsx
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./views/Home";
import About from "./views/About";
function App() {
  return (
    <div className="App">
      <div>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/home">Home</NavLink>
      </div>

      <div>
        <Routes>
          <Route path="/about" element={<About/>}></Route>
          <Route path="/home" element={<Home/>}></Route>
          <Route path="/" element={<Navigate to="/about"/>}></Route>  {//重定向}
        </Routes>
      </div>
    </div>
  );
}

export default App;
```

**<Routes/>和<Route/>**

1. `Routes`和Route配合使用，且必须Routes包裹Route
2. `Route`相当于if语句，如果其路径与当前URL匹配，则呈现其对应的组件
3. `<Route caseSensitve>`属性用于指定：匹配时是否区分大小写（默认false)。
4. `<Route>`也可以嵌套使用，且可以配合`useRoutes()`配置”路由表”,但需要通过`<Outlet>`组件来渲染其子路由。

**路由表的使用**

```jsx
// app.js
import { NavLink, useRoutes } from "react-router-dom";
import "./App.css";
import routes from './routes/index'
function App() {
  const elements = useRoutes(routes)
  return (
    <div className="App">
      <div>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/home">Home</NavLink>
      </div>

      <div>{elements}</div>
    </div>
  );
}

export default App;

// routes
import { Navigate } from "react-router-dom";
import Home from "../views/Home";
import About from "../views/About";
import News from "../views/News";
import Message from '../views/Message'

const routes = [
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/home",
    element: <Home />,
    children:[
      {
        path:'news',
        element:<News />
      },
      {
        path:"message",
        element:<Message />
      }
    ]
  },
  {
    path: "/",
    element: <Navigate to="/about" />,
  },
];

export default routes

// home.jsx
import React from 'react'
import { NavLink,Outlet } from 'react-router-dom'
export default function Home() {
  return (
    <div>
      Home
      <NavLink to="news">News</NavLink>
      <NavLink to="message">Message</NavLink>
      <Outlet></Outlet>
    </div>
  )
}
```

**路由的传参**

- params(使用`useParams` hook）
    - 定义路径，生命接收内容
    - 向路径传递对应内容
    - 组件中使用useparams()获取params参数
    
    ```jsx
    // 声明接收内容
    {
    	path:'message/:id/:content,
    	element:<Message />
    }
    // 向路径传递对应内容
    <Link to={`/message/${data[0].id}/${data[0].content}`}/>
    // 组件中使用useParams()获取内容
    import React from 'react'
    import {useParams} from 'react-router-dom'
    
    export default function Detail(){
    	const {id,title,content} useParams()
    	return (
    		<ul>
    			<li>{id}</li>
    			<li>{title}</li>
    			<li>{content}</li>
    		</ul>
    	)
    }
    ```
    
- search
    
    ```jsx
    import React from "react";
    import { useSearchParams } from "react-router-dom";
    export default function News() {
      const [search, setSearch] = useSearchParams();
      console.log(search.get("id"));
      console.log(search.get("content"));
      return (
        <div>
          news
          <button onClick={() => setSearch('id=005&content="new content')}>
            点击更新接收到的参数
          </button>
        </div>
      );
    }
    ```
    
- state  （useLocation)
    
    ```jsx
    // 传递内容
    <NavLink
      to="/about"
      state={{ 
        id: "0023",
        content: "state_content",
      }}
    >
      About
    </NavLink>
    
    // 获取内容
    import React from 'react'
    import { useLocation } from 'react-router-dom'
    
    export default function About() {
        const {state:{id,content}} = useLocation()
      return (
        <div>
          About{id}{content}
        </div>
      )
    }
    ```
    
    **编程式路由导航( useNavigate())**
    
    ```jsx
    const navigate = useNavigate();
    function routerChange() {
      navigate("/about")
    	// 跳转子路由
      navigate('news',{
          replace:false,
          state:{
              id:'1',
              content:'2'
          }
      })
    	// 前进
    	navigate(1)
    	// 后退
    	navigate(-1)
    }
    ```
    
    **useInRouterContext()**
    
    如果组件在<Router>的上下文中呈现，则**useInRouterContext钩子返回true，否则返回false**
    
    只要被HashRouter或者BrowserRouter包裹，就是在路由的上下文环境中
    
    **useNavigationType()**
    
    作用：返回当前导航类型（用户是如何来到当前页面的）
    
    返回值：POP、PUSH、REPLACE 
    
    备注：POP是指在浏览器中直接打开了这个路由组件（刷新页面）
    
    **useOutlet()**
    
    作用：用来呈现当前组件中渲染的嵌套路由
    
    示例代码：
    
    ```jsx
    const result = useOutlet()
    console.log(result)
    // 如果嵌套路由没有挂载，则result为null
    // 如果嵌套路由已经挂载，则展示嵌套的路由对象
    ```
    
    **useResolvedPath()**
    
    作用：给定一个URL值，解析其中的path\search\hash值
    

# 八、redux

![Untitled](React%20review/Untitled%202.png)

## 1. redux 在react中应用

```jsx
//组件
import React from "react";
import store from "../redux/store.js";
import {
  createDecrementAction,
  createIncrementAction,
  createIncrementAsyncAction,
} from "../redux/count_action";
export default function Count() {
  function increment() {
    store.dispatch(createIncrementAction());
  }

  function decrement() {
    store.dispatch(createDecrementAction());
  }

  function asyncIncrement() {
    store.dispatch(createIncrementAsyncAction(1, 1000));
  }

  store.subscribe(() => console.log(store.getState()));
  return (
    <div>
      <div> 当前求和:{store.getState().value}</div>

      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={asyncIncrement}>异步+</button>
    </div>
  );
}

// store
import { createStore,applyMiddleware } from "redux";

import thunk from'redux-thunk'
import countReducer from './count_reducer'

export default createStore(countReducer,applyMiddleware(thunk))

// reducer.js
function count_reducer(state = { value: 0 }, action) {
  switch (action.type) {
    case "count/incremented":
        console.log("__+++++")
      return { value: state.value + 1 };
    case "count/decremented":
      return { value: state.value - 1 };
    default:
      return state;
  }
}

export default count_reducer;

// action.js 
export const createIncrementAction = data => ({type:'count/incremented',data})
export const createDecrementAction = data => ({type:'count/decremented',data})
export const createIncrementAsyncAction = (data,time)=>{
    return (dispatch)=>{
        setTimeout(()=>{
            dispatch(createIncrementAction(data))
        },time)
    }
}

// 全局使用store.subscribe订阅状态更新并更新ui
//  index.js
import store from "./redux/store";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

store.subscribe(() => {
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
});
```

## 2. react-redux

1. 所有的ui组件都应该包裹一个容器组件，它们时父子关系
2. 容器组件是正真和redux打交道，里面可以随意使用redux的api
3. ui组件中不能使用任何erdux的api
4. 容器组件会传给ui组件：（1）redux中所保存的状态；（2）用于操作状态的方法
5. 容器给ui传递：状态、操作状态的方法均通过props传递

### 2.1 创建容器组件

```jsx
import {
  createDecrementAction,
  createIncrementAction,
  createIncrementAsyncAction,
} from "../../redux/count_action";
import { connect } from "react-redux";

import React from "react";
function Count(props) {
  function increment() {
    props.increment();
  }

  function decrement() {
    props.decrement();
  }

  function asyncIncrement() {
    props.incrementAsync(1, 1000);
  }

  return (
    <div>
      <div> 当前求和:{props.count}</div>

      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={asyncIncrement}>异步+</button>
    </div>
  );
}

// 映射状态
const mapStateToProps = (state) => {
  console.log(state, "state");
  return { count: state.value };
};

// 映射操作状态方法

const mapDispatchToProps = (dispatch) => {
  return {
    increment: () => dispatch(createIncrementAction()),
    decrement: () => dispatch(createDecrementAction()),
    incrementAsync: (data, time) =>
      dispatch(createIncrementAsyncAction(data, time)),
  };
};

const CountContainer = connect(mapStateToProps, mapDispatchToProps)(Count);
export default CountContainer;
```

### 2.2 数据共享

```jsx
import { createStore,applyMiddleware,combineReducers } from "redux";

import thunk from'redux-thunk'
import countReducer from './reducers/count'
import personReducer from './reducers/person'

const allReducer = combineReducers({
    count:countReducer,
    person:personReducer
})

export default createStore(allReducer,applyMiddleware(thunk))
```

### 2.3 redux开发者工具

```jsx
安装 redux-devtools-extension

import { composeWithDevTools} from 'redux-devtools-extension'

export default createStore(allReducer,composeWithDevTools())
export default createStore(allReducer,composeWithDevTools(applyMiddleware(thunk)))
```

# 九、Hook

1. Hook是React 16.8.0版本新特性
2. 可以让你在函数式组件中使用state以及其他react特性

## 1. stateHook  [ useState()]

```jsx
import React, { useState } from "react";
export default function Demo() {
  console.log("demo调用"); // 调用1 + n 次
  let [count, setCount] = useState(0);
  function add() {
    console.log("+");
    setCount(++count);
		// 或者
    setCount((value)=>{
        return ++value
    })
  }
  return (
    <div>
      <h2>{count}</h2>
      <button onClick={add}>Count+1</button>
    </div>
  );
}
```

## 2. useEffect()

可将useEffect看作componentDidMount,componentDidUpdate,componentWillUnmount这三个函数组合

命名可知，与Effect 副作用有关，副作用是在计算结果的过程中，系统状态的一种变化，或者与外部世界进行的可观察的交互。

产生副作用的情形：修改DOM、发送http请求、修改URL query、修改cookie、sessionStorage、localStorage和console.log等。可见，副作用无法避免，非常常见，useEffect可以让我们在函数中执行副作用操作。

useEffect参数：

1. 第一个参数是effect的回调
2. 第二个参数是deps依赖项，可选，类型是数组，会根据依赖项，决定是否调用effectCallback

useEffect调用时机：

1. 与渲染的先后关系：React会等待浏览器完成画面渲染之后才会延迟调用useEffect
2. 调用次数：在不传deps依赖向的情况下，useEffect会在每次渲染后都执行

useEffect清除机制：

- 在依赖项为空数组时，返回一个函数就，返回的这个函数内部相当class组件的`componentWillUnmount` ，
- 非空时，则在每次渲染后，非空数组上的state有更新时，就会执行EffectCallback，这里的更新是指对依赖项进行浅比较，对数组的每个state，进行上次渲染后的值，跟这次渲染后的值，进行浅比较，不相等时，就执行 *EffectCallback*

## 3. useRef(）

```jsx
let btn = React.useRef()
<button onClick={add} ref={btn}>Count+1</button>
```

## 4. 自定义Hook

[React 自定义 Hook 开发实践 - 掘金](https://juejin.cn/post/7033046040928321566)

# 十、其他

## 1. Fragment

避免使用不必要的标签

```jsx
<React.Fragment>
      <h1>This is heading</h1>
      <h2>This is a sub-heading</h2>
      <Child1>
        <Child2>
          <Child3>
            <Child4/>  
          </Child3>
        </Child2>
      </Child1>
    </React.Fragment>
```

## 2. Context

一种组件间通信方式，常用于【祖组件】与【后代组件】间通信

1. 创建Context容器对象
    
    ```jsx
    const XxxContext = React.createContext()
    ```
    
2. 渲染子组件时，外面包裹xxxContext.Provider,通过value属性给后代组件传递数据：
    
    ```jsx
    <xxxContext.Provider value={数据}>
    	子组件
    </xxxContext.Provider>
    ```
    
3. 后代组件读取数据
    
    ```jsx
    // 第一种方式：仅适用于类组件
    static contextType = xxxContext // 声明接收context
    
    使用  this.context
    
    // 第二种：函数组件和类组件都可以
    <xxxContext.Consumer>
    	{ 
    		value => ( // value就是context中的value数据
    			要显示的内容
    		)
    	}
    </xxxContext.Consumer>
    ```
    

**示例**

```jsx
import React, { Component } from "react";
import "./ContextDemo.css";

const UserNameContext = React.createContext();

export default class ContextDemo extends Component {
  state = { username: "tom" };
  render() {
    return (
      <div className="parent">
        <h1>我是A组件</h1>
        <h1>我的用户名：{this.state.username}</h1>
        <UserNameContext.Provider value={this.state.username}>
          <B></B>
        </UserNameContext.Provider>
      </div>
    );
  }
}

class B extends Component {
  render() {
    return (
      <div className="child">
        <h1>我是B组件</h1>
        <h1>我从A组接收到的用户名：???</h1>
        <C></C>
      </div>
    );
  }
}
class C extends Component {
  render() {
    return (
      <div className="grand">
        <h1>我是C组件</h1>
        <UserNameContext.Consumer>
          {(value) => <h1>我从B组接收到的用户名：{value}</h1>}
        </UserNameContext.Consumer>
      </div>
    );
  }
}
```

## 3. 组件优化

Component两个问题

- 只要执行setState，即使不改变状态数据，组件也会重新render
- 只当前组件重新render，就会自动重新render子组件，效率低

原因:Component中的shouldComponentUpdate()总是返回true

解决：

方法一：

1. 重写shouldComponentUpdate()方法
2. 比较新旧state或props数据，如果有变化才返回true，如果没有返回false

方法二：

1. 使用PureComponent
2. PureComponent重写了shouldComponentUpdate(),只有state或props数据有变化才返回true
3. 注意：
    1. 只是进行state和props数据的浅比较，如果只是数据对象内部数据变了，返回false
    2. 不要直接修改state的数据，而是要产生新数据

项目中一般使用PureComponent来优化

```jsx
export default class ContextDemo extends React.PureComponent {
```

## 4. renderProps

如何向组件内部动态传入带内容的结构

- 使用children props：通过组件标签体传入结构（如果B组件需要A组件内的数据，不能做到）
    
    ```jsx
    // A 组件
    <div>
    	{this.props.children}
    </div>
    
    // 使用
    
    <A>
    	<div>示例</div>
    </A>
    ```
    
- 使用render props ：通过组件标签传入结构，一般用render函数
    
    ```jsx
    <A render={(data)=><C data={data}></C>}></A>
    
    // A组件内部
    <div>
    	{this.props.render(需要传入的数据)}
    </div>
    ```
    

## 5. 错误边界

部分UI的js错误不应该导致整个应用崩溃，为了解决这个问题，react16引入——错误边界这个新概念

错误边界是一种 React 组件，这种组件**可以捕获并打印发生在其子组件树任何位置的 JavaScript 错误，并且，它会渲染出备用 UI**
，而不是渲染那些崩溃了的子组件树。错误边界在渲染期间、生命周期方法和整个组件树的构造函数中捕获错误。

注意：

错误边界无法捕获一下场景中产生的错误：

- 事件处理
- 异步代码
- 服务端渲染
- 它自身抛出的错误（并非它的子组件）

如果一个 class 组件中定义了 [`static getDerivedStateFromError()`](https://react.docschina.org/docs/react-component.html#static-getderivedstatefromerror)或 [`componentDidCatch()`](https://react.docschina.org/docs/react-component.html#componentdidcatch)这两个生命周期方法中的任意一个（或两个）时，那么它就变成一个错误边界。当抛出错误后，请使用 `static getDerivedStateFromError()`渲染备用 UI ，使用 `componentDidCatch()`打印错误信息。

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

然后你可以将它作为一个常规组件去使用：

```jsx
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

## 6. React Fiber 算法

这是React 背后的核心算法，是React 16中新的协调算法，React 15中的virtualDOM，这是旧的协调算法。

# 十一、 扩展链接

[2022 年的 React 生态 - 掘金](https://juejin.cn/post/7085542534943883301)

[React Fiber 简介 —— React 背后的算法 - 掘金](https://juejin.cn/post/7006612306809323533)

补充笔记

新旧生命周期对比

旧生命周期

挂载

- constructor
- componentWillMount
- render
- componentDidMount

更新

- ComponentWillReceiveProps
- shouldComponentUpdate
- componentWillUpdate
- render
- componentDidUpdate

卸载

componentWillUnmount

新生命周期 React从v16.3之后

挂载

- constructor
- getDerivedStateFromProps
- render
- copnentDidMount

更新

- getDerivedStateFromProps
- shouldComponentUpdate
- render
- getSnapshotBeforeUpdate
- compnentDidUpdate

卸载

componentWillUnmount

## **static getDerivedStateFromProps(nextProps, state)**

`getDerivedStateFromProps()` 在调用 `render`方法之前调用，在初始化和后续更新都会被调用

注意：`getDerivedStateFromProps` 是一个静态函数，不能使用this, 也就是只能作一些无副作用的操作

参数： 第一个参数为即将更新的 `props`, 第二个参数为上一个状态的 `state` , 可以比较`props` 和 `state`来加一些限制条件，防止无用的state更新

## render

注意： 不要在 `render` 里面 `setState`, 否则会触发死循环导致内存崩溃