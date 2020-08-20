# Mobx

## Mobx与Redux对比

* mobx的学习成本比redux更少，使用起来比redux更方便

* redux可维护性更强，阅读好，对于大项目建议使用redux

* mobx可以说是redux的代替品，当使用redux比较麻烦时可以选择使用mobx



## 介绍

* Mobx支持单向数据流，也就是动作改变状态，而状态的改变会更新所有受影响的视图;





## 安装

使用mobx管理状态存储库需要安装两个插件：

* `npm install mobx mobx-react -S`



## Mobx要点

### 定义mobx

* 定义数据使用`observable`函数
* 更改状态使用`action`函数包装，默认不需要，当开启严格模式时需要，建议始终加上

```jsx
import React from "react";
import { render } from "react-dom";
import { observable, action } from "mobx";
import App from "./App";

// 定义数据
var appState = observable({
  timer: 0
});
// 定义更改状态函数
appState.resetTimer = action(function reset() {
  appState.timer = 0;
});

setInterval(
  action(function tick() {
    appState.timer += 1;
  }),
  1000
);

render(<App appState={appState} />, window.root);
```



### 类组件使用

App.js

```jsx
import {observer} from 'mobx-react'
@observer
class App extends React.Component {
    render(){
        return (
        	<button onClick={() => {
                    this.props.resetTimer()
                }}>
                seconds: {this.props.appState.timer}
            </button>
        )
    }
}
export default App
```



### 函数组件

```jsx
import {useObserver} from 'mobx-react'
export default props => {
    return useObserver(() => (
    	<button onClick={() => props.resetTimer()}>
            seconds: {props.appState.timer}
        </button>
    ))
}
```



## 开启严格模式

```js
import {useStrict} from 'mobx'
useStrict(true)
```





## 核心API

* `observable`
* `computed`
* `reactions`
* `actions`

### observable

* `observable.box(value, options?)`

该函数接收任何值并把值存储到箱子中，使用`get`和`set`来设置值和获取值

`.observe`方法注册回调，建议使用`mobx.autorun`这样的reaction来代替；

options可设置的值：

* `{deep: false}`：该盒子会把还不是observable的新值转换成observable，使用false来禁用；
* `{name: 'my array'}`：用来给数组一个友好的调试名称，用于`spy`或者Mobx开发者工具；

```js
import {observable} from "mobx";

const cityName = observable.box("Vienna");
console.log(cityName.get()); // 输出 'Vienna'

cityName.observe(function(change) {
    console.log(change.oldValue, "->", change.newValue);
});

cityName.set("Amsterdam");
// 输出 'Vienna -> Amsterdam'
```

* `@observable property = value` ：类中定义obervable属性
* `observable.object(value, decorators?, options?)`：使用传入的对象转换为observable
* `observable.array(value, options?)`：将数组转换成observable，不想数组中的值转换加`{deep: false}`
* `observable.map(value, options?)`



### 装饰器

常用的装饰器列表：

* `observable.deep`: 所有 observable 都使用的默认的装饰器。它可以把任何指定的、非原始数据类型的、非 observable 的值转换成 observable。
* `observable.ref`: 禁用自动的 observable 转换，只是创建一个 observable 引用。
* `observable.shallow`: 只能与集合组合使用。 将任何分配的集合转换为浅 observable (而不是深 observable)的集合。 换句话说, 集合中的值将不会自动变为 observable。
* `computed`: 创建一个衍生属性
* `action`: 创建一个动作,
* `action.bound`: 创建有范围的动作

可以使用 *@decorator* 语法来应用这些装饰器:

```js
import {observable, action} from 'mobx';

class TaskStore {
    @observable.shallow tasks = []
    @action addTask(task) { /* ... */ }
}
```

或者：

```js
import {observable, action} from 'mobx'
const taskStore = observable({
    tasks: [],
    addTask(task) {}
}, {
    tasks: observable.shallow,
    addTask: action
})
```

或者使用提供的`decorate`函数来添加：

