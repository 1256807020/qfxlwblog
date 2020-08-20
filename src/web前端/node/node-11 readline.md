# node-11 readline

## 接收键盘输入

基本例子：

```js
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
rl.question('你如何看待 Node.js 中文网？', (answer) => {
  // TODO：将答案记录在数据库中。
  console.log(`感谢您的宝贵意见：${answer}`);
  // 调用输入关闭, 如果不关闭则会一直停留
  rl.close();
});
```

一直输入的例子：

```js
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// 设置提示的内容
rl.setPrompt('请输入内容：')
// 打印提示内容
rl.prompt()
rl.on('line', line => {
    if(line === 'exit'){
        console.log('已退出')
        process.exit(0)
        return false
    }
    console.log(line) // line为输入的内容
}).on('error', () => {
    console.log('出错了')
    rl.prompt() // 再次打印输入的内容
}).on('close', () => {
    console.log('已退出！')
    process.exit(0)
})
```

`rl.setPrompt(prompt)` 方法设置每当调用 `rl.prompt()` 时将写入 `output` 的提示。