# Vue-07 接口请求、跨域

## 一、axios

### 快速使用

* 安装：npm install axios qs

  qs是axios用来请求post的

  cdn地址形式

```js
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

* 修改main.js文件夹

```js
import axios from 'axios'
impost qs from 'qs'

Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
//挂载到原型上就可以使用了，可以自己随意取名
```

### 优点

* 从浏览器中创建 [XMLHttpRequests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
* 从 node.js 创建 [http](http://nodejs.org/api/http.html) 请求
* 支持 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
* 拦截请求和响应
* 转换请求数据和响应数据
* 取消请求
* 自动转换 JSON 数据
* 客户端支持防御 [XSRF](http://en.wikipedia.org/wiki/Cross-site_request_forgery)

### 请求方法

* get请求

```js
this.$axios.get('/user?id=12').then(res=>{}).catch(err=>{})
this.$axios.get('/user',{params:{id:123})....
```

* post请求

```js
let params = new URLSearchParams()
params.append('id', 666)
或：let params = this.$qs.stringify({id:666});
// 显示form Data才算成功；
this.$axios.post('/user',params).then....
```

* 多个并发请求

```js
get1(){return this.$axios.get('/user/123');
get2(){return this.$axios.get('/user/123/permissions');
this.$axios.all([this.get1(),this.get2()])
.then(this.$axios.spread((acct,perms)=>{}))
// spread为分页,如果不使用spread也可以直接使用res，是一个数组;
```



### axios拦截器

* 创建文件夹api/index

```js
import axios from 'axios'
import qs from 'qs'
import { Loading, Message } from 'element-ui'
let loading = null
axios.interceptors.request.use(
    config=>{
        // 在发起请求事要做的事情  可以给config添加请求头等
        loading = Loading.service({
            text: '正在加载......'
        })
        return config
    },
    error=>{
        return Promise.reject(error)
    }
)
axios.interceptors.response.use(
    response=>{
        // 对响应的事情要做的事情
        if(loading) loading.close()
        return response
    },
    error=>{
        if(loading) loading.close()
        if(!error.response){
            if(error.message.includes('timeout')){
                Message.error('请求超时，请检查网络是否连接正常')
            } else {
                Message.error('请求失败, 请检查网络是否已连接')
            }
            return
        }
        return Promise.reject(error)
    }
)
export const getData = (url,data={},method='get')=>{
    let config = {
        url,
        method:method.toLowerCase(),
        data
    }
    // get方式需要处理, 使用params传参
    if(method.toLowerCase() === 'get'){
        config.params = data
    }
    return axios(config)
}
```

* 在需要请求数据的地方引入getData即可

![image](https://www.qfxlw.com/images/vue-07_接口请求_跨域-01.png)



## 二、vue-resource

### 快速使用

* **安装：** yarn add vue-resource

* main.js导入

```js
import VueResource from 'vue-resource'
Vue.use(VueResource);
```

### vue-cli配置模拟假数据

地址：build文件夹--->webpack.dev.conf.js文件添加

* 引入插件

```js
const url = require('url')
const bodyParser = require('body-parser')
```

* 定义路由（在devServer下加入）

```js
before(app){
    app.use(bodyParser.urlencoded({extended:true})) //加载中间件
    app.get('/api/seller', (req, res) => {
       res.json({errno: 0,data: ['jack','rose','peter','jerry']})
    }),
    app.post('/api/addSeller', (req, res) => {
        res.json({
            errno:0,
            data:'success'
        })
    })
    app.get('/api/goods', (req, res) => {
        //处理JSONP请求
        let $url = url.parse(req.url,true)
        let ck = $url.query.callback
        let result = ck+'('+123+')'
        res.send(result)
    })
}
```

* JSONP请求，处理callback

```js
let $url = url.parse(req.url,true)  //true解析为对象模式;
let ck = $url.query.callback  //取出回调函数
let result = ck+'('+123+')'  //给前端传参
res.send(result)
```

* 让其他人访问自己的地址

在config--index.js文件下修改

```js
const ip = require('ip')
host: ip.address()   //将localhost改为ip.address();
```

### 接口调用方法

* get方式（后台接参：req.query）

```js
this.$http.get(url,[option]).then(successCallback,[errorCallback]);(后台无法接收前台发来的数据，发送请求需要用下面的)

//或使用大括号形式：
this.$http({url:'',params: {}}).then(res=>{res.body}).catch(fn)   //catch捕捉错误
 //params要发送的数据;

//也可以配合async函数调用：
let result = await this.$http(..)
//this.$http返回一个promise函数，可以调用then方法;
```

* post方式（后台接参：req.body）

```js
this.$http.post('',{},{emulateJSON:true,emulateHTTP:true}).then(res=>{})
  //第二个参数为要向后台发送的数据;
```

emulateJSON:true：设置表单：application/x-www-form-urlencoded；必须填写;emulateHTTP:true：处理restful：put/patch/delete等请求;

* JSONP方式（后台接参：req.query）

```js
this.$http.jsonp(url,[option])     //后台无法接参，需要用下面的;
this.$http({url:'',params:'',method:'jsonp',jsonp:'callback'})
```

* 其他快捷方法
  * get(url, [options])
  * head(url, [options])
  * delete(url, [options])
  * jsonp(url, [options])
  * post(url, [body], [options])
  * put(url, [body], [options])
  * patch(url, [body], [options])
* 查看是否发送成功

F12查看控制台---Network---headers；点击clear清除一下，再获取，之后headers翻到最下面，post方式中：form data就是发送成功，后台能够正常接收到数据，Request Payload没收到；



## 三、fetch

> fetch为原生方法，不需要下载任何插件
>
> fetch可以跨网络异步获取资源

### 请求方法

```js
fetch('https://www.qfxlw.com/banner').then(response=>response.json()).then(data=>{
    console.log(data) // 需要两次then回调才能获取数据;
})

// 常用方式
async function fetchData(){
    let response = await fetch('https://www.qfxlw.com/banner')
    let res = await response.json()
    console.log(res)
}

// post方法
fetch('http://localhost:3000/upload', {method: 'post', headers: 'Content-Type': '...', body: JSON.stringify({file: '...'})}).then(res => res.json()).then(data => ....)
```

### fetch与jQuery.ajax()的不同

* 当接收响应状态码是404或500，promise状态仍然是resolve，但是response的返回值ok属性是false；

* 由于fetch返回的只是一个http响应，而不是真的JSON，为了获取JSON的内容，需要使用json()方法

fetch是一个实验的API，在生产环境不建议使用



## 四、跨域

### CORS（跨域资源共享）

* 优点：简单、只需在后台写一句话、GET、POST都支持 

* 缺点：兼容性不如JSONP 

res.writeHead('Access-Control-Allow-Origin','*')

### JSONP(本质上是XHR，动态生成script标签)

* 兼容性好
* 只支持get方式

因为script标签没有跨域的限制，所以是伪Ajax；

### 利用proxy代理

* 修改config---index.js文件下的proxyTable的值
* 特点：跨域失败仅存在于(Ajax),NodeJS(A程序) ===》 PHP(B程序)后台之间是不存在跨域失败
* 场景：后台(Java)<=>前端(WebPack)[Proxy]
* 场景：公开API[JSONP]

```js
// webpack配置代理
proxyTable: {
    '/api': {    //api前台访问时需要加的前缀；
    target: 'http://v.juhe.cn',  //需要代理访问跨域的域名
    changeOrigin: true,    // 是否设置跨域
    pathRewrite: {"^/api" : ""} }  //地址重写;
},
    
// 前台请求
this.$axios.get('/api/movie/index')   //带上前缀，连接到访问的地址
// 最终请求的地址为：http://v.juhe.cn/movie/index
```







