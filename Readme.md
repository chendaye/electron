#> 安装 node
#> 添加node环境变量
#> 添加一个 start 脚本来指引 node 去执行当前的 package  ,  package.json -> scripts -> "start": "electron ."
#> 安装 Electron,推荐的安装方法是把它作为您 app 中的开发依赖项，这使您可以在不同的 app 中使用不同的 Electron 版本  npm install --save-dev electron
#> 主进程文件 index.js (main.js) ; 写相应的代码逻辑； 也可以写在其他文件里，然后 require

#> 应用打包
#> 安装electron-prebuilt，它是一个npm模块，因此我们可以使用Npm来进行安装，它是一个electron的预编译版本  : npm install -g electron-prebuilt
#> 安装electron-packager ，它也是一个npm模块，是一个用于打包electron应用的工具 : npm install -g electron-packager

#> 打包
#> electron-packager 用法： electron-packager <应用目录> <应用名称> <打包平台> --out <输出目录> <架构> <应用版本>
#> 查看 electron-version 版本: 直接 electron
#> 改窗口左上角的图标和任务栏的图标，只需要在打包的命令上加个icon参数就好了
#> 1, electron-packager . Chendaye666 --win --out ../Exe/Chendaye666 --arch=x64 --version=0.0.1 --electron-version=1.4.13 --icon=assets/app-icon/win/logo.ico
#> 2, 将上述打包命令卸载 package.json 中 : npm run-script package:win64

#> 效果：直接在当前项目目录的同级目录生成  HelloWorldApp 就是项目 app Chendaye666.exe


#_________________________________________________________________________________________________
项目目录：
  assets ：图片 样式等静态资源 jssss
  main-process : 主进程目录（每一个项目分一个文件夹）
  renderer-process: 渲染进程，与主进程相对应
  sections : 放置要渲染的视图，目录结构与渲染进程对应
  script : 放置项目命令脚本