# js-18 其他API
## 一、IntersectionObserver    实验性功能，IE11和ios不兼容
判断元素是否在可视区域

1. 用法

```js
let io = new IntersectionObserver(callback[,option])
// 开始观察
io.observe(document.querySelector('.example'))
// 停止观察
io.unobserve(element)
// 关闭观察
io.disconnect()

// 返回所有监听的目标元素集合
io.takeRecords()
```
（1）callback可见性变化时的回调函数，options是参数配置对象，可选

（2）如果需要观察多个节点，直接调用多次observe即可；

2. callback参数用法

目标元素的可见性变化时就会立即调用该函数

一般触发两次callback，一次是目标元素进入视口，一次是完全离开视口
```js
var io = new IntersectionObserver(entries => {
    console.log(entries)
})
```
（1）监听一个
```js
var io = new IntersectionObserver(entries => {
    let item = entries[0] // 是一个数组, 只有一个元素

    // 添加最后一个元素
    if(item.isIntersecting){
        console.log(滚动到底部了, 可以请求数据了)
    }
}).observe(document.querySelector('.reference')) // 参照元素
```

3. IntersectionObserverEntry对象属性

* boundingClientRect 目标元素的矩形信息
* intersectionRatio 相交区域和目标元素的比例值 intersectionRect/boundingClientRect 不可见时小于等于0
* intersectionRect 目标元素和视窗（根）相交的矩形信息 可以称为相交区域
* isIntersecting 目标元素当前是否可见 Boolean值 可见为true
* rootBounds 根元素的矩形信息，没有指定根元素就是当前视窗的矩形信息
* target 观察的目标元素
* time 返回一个记录从IntersectionObserver的时间到交叉被触发的时间的时间戳


intersectionRatio和isIntersecting用来判断元素是否在可视区域

4. options对象的配置

（1）root：null    观察根元素，默认浏览器视口，指定元素的时候用于观察元素必须是指定元素的子元素

（2）threshold:[0,0.5,1]    一个数组，触发callback的时机

（3）rootMargin: '30px 100px 20px'；   用来扩大或者缩小视察的大小，使用css的定义方法


5. 兼容性

官方polyfill： [https://github.com/w3c/IntersectionObserver/tree/master/polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill)

## 二、MutationObserver 监视DOM变动
1. 作用：

* 监视dom发生变动时，MutationObserver将收到通知并触发事先设定好的回调函数；
* MutationObserver是异步触发的，为了避免dom频繁变动导致回调函数被频繁调用，造成浏览器卡顿；



2. MutationObserver 构造函数
```js
var observer = new MutationObserver(callback);
callback接收两个参数，第一个参数包含了所有mutationRecord对象的数组，第二个是MutationObserver实例本身；

var observer = new MutationObserver(function(mutations, observer){
    mutations.forEach(function(mutation){
        console.log(mutation, 'mutation')
    })
})
```
3. MutationObserver 实例方法；

（1）observe()   用来启动监听，接受两个参数

* 第一个参数：所要观察的dom节点
* 第二个参数：一个配置对象，指定所要观察的特定变动

	* childList：子节点的变动（新增、删除或更改）
	* attributes：属性的变动；
	* characterData：节点内容或节点文本的变动；
	* subtree：是否监听该节点的所有后代节点
	* attributeOldValue：观察attributes变动时，是否需要记录变动前的值；
	* characterDataOldValue：观察characterData时，是否需要记录变动前的值；
	* attributeFilter：数组，表示需要观察特定的属性（如：['class', 'src']）


```js
var article = document.querySelector('article')
var options = {
    childList: true,
    attributes: true
}
observer.observe(article, options)
```
注意：childList、attributes、characterData三者必须选其一或多个，否则报错；

对节点添加了observe就像添加了addEventListener一样，当添加不同的options时，可以触发多次；

（2）disconnect()    用来停止观察，调用该方法后，dom再发生变动，也不会触发观察器；

（3）takeRecords()    用来清除变动记录，即不再处理未处理的变动，该方法返回变动记录的数组；

4. MutationRecord 对象

dom每次发生变化时，就会生成一条变动记录（MutationRecord实例），该实例包含了与变动相关的所有信息，mutation observer处理的就是一个个mutationrecord实例所组成的数组；

mutationRecord对象包含了dom的相关信息：

* `type`：观察的变动类型（attribute、characterData或者childList）。
* `target`：发生变动的DOM节点。
* `addedNodes`：新增的DOM节点。
* `removedNodes`：删除的DOM节点。
* `previousSibling`：前一个同级节点，如果没有则返回null。
* `nextSibling`：下一个同级节点，如果没有则返回null。
* `attributeName`：发生变动的属性。如果设置了attributeFilter，则只返回预先指定的属性。
* `oldValue`：变动前的值。这个属性只对attribute和characterData变动有效，如果发生childList变动，则返回null。

