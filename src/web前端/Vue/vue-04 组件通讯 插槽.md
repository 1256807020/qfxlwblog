# Vue-04 组件通讯、插槽

## 一、组件通讯

### 父传子

```html
父：<child :msg='message'></child>
子：child:{props:['msg']}  //使用props接收
```

* 监听子组件的生命周期

```html
<child @hook:mounted='' />
```



### 子传父

* 直接传递

```html
子：<button @click='send'>
         send内容：this.$emit('custom','hello')
父：<child @custom='receive' :msg='message'>
        receive(result){console.log(result)}
如果是在组件当中，需要使用EventBus传值；
```

* sync修饰符传递

```html
子：<button @click='send'>
      send内容： this.$emit('update:msg',newValue)

父：<child :msg.sync='message'></child>  //不用写事件接收参数
    扩展为：<child :msg='message' @updata:msg='val=>message=val'>

<!-- 如果需要绑定对象，直接使用v-bind -->
<child v-bind.sync='obj' />
    注意：这样会把obj对象里面的每一个属性(如title)都作为一个独立的prop传进入,在子组件的props填写时不能直接填写obj,需要填写obj里面的属性名(如title)
```

### 兄弟组件数据传递

> 创建一个新的vue实例，专门用于数据传递

1. 创建新的实例：var vm=new Vue()

```js
// 组件A
created(){
    vm.$on('事件名',msg=>{console.log(msg)})
}

// 组件B
vm.$emit('事件名',要发送的数据)
```



### 八种组件通信方式

**1. props / $emit**

* 父组件向子组件传值

```html
// 父组件
<com-article :articles="articleList"></com-article>
// 子组件
props: ['articles']
```

称为单向数据流，prop不可被修改，只读属性

* 子组件向父组件传值

```html
// 父组件
<com-article :articles="articleList" @onEmitIndex="onEmitIndex"></com-article>
// 子组件
this.$emit('onEmitIndex', index) //父组件需要一个形参来接收这个数据
```

**2. $children / $parent 访问实例**

* 访问子组件

```js
this.$children[0].messageA = 'this is new value'
// 使用$children可以直接访问方法，不需要$methods；
```

* 访问父组件实例

```js
this.$parent.msg;
```

$children的值是**数组**，$parent的值是**对象**

**使用场景： **填写自定义组件时，子组件可以通过访问$parent调用父组件里面的方法刷新列表，就不需要传入方法给子组件了；



**3. provide / inject **

> 嵌套的组件传值（A是B的父组件，B是C的父组件）（隔代传值，需要有关系）

父组件使用provide提供变量，子组件使用inject注入变量

```js
// A组件定义
export default { name: "A", provide: { for: "demo" },   //注册变量在data之外；

// B组件
name: "B",

// C组件
name: "C",
inject: ['for'],
data() {
    return {demo: this.for }
},
```

**4. ref / refs**

> ref如果在普通的DOM元素上使用，引用的指向就是DOM元素，如果用在子组件上，引用就指向组件实例，可以通过实例直接调用组件的方法或访问数据

```html
<component-a ref="comA"></component-a>
this.$refs.comA;

// 由于变量名不能是中划线,如果是中划线可以使用中括号的形式
<component-a ref='com-a'></component-a>
this.$refs['com-a']
```

**5. eventBus**

事件总线，在Vue中可以使用它来作为沟通桥梁的概念，如同事件中心，可以向该中心注册发送事件或接收事件，所有组件都可以通知其他组件；

注意：当项目较大，就容易造成难以维护的灾难

* 初始化事件总线， 在main.js中绑定到Vue实例化上

```js
Vue.prototype.$eventBus = new Vue()
```

* 发送事件

```js
// 组件A
this.$eventBus.$emit('addition', { num:this.num++ })
```

* 接收事件

```js
// 组件B
created(){
    this.$eventBus.$on('addition', param => { this.count = this.count + param.num; })
}
```

* 移除事件监听者

```js
// 使用eventBus要在组件销毁时卸载，否则会多次挂载，造成触发一次但多个响应的情况
beforeDestroy () {
    this.$eventBus.$off('addition', null)
}
```

**6. vuex 状态管理器**

**7. localStorage / sessionStorage**

