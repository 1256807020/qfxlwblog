# React-02 组件通讯
## 一、组件通讯
### 父传子
传值：在子组件标签上，定义一个变量，去赋值传值的内容
```jsx
<Home msg={this.state.msg} />
```
（1）函数创建接收方式：第一个形参接收；
```jsx
function Home(props){
    return ....
}
```
（2）类创建接收方式
```jsx
class Home extends React.Component{
    constructor(props){
        super(props)  //props是react定义的属性,不建议使用其他名,会有bug
    } // 这里如果不写props，也是可以使用this.props直接取值的，建议写上；
}
```
除了传参数以外，还可以传事件函数；
```jsx
// 父组件中
<Header myClick={this.changeA} />  //changeA是父组件中定义的事件

//子组件中
<button onClick={this.props.myClick}>  //执行这个函数;
```

#### props默认值，如果没有传入Props，则默认是null
```jsx
class Example extends React.Component {
 // ...
}
Example.defaultProps = {
    color: 'blue'
}

//or
class Example extends React.Component {
    static defaultProps = {
        cache: false
    }
}
```

#### props类型验证
使用：react将prop-types分离出来一个组件了，想使用时可以直接引入，不需要再安装
```jsx
import React from 'react'
import PropTypes from 'prop-types'
class MyComponent extends React.Component {
    static propTypes = {} // 可以直接在这定义, 也可以在外面定义
}
MyComponent.propTypes = {
    list: PropTypes.array,
    flag: PropTypes.bool,
    handle: PropTypes.func,
    count: PropTypes.number,
    obj: PropTypes.object,
    str: PropTypes.string,
    text: PropTypes.oneOfType([ // 可能是多个中的其中一个
        PropTypes.string,
        PropTypes.element // react还可以传入组件, 使用element验证
    ]),
    objs: PropTypes.any, // 任意类型
}
```
所有的类型都可以添加一个isRequired以添加一个警告，如：PropTypes.number.isRequired；

#### 隔代传值
父组件通过定义`childContextTypes`和`getChildContext`来定义要传入的方法或属性，

子组件通过定义`contextTypes`验证类型，之后通过context获取
```jsx
import PropTypes from 'prop-types'
// 父组件
class Parent extends React.Component {
    static childContextTypes = {
        color: PropTypes.string
    }
    getChildContext(){
        return {
            color: 'red'
        }
    }
    render(){
        return <Child1 />
    }
}
// child1
const Child1 = () => {
    return <div>Child1 <Child2 /> </div>
}

// child2
// 函数组件接收
const Child2 = (props, context) => {
    console.log(context.color)
    return <div></div>
}
Child2.contextTypes = {
    color: PropTypes.string // 必须验证类型, 否则没有数据
}

// 类组件接收
class Child2 extends React.Component {
    constructor(props, context){
        super(props, context) // 第二个为context, 也可以直接...args;
    }
}
```

### 子传父
（1）点击事件传值
```jsx
// 子组件
<button onClick={()=>this.props.send('传值')}>

// 父组件
getSend = (n)=>{
    console.log(n)
}
<child send={this.getSend}>

//子组件
<button onClick={()=>this.props.send('传值')} >
```
（2）将子组件中的事件传递给父组件

利用父传递子组件事件的原理，直接使用父组件访问子组件的事件以及state状态；

①给子组件绑定一个自定义函数，并填写需要接收子组件传过来的参数；

②在子组件中的生命周期里触发该函数，将需要给父组件的事件传递过去；

③在父组件中声明一个变量并保存该函数，之后直接该定义的该变量即可；

```jsx
// 父组件中
const ref = React.useRef()
const handle = val => {
    ref.current = val
}
return (
    <child handle={handle} >
)

// 子组件中
React.useEffect(()=>{
    props.handle()  // 括号里面填写需要传入的事件以及参数;
},[])
```
#### 传入组件
传入组件的好处比传入名字的好处，可以直接将父组件里面的state传过去；
```jsx
<Son branch={<Branch count={this.state.count} />} /> // 传入组件
<Son branchComponent={Branch />} /> // 传入组件名字

// 渲染时
return (
    <div>
        {props.branch}
    </div>
)
```
在组件标签中间要显示的内容

```jsx
<child>中间的内容</child>
```
在组件中，使用{this.props.children}代替位置；


## 输入框的默认值

在原来的html中是value，在react中是defaultValue


### react中的事件

1. 在react中，定义方法建议使用箭头函数形式，防止this改变
```jsx
change = ()=>{ console.log(111) }
```
2. 在react中，点击事件需要使用onClick驼峰命名法，赋值一个变量；

（1）第一种方法：直接调用方法名，比如

this可能指向undefined
```jsx
<button onClick={this.change}>
```
（2）第二种传参方式：使用bind传参；
```jsx
<button onClick={this.change.bind(this,'参数')} //在事件中使用形参接收;
```
影响性能，建议在constructor中定义 this.change=this.change.bind(this)

