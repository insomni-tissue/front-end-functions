# 开发调试
使用npm link关联本地包进行开发调试

* 链接当前包到全局
```js
// 当前跟目录下运行
npm link
```

* 运行环境使用本地npm包
```js
// 在运行项目目录运行
npm link front-end-functions
```

# npm打包发布
## 增加配置文件
复制 .npmrc.example 并重命名 .npmrc

## 修改.npmrc配置

首先对账号和密码进行Base64编码， 在命令行或者Terminal中输入（以下所有配置都不需要保留尖括号， 整体换掉）

```
echo -n '账号:密码' | openssl base64
```
Windows用户可能会提示openssl 命令不存在, 可以先在idesk上安装Git 客户端, 之后再Git Bash中执行就可以了。

```
init.author.name = 用户名
init.author.email = 邮箱
init.author.url = url
# an email is required to publish npm packages
email=邮箱
always-auth=true
_auth=上一步的Base64编码输出
```

## 修改版本号
修改package.json中的version
**每次发布需修改版本号， 否则无法发布**

<!-- npm config set registry https://registry.npmjs.org/ -->

## 打包
```
npm run build
```

## 发布
```
npm publish
npm publish --access publish

```
