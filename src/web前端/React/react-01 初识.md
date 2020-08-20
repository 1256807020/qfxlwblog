# React-01 初识
react概念
[中文官网](https://react.docschina.org/)

[英文官网](https://reactjs.org/)


react是什么：是用于构建用户界面的javascript库


在react中提出了一个新的语法 叫做JSX （语法糖）

这个语法不能直接被浏览器所解析 必须借助于babel文件去解析 把js和html混合使用

当它遇见`<>`的时候 就自动解析为html标签 如果它遇见{}会解析成js语法

什么是虚拟DOM结构（diff算法）

相当于是一个对象 当视图有更新的时候 会生成一个新的对象，并与旧的进行比较 把有区别的地方进行更新 其他的不变 这样提高了高速渲染


Diff算法

当使用React的时候，在某个时间点 render() 函数创建了一棵React元素树，在下一个state或者props更新的时候，render() 函数将创建一棵新的React元素树，
React将对比这两棵树的不同之处，计算出如何高效的更新UI（只更新变化的地方）

介绍

1. 什么是react?

React 是Facebook内部的一个JavaScript类库（2013年的5月进行开源）。

React 可用于创建Web用户交互界面。

React不是一个完整的MVC框架,最多可以认为是MVC中的V（View）,甚至React并不非常认可MVC开发模式。

React 使用Facebook专门为其开发的一套语法糖--JSX。



语法糖又叫做糖衣语法。

语法糖是指计算机语言中添加的某种语法,这种语法对语言的功能并没有影响,但是更方便程序员使用。

它主要的目的是增加程序的可读性,从而减少程序代码错处的机会。


两大框架 一个库

vue  尤雨溪（中国人） MVVM 双向数据绑定

angular（2.0版本） （谷歌） 双向数据绑定 (不能叫angualr.js 因为angular.js是属于1.X版本 它是一个mvc的框架) MVVM

react （Facebook） 库 单向数据流 应用于移动端相对多一点


1.4优缺点（要背）

优点：

（1）组件化开发

（2）引入虚拟DOM,性能好,响应速度快

（3）JSX语法糖 

（4）单向数据绑定 Data Flow

（5）跨浏览器兼容

（6）完善的生态圈和活跃的社区

生态圈：很多开发者的意思；

缺点：

不是完整MVC框架,不适用于复杂的大型应用



使用

1. 官方提供的CDN地址
```html
<script src="https://unpkg.com/react@16/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
<!-- 生产环境中不建议使用 -->
<script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>
```
引入顺序：引入核心库>>dom库>>babel库

2. 如果是普通的js语法，我们可以省略script标签的类型定义(type='text/javascript')，但是在react中，我们应用的是jsx语法糖，这个语法糖无法直接解析，必须通过babel解析，所以我们的类型不能省略text/babel；
```html
<script type='babel'></script>
```


渲染dom结构

ReactDOM.render()；一共三个参数

第一个是插入到dom结构中的标签或者内容；

第二个参数要插入dom结构的位置；

第三个参数：回调函数，一般情况下省略不写；



在JSX语法注意事项

1. 只能有一个根元素；
2. 必须有闭合标签，如果是单标签，需要自闭合（带/号）；
3. 不能使用for，需要使用htmlFor；
4. 不能使用class，需要使用className；
5. 在input框中，默认值是使用defaultValue；



书写方式

1. 将所有内容扔到根标签中，扔到render()中；
2. 声明一个变量，里面放内容，将变量写到render中；
3. 在外面添加个小括号；里面放标签；



JSX语法

1. 遇见{}会解析成js，遇见<>会解析成html标签；
2. {}里面不能写复杂的语句，但是支持三元运算符；
3. 在jsx中使用字符串插值
```html
<img src={img} />
```
4. 在jsx中循环数组
```jsx
let arr = [
    {name:'ls',age:18},
    {name:'ls',age:18}
]
let ele = (<ul>
    {arr.map((item,index)=>{
        return <li key={index}>{item.name}</li>
    })}
</ul>)
```
在jsx中建议使用map方法循环数组，map返回一个新的数组渲染到页面，循环的元素必须有key值；



## key值

必须拿唯一值去代替，一般情况下，我们用数组返回来的id去赋值，如果实在没有，就用index索引，但是用索引有可能产生负面影响，组件有可能报错；
注意：千万不要使用Math.Random()去做key值，因为Math.Random会导致频繁更新key值，会无法缓存组件；



## 搭建脚手架

安装
yarn global add create-react-app

生成项目

yarn create react-app demo(项目名称)  //创建一个脚手架（带hook依赖检测）

create-react-app demo --typescript   //创建typescript+react



目录结构

node_modules  npm管理包

public  公共文件（服务相关的）

    favicon.ico  收藏夹图标
    
    index.html 主文件
    
    mainifest.json 服务配置文件

src     项目文件目录

    index.js 项目主入口文件
    
    index.css 主入口样式文件
    
    App.js 根组件
    
    App.css 根组件的样式
    
    App.test.js 测试文件
    
    serviceWorker.js 离线服务
    
    logo.svg 图片

.gitignore 上传时候要忽略的文件

package.json  npm配置文件

package-lock.json  锁定版本文件




## 创建src文件夹

1. 脚手架的基本结构

（1）创建一个入口文件index.js
```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(<App/>,document.getElementById('root'))
```
（2）创建App入口文件
```jsx
import React from 'react'
function App(){
    return (<div></div>)
}
export default App;
```

## 组件的创建方式

1. 函数的创建方式
```jsx
import React from 'react'
frunction App(){
    // 在return之前声明变量数据；
    return (<div></div>)
}
// 或者
const App = ()=>{
    return (<div></div>)
}
export default App
```
2. 使用类创建组件

```jsx
//需要按需引入component；
import React,{Component} from 'react'
class App extends component{
    constructor(){
        super()
        this.pageNo = 0
        this.state = {msg: '哈哈'}
    }
    render(){return (<div>{this.state.msg}</div>)}
}
export default App
```
使用类创建的组件，定义变量时，需要使用constructor定义，定义了constructor必须调用super()；

定义变量时必须使用this，this指的是当前组件；

使用this.state定义变量值；state是JSX定制的变量，当state里面的变量改变时，会自动重新render；

在使用变量时，必须使用this.state调用变量；

state也可以写在外面，直接state={}即可；调用时也需要加this，不建议这种做法；


3. 组件注意事项

（1）创建组件必须调用核心库，react；

（2）在组件里，每使用一个图片，都需要import一个变量，src={这个变量}；

（3）在应用组件时，标签名 首字母必须大写；



4. 类创建与函数创建的区别

（1）类有state状态机；

（2）类有生命周期函数；

（3）在传值时，接收参数需要加this；

