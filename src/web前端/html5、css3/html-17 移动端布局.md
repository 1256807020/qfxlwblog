# html-17 移动端布局
## 一、响应式布局
1. 响应式的图片

   需要给图片设置`max-width:100%;height:auto;`

2. 响应式的字体

   `html{font-size:100%;}`

   之后可以设置响应式的字体：

```css
@media (min-width:640px){body{font-size:1rem;}}
@media (min-width:960px){body{font-size:1.2rem;}}
@media (min-width:1200px){body{font-size:1.5rem;}}
```



### 响应式网站的优点

1. 减少工作量

   网站、设计、代码、内容都 只需要一份

   多出来的工作量只是JS脚本、CSS样式做一些改变

2. 节省时间

3. 每个设备都能得到正确的设计



### 响应式网站的缺点

1. 会加载更多的样式和脚本资源
2. 设计比较难精确定位和控制
3. 老版本浏览器兼容不好



## 二、媒体查询

通过媒体查询我们可以对不同的设备指定特定的样式

	1. 在link标签后面输入(css2)


```html
<link rel="stylesheet" href="2.css" type="text/css" media="screen and (min-width:1000px)">  //在link后面还引入
<link rel="stylesheet" href="2.css" type="text/css" media="screen and (orientation:landscape)">  //横屏显示
```
`orientation:portrait`   //竖屏

在css文件后面直接写(css3)


```css
@media screen and (min-width:600px) and (max-width:1000px){}   //需要修改的样式写在括号里面，可以针对单独的修改样式。
```



## 三、移动端布局

1. 页面html头部代码说明：
```html
<meta name="keywords" content=" "> 关键字
<meta name="description" content=""> 描述
<link rel="icon" href="images/icon.ico">插入logo标题
```
2. 设置viewport（至少记住三个）
```html
<meta name="viewport" content="" />
```
* width=device-width

* height：设置的viewport高度（一般不设置）

* initial-scale=1.0：页面初始缩放比例，可以为小数
* minimum-scale：最小缩放比例，可以为小数
* maximum-scale:最大缩放比例，可以为小数
* user-scalable：是否允许用户缩放页面，“no”不允许，“yes”允许



### 使用rem布局

100px=1rem；自适应；

```html
<script> 
    var deviceWidth = document.documentElement.clientWidth; // 获取浏览器的宽度 
    if(deviceWidth>720){ // 判断浏览器的宽度是否大于720 
        deviceWidth = 720; 
    } 
    var fs = (deviceWidth*100)/720; // 当浏览器大于等于720的时候，font-size 为100，720是页面设计图的宽度。
    document.documentElement.style.fontSize = fs + "px"; // 给html设置font-size 
</script>
```


### 自适应布局

```js
function Resize(){
    // 后面的40是font-size大小, 即1rem=40px
    let w = document.documentElement.clientWidth / 375 * 40
    document.documentElement.style.fontSize = w + 'px'
}
```



### 禁止手机端缩放

```html
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
```



### iphoneX兼容处理方案

1. 首页必须给`meta`标签添加`name`字段为`viewport`的, `content`值增加`viewport-fit=cover`;

   ```html
   <meta name='viewport' content='viewport-fit=cover'>
   ```

2. 单独给body增加iphonex的安全距离不起作用, 是由于`position: fixed`属性, `bottom: 0`造成吸底了, 需要给所有的`bottom: 0`增加对应的安全距离, 不再写`bottom: 0`, 而是写`bottom: env(safe-area-inset-bottom)`；

3. 两个函数介绍

    - `constant` ：针对iOS < 11.2以下系统

    - `env` ：针对于iOS >= 11.2的系统

    *因此两个函数都得增加上*

4. 支持的变量：

    - `safe-area-inset-left`：左边的安全距离

    - `safe-area-inset-right`：右边的安全距离

    - `safe-area-inset-top`：上边的安全距离

    - `safe-area-inset-bottom`：下边的安全距离

5. 两种情况处理方式

    - bottom不是0

     - 使用calc函数进行计算, 原有的bottom距离加上, 比如：`bottom: calc(50px + env(safe-area-inset-bottom))`

    - bottom是0

     - 增加一个空的块, 写入如下样式

   ```css
   body::after {
      position: fixed;
      bottom: 0;
      height: 0;
      width: 100%;
      height: constant(safe-area-inset-bottom);
      height: env(safe-area-inset-bottom);
      background-color: #fff; /* 需要与bottom颜色一致 */
   }
   ```

6. 使用`@supports`隔离兼容模式

   ```css
   @supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {
       body::after {
           ....
       }
   }
   ```





## 四、移动端布局解决方案

1. 布局方式：

	1. 固定布局

		1. 页面设置单位都是px，一般设置整个页面宽度320px，
		2. 缺点：大于320px的页面，两边都会留白，不好看。
	2. 流式布局：

		1. 宽度使用百分比，高度设置px，页面会出现拉伸，不兼容。

	3. 响应式布局：

		1. 利用媒体查询，判断不同的设备，使用不同的css文件，比较麻烦。
		2. 优点是：根据不同的手机页面适配不同，用户体验极好。
		3. 在引入css文件后面添加media="screen and (min-width)";限制使用css文件。
		4. min-width最小宽度，max-width最大宽度，min-height最小高度，max-height最大高度。

	1. rem布局：

		1. 设置页面html的font-size大小做比较，使用js代码获取设备的宽度给页面font-size赋值，实现元素自适应。
		2. 需要注意浏览器会有最小字体大小，会出现小尺寸手机文字下掉，设置单行/多行文本超出显示点状
		3. 图片是根据基线对齐，设置了默认页面font-size大小之后，字体变大，图片会下掉，转块可以解决。
		4. 图片需要设置宽高才能等比例缩放，放置背景图需要设置背景尺寸100%，否则图片大小无法根据rem等比例缩放，无法显示完整的图片。

2. rem单位：

	1. 当html{font-size:100px;}时，页面使用则1rem=100px;
	
3. em单位：

	1. 针对局部使用：当em的div{font-size:100px; }，div里面width:1em=100px;



## 五、使用插件自动转换px
1. 搜索安装：postcss-px2rem




## 六、移动端调试
1. 多页面调试
```html
<script src="https://cdn.jsdelivr.net/npm/vconsole"></script>
<script>new VConsole();</script>
```

![image](https://www.qfxlw.com/images/html-17_移动端布局-01.png)

2.  eruda调试工具
```html
<script type="text/javascript" src="//cdn.jsdelivr.net/npm/eruda"></script>
<script>eruda.init();</script>
```

![image](https://www.qfxlw.com/images/html-17_移动端布局-02.png)

## 参考文章

1. [Html5 页面适配iPhoneX(就是那么简单)](https://m.jb51.net/html5/691860.html)