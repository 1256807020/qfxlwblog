# js理论面试题

## 从url输入到页面展现到底发生了什么

* DNS解析，将域名解析成ip地址
* TCP连接，TCP三次握手
* 发送HTTP请求
* 服务器处理请求并返回HTTP报文
* 浏览器解析渲染页面
* 断开连接，TCP四次挥手；



## TCP三次握手的过程

TCP握手协议

在TCP/IP协议中,TCP协议提供可靠的连接服务,采用三次握手建立一个连接.

第一次握手：建立连接时,客户端发送syn包(syn=j)到服务器,并进入SYN_SEND状态,等待服务器确认；

SYN：同步序列编号(Synchronize Sequence Numbers)

第二次握手：服务器收到syn包,必须确认客户的SYN（ack=j+1）,同时自己也发送一个SYN包（syn=k）,即SYN+ACK包,此时服务器进入SYN_RECV状态；

第三次握手：客户端收到服务器的SYN＋ACK包,向服务器发送确认包ACK(ack=k+1),此包发送完毕,客户端和服务器进入ESTABLISHED状态,完成三次握手.


三次握手的步骤：（抽象派）

客户端：hello，你是server么？

服务端：hello，我是server，你是client么

客户端：yes，我是client


四次挥手的步骤：（抽象派）

主动方：我已经关闭了向你那边的主动通道了，只能被动接收了

被动方：收到通道关闭的信息

被动方：那我也告诉你，我这边向你的主动通道也关闭了

主动方：最后收到数据，之后双方无法通信



## Proxy与Object.defineProperty的优劣对比?

Proxy的优势如下:

* Proxy可以直接监听对象而非属性
* Proxy可以直接监听数组的变化
* Proxy有多达13种拦截方法,不限于apply、ownKeys、deleteProperty、has等等是Object.defineProperty不具备的
* Proxy返回的是一个新对象,我们可以只操作新的对象达到目的,而Object.defineProperty只能遍历对象属性直接修改
* Proxy作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利

`Object.defineProperty`的优势如下:

* 兼容性好,支持IE9



## 前端常见攻击方式

* XSS攻击
* CSRF攻击
* Sql注入
* html脚本注入



## 前端常用跨域方案

* JSONP跨域（本质是js调用）
* CORS 后台配置
* Nginx 反向代理

跨域是浏览器做出的安全限制，必须同协议、同域名、同端口否则会被浏览器block



## 前端网站常规优化方案

优化策略：减少请求次数、减小资源大小、提高响应和加载速度、优化资源加载时机、优化加载方式

* 合并、压缩、混淆html/css/js文件（webpack实现，减小资源大小）
* Nginx开启Gzip，进一步压缩资源（减小资源大小）
* 图片资源使用CDN加速（提高加载速度）
* 符合条件的图标做base64处理（减小资源大小）
* 样式表放首部、js放尾部（js单线程，会阻塞页面，资源加载方式）
* 设置缓存（强缓存和协商缓存，提高加载速度）
* link或者src添加rel属性，设置prefetch或preload可预加载资源（加载时机）
* 如果使用了ui组件库，采用按需加载（减小资源大小）
* SPA项目，通过import或者require做路由按需加载（减小资源大小）
* 服务端渲染SSR，加快首屏渲染，利于SEO
* 页面使用骨架屏，提高首页加载速度
* 使用JPEG 2000, JPEG XR, and WebP的图片格式来代替现有的jpeg和png，该页面图片较多时，这点作用非常明显
* 使用图片懒加载-lazyload