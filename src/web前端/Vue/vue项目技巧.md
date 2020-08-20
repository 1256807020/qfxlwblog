# Vue项目技巧

## 逻辑复用方法

```js
MyPlugin.install = function (Vue, options) {
    // 第一种方法. 添加全局方法或属性
    Vue.myGlobalMethod = function () {
        // 逻辑...
    }

    // 第二种方法. 添加全局资源
    Vue.directive('my-directive', {
        bind (el, binding, vnode, oldVnode) {
            // 逻辑...
        }
        ...
    })

    // 第三种方法. 注入组件
    Vue.mixin({
        created: function () {
        // 逻辑...
        }
         ...
    })

    // 第五种方法. 添加实例方法
    Vue.prototype.$myMethod = function (methodOptions) {
        // 逻辑...
    }

    // 第六种方法，注册组件
    Vue.component(组件名, 组件)
}
```

举例使用场景： toast提示可以选择Vue.prototype，输入框自动获取焦点可以选择Vue.directive指令，自定义组件可以选择Vue.component的形式。



## 样式穿透

> 在使用UI框架时，由于一些选择器嵌套太深，无法被读取到，因此可以使用样式穿透

1. 一个组件可以同时使用scoped和非scoped两个style标签，将无法起效果的，需要穿透的放到style标签去写；

   ```js
   <style></style>
   <style scoped></style>
   ```

2. 使用>>>进行穿透

   ```css
   .father >>> .son{
       /* */
   }
   ```

3. 对于less、sass等处理器，不支持>>>解析，可以使用/deep/ 或 ::v-deep

   ```css
   .father{
      /deep/ .son{
          /* */
      }
   }
   ```



## 分页数据绑定计算

1. 数据截取计算

   当前页码-1乘以每页总数，第二个参数到当前页面*每页总数tableData.slice((currentPage-1)\*pageSize, currentPage\*pageSize)；

2. 分页索引计算

   当前页码-1乘以每页条数之后+1；

   :index='(currentPage-1)\*pageSize +1'



## 数据请求loading

1. 在main.js里面配置全局的loading

   ```js
   import {Loading} from 'element-ui'
   Vue.prototype.$loading = options => {
       let defaults = {
           lock: false, // 是否锁定屏幕滚动
           text: '加载中',
           spinner: 'el-icon-loading',
           background: 'rgba(0,0,0,.7)',
           target: document.body, 目标对象
           ...options
       }
       return Loading.service(defaults)
   }
   ```

2. 在请求数据时

   ```js
   async function reqData(){
       let loading = null
       this.$nextTick(() => {  // 服务方式必须使用异步处理
           loading = this.$loading({target: 'el-table'}) // 传入需要显示的位置
       })
       let res = await getData()
       loading.close()
   }
   ```



## 组件里面修改页面标题

可以在页面的生命周期设置：document.title = '当前页面'



## 全选按钮

1. 使用map方法

   ```js
   cAll () {
       this.chekAll = !this.chekAll  // 点击取反
       this.list.map(item=>item.flag = this.chekAll)  // 让所以选择框改变
   }
   ```

2. 使用every方法

   ```js
   this.checkedAll = this.list.every(items=>items.flag)  
   //当全部选中时，则改变checkdAll复选框的状态;
   ```



## 长列表优化

1. 安装插件：yarn add vue-virtual-scroller

2. 修改main.js文件

   ```js
   import Vue from 'vue'
   import VueVirtualScroller from 'vue-virtual-scroller'
   Vue.use(VueVirtualScroller)
   import 'vue-virtual-scroller/dist/vue-virtual-scroller.css
   ```



## 封装el-dialog方法

1. 创建组件模板，根据自行需要封装，主要是了解如何触发；

   ```vue
   <template>
     <div class=''>
       <el-dialog :visible.sync='visible' :show-close='false'>
         <template #title>
           <svg-icon name='ic_question' class='ic_question' />
           <span class='deleteDia__title--txt'>{{title}}</span>
         </template>
         <slot />
         <div slot="footer" class="">
           <el-button plain @click="visible=false">取 消</el-button>
           <el-button type="primary" @click="send">确 定</el-button>
         </div>
       </el-dialog>
     </div>
   </template>
   <script>
   export default {
     name: 'el-dialogs',
     props: {
       value: {
         type: Boolean,
         default: false
       },
       title: {
         type: String,
         default: '系统提示'
       }
     },
     computed: {
       visible: {
         get () {
           return this.value
         },
         set (val) {
           this.$emit('input', val)
         }
       }
     },
     methods: {
       send(){
           this.$emit('custom') // 触发父元素的自定义事件
       }
     }
   }
   </script>
   <style lang='scss'>
   
   </style>
   ```

2. 使用方法

   ```html
   <组件名 v-model='visible的变量' @custom='确定按钮的函数'/>
   ```



**其他方法：**

不使用v-model；

* 子组件：使用$parent访问父组件的方法调用事件
* 父组件：父组件使用ref访问子组件的方法显示子组件



## 添加Message消息提示节流

```js
import {Message} from 'element-ui'
Vue.prototype.$messageTip = new Proxy(message, {
  get(target, property, receiver) {
    let _this = this;
    return function(msg) {
      console.log("执行了");
      _this.apply(target, _this, [msg, property]);
    };
  },
  apply(target, thisBing, [msg, status]) {
    sessionStorage["flag"] = sessionStorage["flag"] || "true";
    if (sessionStorage["flag"] === "false") return;
    sessionStorage["flag"] = "false";
    message[status || "success"](msg);
    setTimeout(_ => {
      sessionStorage["flag"] = "true";
      delete sessionStorage["flag"];
    }, 1500);
  }
});
```

**使用方式：**

* 两个调用方式：
  * ①$messageTip.info(消息或对象)
  * ②$messageTip(消息或对象，类型)

**注意：** 在入口文件的生命周期删除delete sessionStorage['flag']，否则会有bug；