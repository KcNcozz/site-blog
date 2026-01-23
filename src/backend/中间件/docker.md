# docker <Badge type="warning" text="总结于三更草堂的docker课程" />

## 容器基本命令

1. 找**镜像**：dockerhub：[https://hub.docker.com/](https://hub.docker.com/)
2. 下载**镜像**：`docker pull XXX:版本` 例如：`docker pull mysql:latest` **注意版本！！！ 注意版本！！！ 注意版本！！！**
3. 查看本地有哪些镜像 `docker images`
4. 查看运行时的容器   
- `docker ps `   
- `docker ps -a`
5. 创建并运行容器 `docker run XXX` 例如：`docker run nginx:latest` 
    - 后台运行 `docker run -d XXX `
    - 交互式运行 `docker run -it XXX`
6. 删除容器 `docker rm XXX` (运行时容器不能删除 可以通过添加参数进行删除)
7. 进入容器内执行命令 `docker exec XXXid` 命令  
    - 交互式 `docker exec -it XXXid bash`
8. 查看容器日志 `docker logs XXXid `  
    - 持续输出日志 `docker logs -f XXXid `
9. 停止容器 `docker stop XXXid`
10. 运行容器 `docker start XXXid `


::: tip 请解决一下问题？
1. 如何找到需要发布的端口？
2. 如何知道需要挂载的目录？
:::

## run命令详解

1. `-p` 端口映射 默认容器端口和宿主机端口不连通 `docker run -p 宿主机端口:容器端口`
若想发布多个端口 `docker run -p 宿主机端口1:容器端口1 -p 宿主机端口2:容器端口2`
2. `-v` 数据卷 用于宿主机和容器之间的 数据共享（同步）`docker run -v 宿主机目录:容器目录`
3. `-e` 设置环境变量 （某些变量不能写死 比如Mysql的root密码） `docker run -e 变量名=变量值 容器名`
4. `--name` 给容器命名 `docker run --name 定义的容器名 镜像名`
5. `--restart` 重启策略 用于容器或者宿主机因某些情况重启后 容器能够重新启动

## 数据卷高级

1. 别名 `docker run -v 别名:容器目录 镜像名` 这样不需要再写宿主机目录 直接用别名代替  docker会自己在宿主机创建一个目录
2. 创建数据卷 `docker volume create XXX` (用的不多)
3. 删除数据卷 `docker volume rm XXX` (用的不多)
4. eg:创建Mysql脚本 `docker run -d -v mysql_data:/var/lib/mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root --restart always --name blog_mysql mysql:5.7`
5. eg:创建Redis脚本 `docker run -d -v redis_data:/data -p 6379:6379 --restart always --name blog_redis redis:7.0 redis-server --appendonly yes`
6. eg:上传项目 `docker run -d -p 7777:7777 -v /usr/blog:/usr/blog --restart always --name sg_blog java:openjdk-8u111 java -jar /usr/blog/sangeng-blog-1.0-SNAPSHOT.jar`  
排查问题 `docker run -it -p 7777:7777 -v /usr/blog:/usr/blog --restart always --name sg_blog java:openjdk-8u111 bush`


## Docker网络

1. 创建网络 `docker network create 网络名`
2. 列出网络 `docker network ls`
3. 加入网络 
    - 创建时加入 `docker run --network 网络名 镜像名  ` 
	- 创建后加入 `docker network connect 网络名 容器名/XXXid`
4. 查看网络详情 `docker network inspect 网络名\id`
5. 删除网络 `docker network rm 网络名\id`


## DockerFile（用于构建镜像）

1. 构建镜像 `docker build -t 镜像名:镜像标签 -f 基于的DockerFile文件的文件名 DockerFile文件路径` eg: `docker build -t hello:1.0 -f helloworld .`
2. `FROM` 定义基础镜像 `FROM 镜像名:标签名` eg: `FROM centos:7`
3. `CMD` 容器 运行时 的默认命令 可以被`docker run`后面的命令覆盖
作用时机为：**容器运行的时候**
4. `ENV` 用于定义环境变量 `ENV 变量名="变量值"`
5. `WORKDIR` 用于设置当前的工作目录 如果该目录不存在则自动创建（若文件在OSS等网络路径 则可能不会解压 拿不准就自己调试）
6. `RUN` 构建时使用的命令
7. `ADD` 把构建上下文或者网络文件添加到镜像中 如果文件是压缩包会自动解压
8. `EXPOSE` 声明 开放端口(可以有多个) 只是声明 运行时仍需要使用`dockers run -p XXX:XXX`
9. `COPY` 从构建上下文中复制内容到镜像中 (COPY仅仅只是复制 单纯的拷贝)
10. `ENTRYPOINT` 用来定义容器运行时的默认命令 `docker run` 时无法覆盖`ENTRYPOINT`里的内容

## DockerCompose（用于启动服务）

1. DockerCompose是用来定义一个或者多个容器运行和应用的工具
2. 使用`yaml`文件编写（可以使用IDEA 有插件）
3. 查看版本 `docker compose version`
4. 运行 `docker compose up` `(docker compose up -d)`
5. 停止 `docker compose down `
6. 常用元素：  
    - command 覆盖容器启动后的默认命令  
    - environment 指定环境变量 `(docker run -e)`
    - image 指定镜像   
    - networks 指定网络 `(docker run --network)`
    - ports 指定发布端口 `(docker run -p)`
    - volumes 指定数据卷 `(docker run -v)` 
    - restart 指定重启策略 `(docker run --restart)`

## 问题

如何理解Dockerfile和DockerCompose？

[https://blog.csdn.net/londa/article/details/91815208](https://blog.csdn.net/londa/article/details/91815208)