（3）第三种传参方式，封装一个函数，使用函数调用事件；
```jsx
<button onClick={()=>this.change('传参')}
```
第三种方式因为里面包了一个函数，导致里面的this指向可能有问题，因此在定义方法里面需要修改为箭头函数形式，如果不需要传参，则不需要修改箭头函数形式；

第三种方法render每次都会创建一个函数，性能差一点

3. 在react中修改数据时，++不能在后，需要在前，在后可以+1；





## 生命周期

使用生命周期必须放在类里面，函数没有生命周期；

生命周期从出生到死亡的一个过程，从创建到销毁，在React中，从挂载开始；

### 初始化渲染阶段

* `constructor`  初始化
* `componentWillMount(){}`  将要挂载，不推荐在这个生命周期获取数据的操作；
* `render(){}`  渲染；
* `componentDidMount(){}`  已经挂载，在这个阶段调取ajax；

### 更新阶段

* `componentWillReceiveProps(nextProps){}`   在接收新的props之前被调用；通过调用this.props和nextProps来替换；（只有在props更新才会被调用，初始不会调用）

* `shouldcomponentUpdate(props,state){}` 是否要更新；

* `componentWillUpdate(){}` 将要更新

* `componentDidUpdate(){}`   已经更新 

* `static getDerivedStateFromProps(nextProps,prevState){}`  返回结果会被送给setState；

* `shouldComponentUpdate(){}`：该函数有两个形参，更新的props对象和更新的state对象，在该函数里面填写大量逻辑，决定是否渲染页面；达到自己想要的结果；

  react页面一进入触发的生命周期函数：初始化-->将要挂载-->渲染-->挂载

  当数据发生改变时，触发的生命周期函数，分为两种状态，是否有`shouldComponentUpdate`这个函数：

  （1）不存在：数据正常更新，触发三个函数：将要更新-->渲染-->更新

  （2）存在：数据被拦截，必须返回布尔值，否则报错此时也分为两种情况：

  * return true：更新数据；生命周期顺序：是否要更新-->将要更新-->渲染-->更新
  * return false：拦截更新，不渲染页面，此时数据仍是最新的状态；

### 错误阶段

* `componentDidCatch(err,info){}`   捕获错误

* `static getDerivedStateFromError(err){}`   直接返回一个对象, 用来修改state值；


区别：

在render phase 里产生异常的时候，会调用getDerivedStateFromError；

在commit phase 里产生的异常会调用componentDidCatch；

`componentDidCatch`是不会在服务器渲染的时候被调用的，getDerivedStateFromError而会

### 卸载阶段

`componentWillUnmount()`  从dom卸载组件后调用，用于清理内存空间；



## react中修改state值

1. 在react中，想要改变state的值，必须调用`this.setState`这个方法，否则普通方式不生效，方法是一个对象，对象里面填写和state相同的属性名，值是修改之后的值；
2. 如果是数组，可以声明一个变量，并用state中的数组赋值，再修改回去；
```jsx
change(){
    let arr = this.state.list
    this.setState({ list: arr })
}
```
3. 

（1）setState接收两个参数，第一个是修改state的updater函数，第二个是回调函数，setState是异步的，如果需要同步    可以将事件写在第二个回调函数里

（2）当然也可以直接输入一个对象用来修改state的值，不过这种方式是异步的，如果后续更改的state状态取决于当前状态，建议使用函数式的修改方式，因为函数式是同步的
```jsx
this.setState(state=>{
    return {count: state.count + 1}
})
```




## 模拟双向数据绑定

在react中，是单向数据流，可以使用模拟双向数据绑定
```jsx
<input type='text' defaultValue={this.state.msg} onChange={this.changmsg}>
add = e => {
    this.setState({ msg: e.target.value }
}
```
在原生中的onChange事件是失焦时触发，在react中，onChange相当于keyup，建议使用onChange来监听按键的变动；


## 表单元素
表单元素分为两种

1. **受控组件**

受控组件是由状态State控制的；

受控组件当中的value值是直接绑定到state中的；
```jsx
onSubmit=e=>{
    e.preventDefault(); // 阻止表单提交事件刷新
}
<form onSubmit={onSubmit}>
    <input 
        type='text' 
        value={this.state.value} 
        onChange={e => this.setState(e.target.value)} 
    />
    <input type='submit'>提交</input> // 触发submit事件
</form>
```

2. **非受控组件**

当input过多时，受控组件就很麻烦了，就可以使用非受控组件；

非受控组件是通过ref来控制的；

非受控组件是通过dom元素访问的，非受控组件是不能通过state状态操作的；
```jsx
class Forms extends React.Component {
    constructor(){
        super()
        this.username = React.createRef()
        this.password = React.createRef()
    }
    clickHandler () {
        console.log(this.username.current.value)
    }
    render () {
        return {
            <>
                <input type='text' ref={this.username} />
                <input type='password' ref={this.password} />
                <button onClick={this.clickHandler}>提交</button>
            </>
        }
    }
}
```



