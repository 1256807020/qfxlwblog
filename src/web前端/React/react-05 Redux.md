# React-05 Redux
## 一、安装redux
`yarn add redux react-redux`

使用Provider和connect时需要引入react-redux，

使用reducer变量时，需要使用redux库的方法


## 二、创建store
1. 添加store/index.js
```jsx
import {createStore} from 'redux'
const initialState = {
    count: 0
}

// state仓库的值, action是传递的状态
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'add' : return {
            ...state,
            count: action.count
        }
        default : return state
    }
}
const store = createStore(reducer)
export default store
```
2. 创建好之后的store，输出之后一共有四个参数，
```jsx
const store = createStore(reducer)
console.log(store)
{
    dispatch(){}  //通过传入一个对象,触发修改方法
    subscribe(){}  //通过传入一个函数,在dispatch之后都会触发
    getState(){}  //调用即获取store仓库
    replaceReducer(){}  //
}
```

3. 监听store的数据变化

store.subscribe可以监听store的数据变化，该方法返回一个函数，调用该函数又可以解除监听
```jsx
const unsubscribe = store.subscribe(() => {
    console.log('当前state值：', store.getState())
})
unsubscribe()
```

## 三、组件获得store中的数据
1. 第一种方法，直接调用store
```jsx
import React from 'react'
import store from './store'
function Son(){
    console.log(store.getState().count)
}
export default Son
```
2. 使用connect方法连接redux

使用connect是借助Provider实现的，需要修改index.js入口文件;

（1）修改src/index.js入口文件
```jsx
import { Provider } from 'react-redux'
import store from './store'

ReactDOM.render(
    <Provider store={store} >
        <App />
    </Provider>
    document.getElementById('root')
)
```
（2）connect使用方法,connect第一个小括号接收参数，第二个小括号接收组件
```jsx
// 方法
connect([mapStateToProps],[mapDispatchToProps],[mergeProps],[options])
// 常用方法
connect([mapStateToProps],[mapDispatchToProps])(presentationalComponent)
```
组件中使用connect连接到store

* 第一种方式


```jsx
import {connect} from 'react-redux'

// 使用mapDispatchToProps调用该方法并传入dispatch用来触发reducer改变state值
function handleChange(dispatch, value){}

function App(props){}

const mapStateToProps = state => ({count: state.count})
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleChange: value => handleChange(dispatch, value)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
```
* 第二种方式，直接引入action的方法


```jsx
import {connect} from 'react-redux'
import {handleChange} from './action.js'
function App(){}
const mapStateToProps = state => ({})
export default connect(
    mapStateToProps,
    {handleChange} // 是对象简写的方法
)(App)

// action.js
// 同步处理, 将handleChange放入connect中会自动触发dispatch
function handleChange(count){
    return {
        type: 'add',
        count
    }
}
```
* 当不传入mapDispatchToProps时，dispatch会被注入组件中
* 当mapDispatchToProps和mapStateToProps都不传递时，则不会监听store的任何变化
* 当redux的数据更新，都会触发mapStateToProps函数重新执行




注意：每次store有数据更新时，我们需要对相关得到的数据正确进行渲染，需要两次调用ReactDOM.render方法，可以写一个render函数，每次store发生改变即调用
```jsx
const render = () => {
    ReactDOM.render(
        <Provider store={store}>
            <App/>
        </Provider>
    ),
    document.getElementById('root')
}
store.subscribe(render)
render() // 第一次挂载执行
```
通过store.subscribe方法订阅store的变化，并且响应此变化，触发相关组件重新渲染；


## 四、store拆分处理
1. 创建store/index.js
```jsx
import { createStore } from 'redux'
import rootReducer from './reducer.js'
const store = createStore(rootReducer)
export default store
```
2. 创建store/type.js
```jsx
// 统一管理type名字
export const ADD = 'ADD'
```
3. 创建store/reducer.js
```jsx
import * as types from './type.js'
const initialState = {
    count: 0
}

// state仓库的值, action是传递的状态
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.ADD : return {
            ...state,
            count: action.count
        }
        default : return state
    }
}
export default reducer
```
注意事项
* store必须是唯一的，只能有一个store空间，
* 只有store能改变自己的内容，reducer不能改变
* reducer必须是纯函数；




