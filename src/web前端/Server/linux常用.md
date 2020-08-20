# linux常用

## 基本操作

* 清空当前屏幕：`clear`
* 直到多少秒：`sleep 60`
* 查看历史命令：`history`，
  * 使用`!n`执行第n条命令，
  * `!!`执行上一条命令
  * `!字串` 执行上一条该字串开头的命令



## linux修改中文系统

1. locale -a查看是否有zh_CN.UTF-8，如果有则进行下一步，没有自行百度安装

2. 使用`vim`打开`locale.conf`文件

   `vim /etc/locale.conf`

3. 编辑文件后保存退出

   ```sh
   LANG="zh_CN.UTF-8" # en_US.UTF-8为英文
   ```

4. 最后重启 `reboot`




## 本地直接连接linux

```shell
ssh root@39.107.82.176
```



## 使用xshell上传网站

1. 安装：`yum install lrzsz -y`
2. 检查安装是否完成：`rpm -qa | grep lrzsz`
3. 基本操作：

* 上传：`rz` 直接弹出上传窗口
* 下载：`sz` 直接弹出下载窗口



## 本地cmd直接操作文件上传

```shell
# 下载文件
scp build.gz root@107.172.27.254:/home/test.txt
# 上传文件
scp test.txt root@107.172.27.254:/home    
# 下载目录
scp -r dist root@107.172.27.254:/home/test   
# 上传目录
scp -r dist root@107.172.27.254:/home    
# 上传当前目录所有文件和目录到远程
scp -r * root@39.107.82.176:/home
```


## 解决scp不需要输入密码直接上传

1. 在linux输入
```shell
ssh-keygen -t rsa
cd /root/.ssh
```
2. 在本地执行以下命令，并一路回车创建ssh密钥
```shell
ssh-keygen -t rsa
```
之后到`C:\Users\Administrator\.ssh`，输入以下命令
```shell
scp id_rsa.pub root@39.107.82.176
```
3. 文件上传之后到linux输入命令
```shell
cd /root/.ssh
cat id_rsa.pub >> authorized_keys
```
4. 已经可以测试不输入密码直接上传了



## 本地直接打包加上传

```shell
# 切换到build目录里
$ cd ./build
$ tar -cvf build.gz *
# 上传到www/wwwroot/chart目录
$ scp build.gz root@39.107.82.176:/www/wwwroot/chart
# 连接到linux,并输入密码
$ ssh root@39.107.82.176

#  服务器的操作
# 切换到www/wwwroot/chart目录
cd /www/wwwroot/chart && ls
# 解压
tar -xvf build.gz
```



## 填写脚本自动上传

1. 本地脚本，在项目根目录创建文件夹delony.sh，只要是sh后缀都行
```shell
#!/bin/bash
npm run build
cd ./build
tar -cvf build.gz *
scp build.gz root@39.107.82.176:/www/wwwroot/chart
ssh root@39.107.82.176
```
2. 运行之后会直接到服务器
```shell
touch delony.sh
chmod 777 delony.sh
vim delony.sh

# 写入以下代码
#!/bin/bash
cd /www/wwwroot/chart
tar -xvf build.gz
rm -rf build.gz
```

3. 之后点击一下delony.sh，之后在到服务器运行：sh ./delony.sh即可




## node项目保持后台运行

1. 全局安装：`npm install forever -g`

2. 启动某个项目：forever start 文件名

   ![image](https://www.qfxlw.com/images/server-03_linux常用-02.png)

3. 查看后台运行的项目：forever list

   ![image](https://www.qfxlw.com/images/server-03_linux常用-03.png)

4. 停止某个项目：forever stop [pid]

   ![image](https://www.qfxlw.com/images/server-03_linux常用-04.png)

5. 停止所有项目：forever stopall





## nohup后台运行sh程序及查看

1. <font color=red>后台执行.sh文件（使用nohup和&命令）</font>

   ```sh
   nohup ./a.sh &
   ```

   * nohup：加在一个命令的最前面，表示不挂断的运行命令
   * &：加在一个命令的最后面，表示这个命令放在后台运行；

   执行之后会增加一个`nohup.out`文件查看执行日志

   注意：在执行该.sh文件出错时，建议可以先手动运行一下sh文件有没有错误

2. <font color=red>查看后台运行的命令（使用ps和jobs）</font>

   * `jobs`：只能查看当前终端后台执行的任务，换了终端就看不见了

     ```sh
     [1]- 运行中        nohup ./one.sh &
     [2]+ 运行中        nohup ./a.sh &
     ```

     `-` 表示之前的任务，`+`表示最近的任务，`[1]`代表jobnum是1；

   * `ps`：可以查看别的终端的任务

     ```sh
     [root@qfxlw test]ps -aux | grep a.sh # 将a.sh的任务过滤出来
     root     15208  0.0  0.0 113176  1404 pts/1    S    16:02   0:00 /bin/bash ./one.sh
     root     16413  0.0  0.2 151752  5356 pts/1    S+   16:11   0:00 vim one.sh
     root     19902  0.0  0.0 112724  1000 pts/5    R+   16:31   0:00 grep --color=auto one.sh
     ```

     参数：`a` 显示所有程序    `u` 以用户为主的格式显示   `x` 显示所有的程序，不以终端机来区分

     第二列为PID；

3. <font color=red>关闭当前后台运行的程序（使用kill）</font>

   （1）通过jobs命令查看jobnum，然后执行`kill jobnum`

   （2）通过ps命令查看进程号PID，然后执行`kill PID`

   （3）当前的前台的进程按`ctrl+c`就可以终止了

4. <font color=red>前后台进程的切换与控制</font>

   （1）`fg`命令

   将后台中的命令调至前台继续运行；

   如果后台有多个命令，可以使用jobs查看Jobnum，然后使用fg %jobnum将选中的命令调出；

   （2）`ctrl + z`命令

   将一个正在前台执行的命令放到后台，并且处于暂停状态

   （3）`bg` 命令

   将一个在后台暂停的命令，变成在后台继续执行；

   如果多个命令使用jobs查看，之后bg %jobnum；



## ubuntu下使用nvm

1. 从github克隆过来

   需要先创建~/git目录，之后将git的东西放在里面；还需要`apt install git`；

   ```sh
   $ cd ~/git
   $ git clone https://github.com/creationix/nvm.git
   ```

2. 配置终端启动时自动执行 source ~/git/nvm/nvm.sh,

   在 ~/.bashrc, ~/.bash_profile, ~/.profile, 或者 ~/.zshrc 文件添加以下命令:

   ```sh
   source ~/git/nvm/nvm.sh
   ```

3. 重新打开

4. 配置nvm环境变量

   添加到上面一样的文件里面

   ```sh
   # nvm
   export NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/mirrors/node
   source ~/git/nvm/nvm.sh
   ```

5. 之后就可以使用nvm来安装各版本的node了