## event

如果需要异步访问event，需要在函数顶部添加`e.persist()`

直接访问则不需要添加该函数，直接访问属于直接取`e.target`

```jsx
<div onClick={e => {
        e.persist()
        console.log(e.target)
    }}></div>
```





## 调用接口

1. axios（在app入口文件填写），需要绑定在axios上
```jsx
import axios from 'axios'
Component.prototype.$http = axios
```
2. jquery
```jsx
import jquery from 'jquery'
Component.prototype.$jq = jquery
```
3. jsonp代理跨域

在package.json文件，在最后面，添加以下代码，之后重启
```jsx
"proxy":"http:baidu.com"
```
在请求ajax时，直接填写/号后面的path路径即可；



## DOM元素

绑定元素style样式使用变量

在react中使用动态style样式时，必须使用驼峰命名法，

react会自动添加’px‘后缀，其他后缀需要添加字符串组成；
```jsx
let btnwidth = 70
<div style={{marginRigth: btnwidth}} />   // 需要包一个对象
<div style={{display: (index===this.state.currentIndex) ? "block" : "none"}}>此标签是否隐藏</div>
```
动态class
```jsx
<div className={`icon-font ${this.state.flag ? 'iconfont' : ''}`}
```
当input框为checkbox或radio时，使用defaultChecked来设置首次挂载是否被选中；

className 指定css的class；

`dangerouslySetInnerHTML`

为了防止跨站脚本（XSS）的攻击，替换innerHTML，使用变量，可以解析html标签内容
```jsx
<div dangerouslySetInnerHTML={{__html:this.state.detailList.free_content}}></div>
```
dom中使用htmlFor来代替for保留字；

使用onChange来处理用户实时输入

在react中的标签部分不能直接使用if语句，但是可以使用三目运算符
```jsx
{this.state.addarflag ? <Skeleton active /> : ''}  // 三目判断放标签
style={{display: this.state.flag ? 'block' : 'none'}}  // 三目显示隐藏标签
```


## react处理css
1. 安装插件：npm i emotion
2. 使用
```jsx
import {css} from 'emotion'
const styles = {
    root: css`
        font-size: 30px;
        &:hover {}
        button {}  // 后代
    `
}
function App(){
    return <h1 className={styles.root} />
}
```

渲染之后是抽离的css类名；

3. 使用emotion的css填写样式的好处：可以有自动补齐
4. 用法

（1）使用变量使用${}包裹
```jsx
const color = 'red'
const styles = {
    root: css`
        color: ${color}
    `
}
```

## ref
1. 组件内使用ref获取dom元素

字符串形式的ref API（this.refs.元素形式）有些许缺点，不建议使用，建议使用回调方式获取ref；
```jsx
function App(){
    const myRef = React.createRef()
    React.useEffect(()=>{
        console.log(myRef.current)
    },[])
    return <div ref={myRef}></div>
}
```
2. ref也可以直接是函数
```jsx
function App(){
    const [height, setHeight] = useState(0)
    const measureRef = useCallback(node => {
        if (node !== null) {
            setHeight(node.getBoundingClientRect().height)
        }
    }, [])
    return (<div ref={measureRef}></div>)
}
```

3. ref作为子组件的属性，获取的是该子组件，函数组件使用forwardRef，函数组件不能直接使用ref是因为函数组件没有实例
```jsx
// 函数  使用forwardRef
const Child = React.forwardRef((props,ref)=><div ref={ref}>子组件</div>)

// 类
class Child extends React.Comopnent{
    render(){
        return <div>子组件</div>
    }
}
function App(){
    const myRef = React.createRef()
    React.useEffect(()=>{
        console.log(myRef.current)
    },[])
    return <Child ref={myRef} />
}
```
4. 高阶组件使用ref
```jsx
// 使用logProps包裹
function logProps(Component){
    class LogProps extends React.Component {
        render(){
            const {forwardedRef, ...rest} = this.props
            return <Component ref={forwardedRef} {...rest} />
        }
    }
    return React.forwardRef((props, ref)=>{
        return <LogProps forwardedRef={ref} {...props} />
    })
}
class Child extend Component {
    render () {
        return <div>{this.props.txt}</div>
    }
}
class Parent extends Component {
    state = {
        myRef: React.createRef()
    }
    componentDidMount(){
        console.log(this.state.myRef)
    }
    render(){
        return <LogChild ref={this.state.myRef} txt='1111111'/>
    }
}
```
5. 使用redux包裹的connect组件获取ref

子组件添加`withRef:true`；
```jsx
connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(Son)
父组件调用：

this.refs.child.getWrappedInstance() // 可以获取到子组件;
```