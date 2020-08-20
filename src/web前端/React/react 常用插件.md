# React常用插件
## react配置eslint地址

rules中的值0、1、2分别表示不开启检查、警告、错误。

[https://www.jianshu.com/p/f8d2ef372adf](https://www.jianshu.com/p/f8d2ef372adf)

常用的eslint配置：

```json
"quotes": [2, "single"], //单引号
"semi": 0, //不强制使用分号
"no-var": 0, //对var警告
"spaced-comment": 2, //注释风格要不要有空格什么的
"space-before-blocks": 2,  // if function等的大括号之前需要有空格
"space-infix-ops": 2,
"no-irregular-whitespace": 2, //不规则的空白不允许
"no-trailing-spaces": 2, //一行结束后面有空格就发出警告
"array-bracket-spacing": ["error","always"], // 数组前后需要有空格
"object-curly-spacing": ["error","always"], // 对象前后需要有空格
```

react配置

```js
{
    "rules": {
    "comma-dangle": 0,
    "no-console": 0,

    "react/default-props-match-prop-types": 2, // 有默认值的属性必须在propTypes中指定
    "react/no-array-index-key": 2, // 禁止index作为key值
    "react/no-children-prop": 2, // 禁止使用children作为prop
    "react/no-direct-mutation-state": 2, // 禁止直接this.state = 方式修改state 必须使用setState
    "react/no-multi-comp": 2, // 一个文件只能存在一个组件
    "react/no-set-state": 2, // 不必要的组件改写成无状态组件
    "react/no-string-refs": 2, // 禁止字符串的ref
    "react/no-unescaped-entities": 2, // 禁止'<', '>'等单标签
    "react/no-unknown-property": 2, // 禁止未知的DOM属性
    "react/no-unused-prop-types": 2, // 禁止未使用的prop参数
    "react/prefer-es6-class": 2, // 强制使用es6 extend方法创建组件
    "react/require-default-props": 2, // 非require的propTypes必须制定默认值
    "react/self-closing-comp": 2, // 没有children的组件和html必须使用自闭和标签
    "react/sort-comp": 2, // 对组件的方法排序
    "react/sort-prop-types": 2, // 对prop排序
    "react/style-prop-object": 2, // 组件参数如果是style，value必须是object

    "react/jsx-boolean-value": 2, // 属性值为true的时候，省略值只写属性名
    "react/jsx-closing-bracket-location": 2, // 强制闭合标签的位置
    "react/jsx-closing-tag-location": 2, // 强制开始标签闭合标签位置
    "react/jsx-equals-spacing": 2, // 属性赋值不允许有空格
    "react/jsx-first-prop-new-line": 2, // 只有一个属性情况下单行
    "react/jsx-key": 2, // 强制遍历出来的jsx加key
    "react/jsx-max-props-per-line": [2, { "maximum": 2 }], // 每行最多几个属性
    "react/jsx-no-comment-textnodes": 2, // 检查jsx注释
    "react/jsx-no-duplicate-props": 2, // 检查属性名重名
    "react/jsx-no-target-blank": 2, // 检查jsx是否被引入和使用
    "react/jsx-no-undef": 2, // 检查jsx引用规范
    "react/jsx-pascal-case": 2, // 检查jsx标签名规范
  }
}
```



其他的eslint项配置：https://www.cnblogs.com/nklong/p/7233631.html

### Parsing error: Unexpected token =

原因：开发环境与ESLint当前的解析功能不兼容

解决方案：使用`babel-eslint`解析（如没有可以使用npm安装）

```js
module.exports = {
    "parser": "babel-eslint",
    "rules": {}
}
```

### 禁止检查eslint

```js
// 单行注释
// eslint-disable-line

//多行注释
componentDidMount: {
    /* eslint-disable */
    ....
    /* eslint-disable */
}

// 文件注释
/* eslint-disable */
```



## 滚动插件

1. 安装：npm i react-scroll
2. 官网：[https://github.com/fisshy/react-scroll](https://github.com/fisshy/react-scroll)
2. 基础使用：
（1）滚动方法
```jsx
import Scroll from 'react-scroll'
var scroll = Scroll.animateScroll;

// 滚动到顶部
scroll.scrollToTop(options)

// 滚动到底部
scroll.scrollToBottom(options)

// 滚动到指定位置
scroll.scrollTo(100, options)

// 滚动更多像素
scroll.scrollMore(10, options)

// 滚动到元素
var Element = Scroll.Element;
var scroller = Scroll.scroller;
<Element name='myScrollToElement'></Element>
scroller.scrollTo('myScrollToElement', options)
```
（2）Link的使用
```jsx
import {Link} from 'react-scroll'
<Link
    activeclass=''
    to='' // 填写name名字, 在块标签上面写name会滚动到对应位置
    spy={true} // 使链接选择滚动到目标位置
    smooth={true} // 添加滚动动画
    duration={300} // 延时
    offset={-160} // 距离头部距离 element + -160的像素
/>
```



## 组件或图片懒加载

>  可以为图片或者组件提供懒加载功能，当滚动条滚动到该图片上方时才会去加载图片，可以更合理去加载资源，也可以设置高度来在未加载时预留出位置；

安装：`react-lazyload`

1. 基本使用

   ```jsx
   import React from 'react'
   import LazyLoad from 'react-lazyload'
   function App(){
       return (
           Array.from({length: 15}).map(() => {
               <LazyLoad height={200}>
                   <img /> // 也可以放组件
               </LazyLoad>
           })
       )
   }
   ```

   ![image-20200417110903782](https://www.qfxlw.com/images/react_常用插件-01.png)

   可以通过f12查看控制台是否懒加载成功

2. props

   * `height`：设置占位符的高度，也可以通过css设置；
   * `once`：只加载一次，之后再不检测滚动事件，对于图像或简单组件很有用
   * `offset`：组件位于视口下方的距离，如果

3. 工具函数

   * `forceChec`   手动重新触发检查视口中的元素， 当LazyLoad组件进入视口而没有调整大小或滚动事件时很有用，例如，当组件的容器被隐藏然后可见时。

     ```jsx
     import forceCheck from 'react-lazyload'
     forceCheck() // 在生命周期调用
     ```

   * `forceVisible` 强制组件显示，无论该元素在视口中是否可见

     ```jsx
     import { forceVisible } from 'react-lazyload';
     forceVisible();
     ```

教程地址：[https://github.com/twobin/react-lazyload](https://github.com/twobin/react-lazyload)



## React动画

1. 安装：`npm i react-transition-group`
2. 引入
```jsx
import {CSSTransition} from 'react-transition-group'
```
3. 属性
* `in` 开头
* `timeout` 动画的时间
* `appear`  一加载就执行
* `classNames`   起的变量名称
* `unmountOnExit`用完了以后DOM消失
* `onEnter`   进入时的钩子函数，就一个参数el
* `onEnter`, `onEntering`, `onEntered`, `onExit`, `onExiting`, `onExited` 钩子函数


```jsx
<CSSTransition
    in={flag}
    timeout={2000}
    appear={true}
    classNames='fade'
    unmountOnExit
    onEnter={el => el.style.color='red'}
>
    {/* 一定要空一个div出来不写任何东西,上面的fade会直接将类名放到这个div上面 */}
    <div>
        <div>hello</div>
    </div>
</CSSTransition>
```
4. 类名
* `fade.enter`    进入时的类名
* `fade.enter-active`   进入时执行的类名
* `fade.exit`    离开时的类名
* `fade.exit-active`   离开时执行的类名
* `fade.appear-active`   看情况opacity就不加，要是运动类的必须加上最后的位置；
* `enter-done` 动画完成时



5. `TransitionGroup`，如果多个动画特效，需要用该组件包裹
```jsx
<TransitionGroup key={index}>
    <CSSTransition>
    </CSSTransition>
</TransitionGroup>
```
可以使用react-motion代替： [https://www.jianshu.com/p/82552ce3803a](https://www.jianshu.com/p/82552ce3803a)