4. 创建store/action.js
```jsx
import * as types from './type.js'
export const increment = (count) => {
    return {
        type: types.ADD,
        count
    }
}
```

## 五、拆分reducer
1. 使用redux提供的函数，combineReducers可以将每个reducer写成独立的一个文件,每一块独立负责管理state的一部分
```jsx
// reducers/index.js
import { combineReducers } from 'redux'  //引入拆分

// 引入两个拆分的js reducer文件
import login './login'
import bread from './bread'

const rootReducer = combineReducers({
    login,
    bread
})
export default rootReducer
```


## 六、redux异步处理方案
1. redux-thunk中间件

thunk可以看做store的dispatch()方法的封装器，使用thunk可以帮助我们在redux里面实现异步性，如果没有thunk默认是同步派遣的；

2. 安装redux-thunk

`npm i -S redux-thunk`

3. 注册redux-thunk中间件

applyMiddleware可以让我们为redux注册中间件
```jsx
// store.js

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducer.js';

const store = () => createStore(rootReducer, applyMiddleware(thunk));

export default store;
```
4. 使用异步处理dispatch
```jsx
// action.js

import * as types from './type.js'
// 同步处理
export const increment = count => ({
    type: types.ADD,
    count
})

// 异步处理
export const increment = count => (dispatch, getState) => {
    console.log('当前state值: ',getState())

    dispatch({type: types.ADD, count})
    // 或  可以直接调用函数
    dispatch(increment(count)

    return new Promise((resolve, reject)=> {
        resolve({code: 200})
    })
}
```

## 七、hook API
使用hook API必须在react-redux @7.1版本之后；

1. useSelector()
```jsx
import { shallowEqual, useSelector} from 'react-redux'

// later
const counter = useSelector(state => ({title: state.title, content: state.content}), shallowEqual)
// 第二个参数也可以不使用;
// shallowEqual是比较函数,也可以使用lodash.isEqual;
复杂的state提取：

import {useSelector} from 'react-redux'
import { createSelector } from 'reselect'

const selectNumOfDoneTodos = createSelector(
    state => state.todos,
    todos => todos.filter(todo => todo.isDone)
)

export const DoneTodosCounter = () => {
    const NumOfDoneTodos = useSelector(selectNumOfDoneTodos)
    return <div>{NumOfDoneTodos}</div>
}


import {useSelector} from 'react-redux'
import {createSelector} from 'reselect'
const selectNumOfTodoWithIsDoneValue = createSelector(
    state => state.todos,
    (_, isDone) => isDone,
    (todos, isDone) => todos.filter(todo => todo.isDone === isDone).length
)
export const TodoCounterForIsDoneValue = ({isDone}) => {
    const NumOfTodosWithIsDoneValue = useSelector(state => 
        selectNumOfTodoWithIsDoneValue(state, isDone)
    )
    return <div>{NumOfTodosWithIsDoneValue}</div>
}
export const App = () => {
    return (
        <>
            <span>Number of done todos: </span>
            <TodoCounterForIsDoneValue isDone={true} />
        </>
    )
}


import {useSelector} from 'react-redux'
import {createSelector} from 'reselect'
const makeNumOfTodosWithIsDoneSelector = () =>
    createSelector(
        state => state.todos,
        (_, isDone) => isDone,
        (todos, isDone) => todos.filter(todo => todo.isDone === isDone).length
    )

export const TodoCounterForIsDoneValue = ({isDone}) => {
    const selectNumOfTodosWithIsDone = useMemo(makeNumOfTodosWithIsDoneSelector, [])
    const numOfTodosWithIsDoneValue = useSelector(state => selectNumOfTodosWithIsDone(state, isDone))
    return <div>{numOfTodosWithIsDoneValue}</div>
}
```
2. useDispatch
```jsx
import {useDispatch} from 'react-redux'

// later
const dispatch = useDispatch()
dispatch({type: ''})

// 性能优化
const handlerIncrement = useCallback(
    () => dispatch({type:''})
,[dispatch])
```
3. useStore()
```jsx
import { useStore } from 'react-redux'

// later
const store = useStore()
store.getState();
```


## 七、配置redux dev tools，谷歌工具