**8. $attrs 、 $listeners**

在vue2.4以上，引入了$attrs和$listeners，新增了inheritAttrs选项

inheritAttrs：默认为true，设置为false可以进行隔代传值，

直接$attrs也行，不需要写任何东西；如果有写props指定了一个参数，则$attrs则少了一个属性值

```vue
// A父组件
<child-com1 :name="name" :age="18" :gender="女" :height="158" title="程序员成长指北" ></child-com1>

// A孩子child-com1组件
<child2 v-bind='$attrs'>  //
<script>
export default {
    inheritAttrs: false // 关闭自动挂载到组件根元素上没有在props声明的属性;
    props: {name: String} //name作为props属性绑定
    created(){
        console.log(this.$attrs);  //访问属性，如果被props指定了name，则该attrs就少了一个name;
    }
}    
</script>

// child-com1孩子child2组件
<p>age: {{ age}}</p> 
<p>childCom2: {{ $attrs }}</p>  //被指定了age，则少了age
export default {
    inheritAttrs: false,
    props: {age: String}
    created(){console.log(this.$attrs)}
}
```

**总结**

常见使用场景可以分为三类

* 父子组件通信: props; $parent / $children; provide / inject ; ref ; $attrs / $listeners
* 兄弟组件通信: eventBus ; vuex
* 跨级通信: eventBus；Vuex；provide / inject 、$attrs / $listeners





## 二、插槽

### 单一插槽

* 使用\<slot>标签放在组件内，在使用组件时，在内部插入的内容会显示在slot标签内
* slot的默认值：当没有给子组件传递内容的时候会显示，传递的内容也可以是标签

```html
// 父组件
<child>
    <h1>这里的内容会传递到子组件去</h1>
</child>

// 子组件
<header>
    <slot>这里是默认值</slot>
</header>
```



### 具名slot

* 给slot起name名：\<slot name='header'>\</slot>
* 标签带上slot名：\<div slot='header'>\</div>会插入到相应的位置
* 如果多个slot，填写内容时不带slot的name名，则会写入到slot没有写name名的那个标签

```html
// 父组件
<son>
    <template slot='header'>
        <h1>this is h1 label</h1>
    </template>
</son>
// 2.6.0之后，可以简写slot插槽名字，使用#；
<template #header></template>

// 子组件
<header>
    <slot name='header'></slot>
</header>
<selection>
    <slot></slot> // 默认放置位置，隐含default名字
</selection>
```



### slot通讯

* 子传父，子组件将数据绑定到slot上面，父组件使用template标签的slot-scope属性，可以自定义名字；
* 注意：只能是template标签作用：子组件放slot，绑定默认的年龄，之后父组件给真实的年龄

作用：子组件放slot，绑定默认的年龄，之后父组件给真实的年龄

```html
<son>
    <template slot-scope='scope'>
        {{$log(scope)}}
        <span>{{scope.age}}</span>
    </template>
</son>

// 子组件
<div>
    <slot :age='age'>
        {{age}}
    </slot>
</div>
data(){
    return {
        age: 18
    }
}
```



### v-slot

* 在2.6.0之后slot，slot-scope和slot被弃用了，使用v-slot代替全部，v-slot可以缩写#

```html
// 绑定对应的具名插槽
新语法：<template v-slot:header></template>
缩写：  <template #header></template>
旧语法：<template slot='header'></template>

// 绑定作用域
新语法：<template v-slot='defaultProp'></template>
缩写：  <template #default='defaultProp'></template>
旧语法：<template slot-scope='defaultProp'></template>
// v-slot='scope'其实是 v-slot:default的缩写, #缩写必须取具名插槽的名;

// 对应具名插槽的作用域
新语法：<template v-slot:header='headerProp'></template>
缩写：  <template #header='headerProp'></template>
旧语法：<template slot='header' slot-scope='headerProp'></template>
```

* slot插槽也可以是解构，v-slot绑定的作用域的值是一个对象，对象里面是子组件绑定到slot标签上的props对象，因此需要解构

```html
// 对象解构
<template v-slot='{user}'></template>

// 解构重命名
<template v-slot='{user:person}'></template>

// 解构默认值
<template v-slot='{user={firstName:'Guest'}}'></template>
```