```js
class TodoList {
    todos = {}
	get unfinishedTodoCount(){}
	addTodo(){}
}
decorate(TodoList, {
    todos: observable,
    unfinishedTodoCount: computed,
    addTodo: action.bound
})
```



### computed 计算值

用法：

* `computed(() => {})`
* `computed(() => {}, (newValue) => void)`
* `computed(() => {}, options)`
* `@computed({equals: compareFn}) get classProperty() { return expression; }`
* `@computed get classProperty() { return expression; }`

computed会被广泛使用到；

```js
import {computed} from 'mobx'
const number = observable.box(10)
const plus = computed(() => number.get() > 0)
autorun(() => {
    console.log(plus.get())
})
number.set(-19);
number.set(-1);
number.set(1);
```



### Actions 动作

用法：

* `action(fn)`
* `action(name, fn)`
* `@action classMethod`
* `@action(name) classMethod`
* `@action boundClassMethod = (args) => { body }`
* `@action.bound boundClassMethod(args) { body }`

对于一次性动作, 或异步操作，可以使用 `runInAction(name?, fn)` , 它是 `action(name, fn)()` 的语法糖.

```js
import {observable, action, useStrict, runInAction} from 'mobx';
useStrict(true);

class Store {
  @observable name = '';
  @action load = async () => {
    const data = await getData();
    runInAction(() => {
      this.name = data.name;
    });
  }
}
```



### Flow

用法：`flow(function *(args) {})` 接收generator函数作为唯一的输入；

由于处理异步动作，回调中执行的代码不会被action包装，意味着修改state值时无法通过`enforceAction`检查，

```js
import {configure} from 'mobx'
configure({enforceActions: true})
class Store {
        @observable githubProjects = [];
    @observable state = "pending"; // "pending" / "done" / "error"


    fetchProjects = flow(function* fetchProjects() { // <- 注意*号，这是生成器函数！
        this.githubProjects = [];
        this.state = "pending";
        try {
            const projects = yield fetchGithubProjectsSomehow(); // 用 yield 代替 await
            const filteredProjects = somePreprocessing(projects);

            // 异步代码自动会被 `action` 包装
            this.state = "done";
            this.githubProjects = filteredProjects;
        } catch (error) {
            this.state = "error";
        }
    })
}
```



### observer

用作包裹React组件的高阶组件，当observable发生变化时，组件会自动重新渲染，observer是由mobx-react提供的；

用法：

* `observer((props,context) => ReactElement)`
* `observer(class App extends Component)`
* `@observer class App extends Component {}`



### autorun

用法：`autorun(() => {sideEffect}, options)`

`autorun` 负责运行所提供的 `sideEffect` 并追踪在`sideEffect`运行期间访问过的 `observable` 的状态。



### when

用法：`when(() => condition, () => {sideEffect}, options)`

 `condition` 表达式会自动响应任何它所使用的 observable。 一旦表达式返回的是真值，副作用函数便会立即调用，但只会调用一次。



### reaction

用法：`reaction(() => data, data => {sideEffect}, options)`， 是`autorun`的变种

它接收两个函数，第一个是追踪并返回数据，该数据用作第二个函数，也就是副作用的输入。 



## react hooks使用Mobx

```jsx
import React from "react";
import { useLocalStore, useObserver } from "mobx-react";

const StoreContext = React.createContext()

const StoreProvider = ({ children }) => {
  const store = useLocalStore(() => ({
    bugs: ["centie"],
    addBug: bug => {
      store.bugs.push(bug);
    },
    // 计算属性
    get bugsCount() {
      return store.bugs.length;
    }
  }));

  return (
    <StoreContext.Provider value={store}>
      {children}
     </StoreContext.Provider>
  );
};

const BugsHeader = () => {
      // 通过store上下文获取
      const store = React.useContext(StoreContext);
      return useObserver(() => <h1>{store.bugsCount} Bug!</h1>);
}

ReactDOM.render(
    <StoreProvider>
    </StoreProvider>
	window.root
)
```