1. 修改store下的index.js文件，将以下代码传递给store
```jsx
window.__REDUX_DEVTOOLS_EXTENSION__ &&
window.__REDUX_DEVTOOLS_EXTENSION__())
```
意思是查看window有没有该方法，有则执行；
```jsx
import { createStore } from 'redux'
import reducer from './reducer'
const store = createStore(reducer,
window.__REDUX_DEVTOOLS_EXTENSION__ &&
window.__REDUX_DEVTOOLS_EXTENSION__())
export default store
```
2. 使用谷歌插件同时使用thunk
```jsx
npm i redux-thunk redux-devtools-extension

import {applyMiddleware, createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk' 
export default store = createStore(reducer,
    composeWithDevTools(
        applyMiddleware(thunk)
    )
)
```


## 八、解决redux刷新问题
1. 下载redux-persist持久化数据存储的工具

yarn add redux-persist

redux-persist，它结合redux，将store中的数据缓存到浏览器的sessionStorage或者localStorage中

2. 在store.js里面，
```jsx
import { createStore } from 'redux';
import reducer from '../reducer';//引入deducer文件
import {persistStore, persistReducer} from 'redux-persist';

//  存储机制，可换成其他机制，当前使用sessionStorage机制
import storageSession from 'redux-persist/lib/storage/session'
// import storage from 'redux-persist/lib/storage'; //localStorage机制

// 数据对象
const storageConfig = {
    key: 'root', // 必须有的
    storage:storageSession, // sessionStorage缓存机制,或者放入sotrage,localStorage机制
    blacklist: ['name','age'] // reducer 里不持久化的数据,除此外均为持久化数据
}

// 第一个形参传入配置好的数据对象,第二个为数据reducer数据;
const myPersistReducer = persistReducer(storageConfig, reducer)
const store = createStore(myPersistReducer)
export const persistor = persistStore(store)
export default store
```
3. 如果是单文件的reducer处理方式
```jsx
// reducers/index.js
import { combineReducers } from 'redux'  //引入拆分

// 引入两个拆分的js reducer文件
import login './login'
import bread from './bread'

// 如果有持久化的工具
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
const loginPersistConfig = {
    key: 'login',
    storage,
    blacklist: ['password'] //password不用持久化; 加了不持久化需要在store.js里面加入名字
}

const rootReducer = combineReducers({
    login: persistReducer(loginPersistConfig, login), // 有不持久化的需要在store.js里面加入名字
    bread
})
export default rootReducer
```

4. 在入口文件index.js里面将PersistGate标签作为父标签
```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Router from './router';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import configStore from './redux/store';
import {persistor} from './redux/store';

ReactDOM.render(
    <Provider store={configStore}>
        <PersistGate loading={null} persistor={persistor}>
            <Router/>
        </PersistGate>
    </Provider>,
    document.getElementById('root'));
```
5. 接下来打开浏览器调试工具，就可以查看到浏览器缓存的数据

![image](https://www.qfxlw.com/images/react-04_其他Api，动画-03.png)



## 九、面试相关题
### redux由以下组件组成：

Action：这是一个用来描述发生了什么事情的对象；

Reducer：这是一个确定状态将如何变化的地方

Store：整个程序的状态/对象树保存在Store中；

### 解释reducer的作用
reducers是纯函数，它规定应用程序的状态怎样因响应Action而改变，reducers通过接受先前的状态和action来工作，然后它返回一个新的状态，它根据操作的类型确定需要执行哪种更新，然后返回新的值，如果不需要完成任务，它会返回原来的状态；

### Store在redux中的意义是什么
Store是一个javascript对象，它可以保存程序的状态，并提供一些方法来访问状态、调度操作和注册侦听器，应用程序的整个状态/对象树保存在单一存储中，因此，redux非常简单且是可预测的，我们可以将中间件传递到store来处理数据，并记录改变存储状态的各种操作，所有操作都通过reducer返回一个新状态；

### Redux与Flux有何不同？
1. Flux的Store包含状态和更改逻辑，Redux中Store和更改逻辑是分开的；
2. flux中有多个store，redux只有一个store；
3. flux中所有store都互不影响且是平级的，redux带有分层reducer的单一store；
4. flux有单一调度器，redux没有调度器的概念；
5. flux中react组件订阅store，