### 多个slot处理

```html
<HeaderBar>
	<template #left></template>
    <template #center></template>
    <template #right></template>
</HeaderBar>
```





## 三、动态组件

> 在标签上添加一个is特性来决定显示哪个组件，比较实用，等同于tab切换栏

* \<div :is="'组件名'">\</div> 组件名记得加引号

* 组件名也可以是一个变量，变量的值就是这个组件的名称；可以通过几个按钮更新这个变量，实现tab切换

**keep-alive **（可以给router-view）

* 动态组件每点击下一个则会直接销毁上一个
* 使用\<keep-alive>标签将添加了is特性的标签包裹起来，点击之后则会缓存下来当前的组件，不会销毁之前的组件，不再重新加载；主要用于保留组件状态，避免重新加载
* 点击之后添加一个事件，并使用`this.$children`验证，显示多少个孩子
* 因为打印时，会先输出console.log，会出现验证延迟，所以可以添加一个方法，this.$nextTick()，括号里面写一个回调函数，等待页面渲染完成之后再打印console.log

```js
this.$nextTick(()=>{
    console.log(this.$children);
})
```

`nextTick` 可以让我们在下次 DOM 更新循环结束之后执行延迟回调，用于获得更新后的 DOM



## 四、v-once

1. 对于低开销（纯静态页面）元素可以添加v-once指令，来达到缓存效果，像友情链接之类的；

2. 对于有数据变化的元素，绝对不要加



## 五、过滤器

>  使用过滤器，直接修改原数据，并渲染页面

### 创建过滤器

在实例当中定义过滤器的名字，定义过滤器必须返回值

* 全局过滤器

第一个参数是过滤器名字，第二个是一个函数

```js
Vue.filter('reverse',value=>val.split(''))
```

* 局部过滤器  局部过滤器大于全局过滤器

```js
filters:{
    reverse(val){
        return val.split('');
    }
}
```

### 过滤器的使用

常用于插值和v-bind表达式中

```html
<div>{{msg | reverse}}</div>
<div :title='msg | reverse'></div>
```

msg是需要进行过滤的参数，msg是需要进行过滤的参数，如果还需要传参，可以在**过滤器加个小括号传参**

### 过滤器串联

下面的例子updateA进行过滤器msg再将结果传入updateB进行过渡，呈现最终结果

```html
<div>{{msg|updateA|updateB}}</div>
```

### 过滤器和computed的区别

* computed只能针对定义的属性，进行更新处理，需要一个就添加一个函数
* 过滤器可以定义一个，给需要过滤的属性添加，可以使用多次



### 金钱过滤器 加逗号

```js
Vue.filter('rmb-swich',val=>{
    val = Number(val).toFixed(2).toString();
    let str = val.toString().split('').reverse().join('');
    var regstr = str.replace(/\d{3}/g,val=>{
        var stm = '';
        stm += val+',';
        return stm;
    })
    if(regstr.slice(-1)==','){
        regstr = regstr.slice(0,-1)
    }
    var nums = regstr.split('').reverse().join('')
    return '￥'+nums
})
```

可以直接使用正则格式化金钱：

```js
'12345678'.replace(/\B(?=(?:\d{3})+(?!\d))/g, ',')
```





## 六、自定义指令

1. 使用v-自定义属性名进行绑定标签，如果需要传参可以在等于后面传入参数，使用binding获取传入的参数

```js
<input v-focus>

directives:{
    focus:{
        inserted(el,binding){el.focus()}
    }
}
```

2. 可用的钩子函数及其参数
   * bind：第一次绑定到元素时调用，只调用一次
   * unbind：DOM元素被vue移除时调用
   * inserted：当被绑定的元素插入到DOM中时调用
   * update：被绑定元素所在的模板更新时调用

3. 自定义指令可用的钩子函数有两个形参
   * el：代表指令所绑定的元素
   * binding：代表指令中详细内容，包括指令名称，参数，修饰符等
4. 自定义指令简写

```js
<div v-demo='{color:"white",text:"hello!"}' /> // 可以直接传入对象字面量
Vue.directive('demo', function(el, binding){
    el.style.backgroundColor = binding.value.color
})
```

