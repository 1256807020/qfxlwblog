# js高阶技巧

## DocumentFragment

1. nodeType值为11；
2. documentFragment是一个文档片段，一种'轻量级节点'；
3. 通常作为仓库使用，不存在DOM树上，是一种游离态，主要是优化页面性能；
4. 用途：当使用js创建很多dom节点时，在加入节点到dom树上时，节点需要一个个渲染，这样节点数较多时会影响浏览器的渲染效率，这个时候我们将创建的节点都放在documentFragment这样的节点上，然后把documentFragment加入到DOM，只需要完成一次渲染就可以达到之前很多次渲染的效果；

```js
var ul = document.createElement('ul');
var flag = document.createDocumentFragment();
for(var i=1; i<101;i++){
     var li = document.createElement('li')
     var liText = document.createTextNode(i);
     li.appendChild(liText);
     flag.appendChild(li);
}
ul.appendChild(flag);
document.body.appendChild(ul);
```



## requestAnimationFrame（ie10+）
1. 类似定时器，与setTimeout相比，它的最大优势是由系统来决定回调函数的执行时机，不需要设置时间间隔，

2. 刷新频率：如果屏幕刷新率是60HZ，那么回调函数就每16.7ms被执行一次，如果是75hz，就是1000/75=13.3ms执行一次，它能保证回调函数在屏幕每一次的刷新间隔中只被执行一次， 这样不会引起丢帧现象， 也不会导致动画出现卡顿的问题；

3. requestAnimationFrame的基本思想是 让页面重绘的频率和刷新频率保持同步；

4. 优势

（1）cpu节能：如果使用setTimeout实现的动画，即使切换了窗口，后台仍在执行动画，而requestAnimationFrame则不会执行，当出现在视口内，则开始执行；

（2）函数节流： 在高频率事件(resize,scroll等)中，为了防止在一个刷新间隔内发生多次函数执行，使用requestAnimationFrame可保证每个刷新间隔内，函数只被执行一次，这样既能保证流畅性，也能更好的节省函数执行的开销。一个刷新间隔内函数执行多次时没有意义的，因为显示器每16.7ms刷新一次，多次绘制并不会在屏幕上体现出来。

5. 执行 requestAnimationFrame会返回一个定时器编号，传递给 cancelAnimationFrame用于取消这个函数；编号一般是1；
```js
let count = 0;
function requestAnimation(){
    if(count < 100){   // 作一下判断
        count++
        console.log(count)
        // 需要在函数里面调用该事件;
        requestAnimationFrame(requestAnimation);
    }
}
requestAnimationFrame(requestAnimation)  
 // 页面打开加载这个函数
cancelAnimationFrame(id)，取消requestAnimationFrame
```



## 简单实现Promise

```js
// 未添加异步处理等其他边界情况
// ①自动执行函数，②三个状态，③then
class Promise2{
  constructor(fn){
    this.state = 'pendding'   // 设置一个状态;
    this.value = undefined    // 这个用来接收参数;
    let resolve = value =>{
      this.state = 'resolve'   // 给state赋值,改变状态,用来then方法判断使用;
      this.value = value
    }
    let reject = value =>{
      this.state = 'reject'
      this.value = value
    }
    try{
      fn(resolve,reject)   //给传参的函数来两个形参,分别调用两个函数;
    }catch(e){
      reject(e)
    }
  }
  then(resolve,reject){
    if(this.state === 'resolve'){
      resolve(this.value)
    } else if(this.state === 'reject') {
      reject(this.value)
    }
  }
}
```



## 实现一个call

改变this指针的call和apply的本质就是，将调用的函数放到传入的对象身上，此时this自动就变成对象本身了，之后执行完成将结果返回，删除放到对象身上的函数；
```js
Function.prototype.myCall = function(context){
    context = Object(context) || window  //原生的this会自动用object()转换,不传参数或者null指向window;
    context.fn = this  //设定一个fn到传入的对象身上; this取的是函数;
    let args = [...arguments].slice(1)  //第一个是this对象,得隔离,这里是用来传参;
    let result = context.fn(...args)  //调用call时会执行; 这里将所有代码执行,并保存结果;
    delete context.fn  //执行完成就手动删除该函数;
    return result  //将执行结果返回;
}
```



## 实现一个apply

```js
// apply就是传参问题,是数组
Function.prototype.myApply = function(context,args){
    context = Object(context) || window
    context.fn = this
        //解决没有传参情况;
    let result = args ? context.fn(...args) : context.fn() 
    delete context.fn
    return result
}
```



## 实现一个bind

bind返回的绑定函数也能使用new操作符创建对象，这种行为就像把原函数当成构造器，bind与call/apply最大的不同就是前者返回一个绑定上下文的函数，而后两者是直接执行了函数

bind可以指定this，返回一个函数，可以传入参数，并且可以柯里化

定时器可以直接改变this指向：
```js
setTimeout(function(){}.bind(this),500)  //将this指向上文


Function.prototype.myBind = function(context){
     //判断不是函数的传入情况;
  if(typeof this !== 'function') throw new Error('error')
  var that = this  //保留this指向函数;
  var args = [...arguments].slice(1)  //获取传入的参数;
  return function F(){
      //因为返回的函数可以进行new,因此需要判断一下;判断this是否是指向F
    if(this instanceof F) return new that(...args,...arguments)
      // 返回调用的函数;
    return that.apply(context,args.concat(...arguments))
  }
}
```
