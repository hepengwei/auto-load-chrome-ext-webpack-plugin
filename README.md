<h1 align="center">auto-load-chrome-ext-webpack-plugin</h1>
<div align="center">
一款将打包后的Chrome插件自动化加载到浏览器的webpack插件。
</div>

## 使用说明

安装
```
npm i auto-load-chrome-ext-webpack-plugin
```
使用示例
```
const AutoLoadChromeExtPlugin = require("auto-load-chrome-ext-webpack-plugin");

...
plugins: [
    isEnvProduction && new AutoLoadChromeExtPlugin({ 
        targetDir: "C:\\Users\\XXX\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\myChromeExtension",
        autoClickSelectLocation:
            "D:\\myProject\\chrome-extension-react-demo\\config\\autoClickSelect.exe",
        chromedriverLocation: "C:\\Program Files\\Google\\Chrome\\Application\\chromedriver.exe",
    }),
]
...
```
参数说明
```
targetDir 是你本地chrome浏览器存放插件位置的绝对路径，先到Extensions文件夹下创建一个myChromeExtension文件夹，然后将XXX改为你本地的真实用户名即可。
autoClickSelectLocation 是autoClickSelect.exe文件所在的绝对路径。
chromedriverLocation 是chromedriver.exe文件所在的绝对路径，默认为C:\Program Files\Google\Chrome\Application\chromedriver.exe，如果位置与之一致，可以不传该参数。
```


[详细文档](https://www.jianshu.com/p/4c854f6c6f86)
