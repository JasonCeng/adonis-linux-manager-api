# adonis-linux-manager-api

本项目是Linux服务器管理面板的后端工程，由于项目采用前后端分离模式，所以前后端分开存储在两个不同仓库中，前端工程请移步到仓库（<a href='https://github.com/JasonCeng/vue-linux-manager-fronted' target='_blank'>vue-linux-manager-fronted</a>）查看。

## 一、	环境准备

1.安装```Node.js v8+``` 和 ```npm v3+```

2.安装```MySQL 5.5+```

## 二、前端部署说明

· 前端工程详见：<a href='https://github.com/JasonCeng/vue-linux-manager-fronted' target='_blank'>vue-linux-manager-fronted</a>

1.npm包安装

在```vue-linux-manager-fronted```根目录下运行：npm install安装相应的npm包

2.前端构建

在```vue-linux-manager-fronted```根目录下运行：```npm run build``` 构建前端静态资源，生成dist文件夹

3.Ngxin准备

在服务器上安装并运行```nginx```服务器

4.部署前端资源

将dist文件夹放到nginx的html目录下，并将文件夹名称修改成对应项目名(即```四、```中的***前端项目名***)，方便后期维护与管理

## 三、后端部署说明

1.将```adonis-linux-manager-api```文件夹上传到对应的服务器上，位置由你自己决定

2.在```adonis-linux-manager-api```根目录下运行：```npm install```

3.创建一个数据库并在 ```.env``` 中做好相应配置

4.运行数据迁移，在```adonis-linux-manager-api-centos```根目录下运行：```adonis migration:run```

5.使用pm2启动项目：```pm2 start server.js```

## 四、访问项目

1.在浏览器中输入你服务器的 ```ip/前端项目名``` 即可访问项目

Have a good time~  :laughing: 