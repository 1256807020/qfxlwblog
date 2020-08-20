# node-05 开放静态
## 一、扩展node的路由
1. res.statusCode = 200，    设置状态码
2. res.statusMessage = 'ok'；  设置状态描述
3. res.setHeader('content-type','text/html')； 

    告诉浏览器接收的内容是什么类型的；

    还可以设置响应里面的内容；

    text/plain  纯文本；

上面三种都是res.writeHead的分开写法；



## 二、扩展express的路由

1. res.json()；输出json对象；
2. res.send(JSON.stringify())；输入json字符串；
3. res.set()；设置浏览器文件类型；
4. res.status()；设置状态码；可以直接链式调用send；



## 三、静态资源托管

1. app.use([path],express.static(path))；

第二个写要开放的目录，建议写绝对路径，可以自动查询index.html；

第一个可选，可以写一个路由，访问后面的目录需要带上这个路由；

2. app.use((req,res)=>{})；        等同于app.all('*')；


## 四、图书管项目技巧
1. 向后台传参，可以通过点击按钮，加一个函数，调用这个函数，函数里面调用ajax；
2. 可以使用fileter调用里面的数据，过滤掉其他的；
3. json文件写入需要通过json.stringify()之后写入；
4. 两个相同的路由（一个访问页面，一个调接口），可以再调接口那个传入一个参数，判断是否是传入参数的这个路由，实现两个页面；
5. 后端思想，需要先显示，后修改；
显示：

（1）在点击第一个页面时，将id通过查询字符串的方式传入到后台去（后台的接收地址需要写path路径来接收）；

（2）先将页面用.toString()读取出来，之后再用replace替换掉value值；或使用ejs模板；

（3）res.send输入到替换掉后的html内容；模板使用res.render()；
6. 对于input页面不需要让用户看见或者填写的参数，使用type='hidden'，写入到value里面，这样提交到后台也能看见；
7. 前端调用ajax的时候，可以返回一个对象，对象里面填写flag用于判断；
8. 判断session-id是否存在，可以让sessionid为undefined的时候等于空，就好判断了，就可以给sessionid置空了；

9. http是无状态的（点击跳转没有记忆能力）；
10. 出错时，可以查看页面返回的响应是什么，f12--Network--点击clear按钮(一个斜杠)；之后点击出错的地方，就可以直接在network查看返回的是什么了；



## 五、RESTful API：

  1)、传统设计路由的形式:
    形容词+名词


    get  /addbook
      
    get  /book
      
    get  /doaddbook
      
    get  /dodelbook
      
    get  /doupdatebook
    
    RESTful: 这个东西就是去描述 路由应该如何设计

  2)、RESTful这个标准 把一些路由当中的形容词给去了。用 method请求方法表示

  GET：读取（Read）

      get  /book/get

  POST：新建（Create）

      post /book/post

  PUT：更新（Update）

      put  /book/put

  PATCH：更新（Update），通常是部分更新

      patch /book

  DELETE：删除（Delete）

      delete /book
    
             /book?id=1
    
             /book/1  

## 六、中间件

>  每一个中间都有自己的一些含义

在express所有的回调函数，都可以称为中间件，中间件可以理解为工厂当中的车间。

- 内置中间件

- 第三方的

- 自定义中间件

    其实我们定义的路由都可是中间件

    app.get('/book')  app.post('/user')... 都是中间件



- 使用中间件特定的语法

    app.use( 中间件【函数】 )

    使用中间件和定义路由很相像，只要匹配成功并且send了，就不会再往下匹配。    




## 五、图书管理系统

1. 图书管理系统有哪些功能：

   1)关于图书的增、删、改、查

   2)关于用户的增、删、改、查


2. 关于图书管理系统的静态页面：

   这些静态页面由前端已经写完了


3. 使用express开发图书管理系统时的步骤

   1)、有图书管理系统静态页面

   2)、安装node、express环境

       注意：要使用npm init 生成package.json这个文件

   3)、规划项目目录结构：


    项目名称：books
      
                |---静态资源: static
      
                |-----------------css
      
                |-----------------js
      
                |-----------------images
      
                |---路由模块：routers
      
                |---模板文件(html)：views
      
                |---数据目录(.json文件)： data
      
                |---入口文件：app.js

  4)、设计路由：


