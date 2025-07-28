# 介绍
+ docker 是一个开源应用容器引擎
+ 诞生于2013年初，基于Go语言实现，dotClound公司出品
+ Docker可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的linux机器上。
+ 容器完全使用沙箱机制，相互隔离
+ 容器性能开销极低

**传统虚拟机和容器对比**

+ Docker容器是在操作系统层面上实现虚拟化，直接复用本地主机的操作系统，而传统虚拟机是在硬件层面实现虚拟化。与传统的虚拟机相比，Docker优势体现为启动速度快、占用体积小。
+ 每个容器之间相互隔离，每个容器有自己的文件系统，容器之间进程不会相互影响，能区分计算资源。

**docker能解决什么问题**

+ 随着微服务架构和Docker的发展，大量的应用会通过微服务方式架构，应用的开发构建将变成搭乐高积木一样，每个Docker容器将变成一块“积木”，应用升级将变得非常容器。当现有的容器不足以支撑业务处理时，可通过镜像运行新的容器进行快速扩容，使应用系统的扩容从原先的天级变成分钟级甚至秒级。
+ 容器化运行后，生产环境运行的应用可与开发、测试环境的应用高度一致。容器会将应用程序相关的环境和状态完全封装起来，不会因为底层基础架构和操作系统的不一致性给应用带来影响，产生新的BUG。当出现程序异常时，也可以通过测试环境的相同容器进行快速定位和修复。
+ Docker是内核级虚拟化，其不像传统虚拟化技术一样需要额外的Hypevisor支持，所以一台物理机上可以运行很多个容器实例，可以大大提升物理服务器的CPU和内存利用率。



**docker关键词**

+ 镜像文件
+ 容器虚拟化技术
+ docker hub ：docker镜像仓库

**docker基本组成**

+ 镜像(image):一个镜像可以创建多个容器，docker镜像文件类似于java的类模板，而docker容器实例l类似于java中new出来的实例对象。
+ 容器(contaner)：可以将容器看作是一个简易版的linux环境。
+ 仓库(repository)



**docker平台入门图解	**

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1663839425457-20e5e7d9-36bf-4f92-91d3-332282f4ee29.png)

**docker平台架构图解**

docker是一个C/S模式的架构，后端是一个松耦合架构，众多模块各司其职

docker运行基本流程为:

1. 用户用docker client 与 docker daemon建立通信，并发送请求给后者
2. docker daemon 作为docker架构中的主体部分，首先提供docker server功能使其可以接收docker client请求
3. docker engine 执行docker内部的一系列工作，每项工作以一个job的形式存在
4. job运行过程中，需要容器镜像时，则从Docker Registry中下载镜像，并通过镜像管理驱动Graph Driver将下载的镜像以Graph的形式存储。
5. 当需要为docker 创建网络环境时，通过网络管理驱动Network driver创建并配置docker容器网络环境。
6. 当需要限制docker容器运行资源或执行用户指令等操作时，则通过exec driver来完成
7. LibContainer是一项独立的容器管理包，Network driver以及Exec driver都是通过LibContainer来实现具体对容器进行的操作。



![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1663840411009-90d4cf95-18ae-4870-b4c1-1ff8eee792ca.png)

****

# 安装Docker
[https://docs.docker.com/engine/install/centos/](https://docs.docker.com/engine/install/centos/)

```xml
yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine



yum install -y yum-utils
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install docker-ce docker-ce-cli containerd.io docker-compose-plugin
systemctl start docker
docker run hello-world
```



阿里云镜像安装(按照阿里云给出步骤进行配置）

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1663913967075-26d6564c-5454-4e74-8e1a-b07ca8a3b94f.png)

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1663914024823-de73c976-4732-428c-b97e-5abd0d922901.png)

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1663914243658-b6bbbcda-716d-42f1-ba69-f66f670acd4b.png)



## helloworld分析介绍三要素
![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1663914272017-fe38fc7c-501d-445a-b5ab-29399c7f8a44.png)





# docker使用
## 帮助启动类命令
```shell
启动docker： systemctl start docker
停止docker： systemctl stop docker
重启docker： systemctl restart docker
查看docker状态： systemctl status docker
开机启动： systemctl enable docker
查看docker概要信息： docker info
查看docker总体帮助文档： docker --help
查看docker命令帮助文档： docker 具体命令 --helep
```



## 镜像命令
```plain
# 1. 列出本地主机上的镜像
##
# -a 列出本地所有的镜像（含历史）
# -q 只显示镜像id
##
docker images [-a|-q]  



# 2. 远程仓库上搜索某个镜像、
##
# --limit n 只列出n个镜像，默认25个
## 
docker search [--limit n] 某个xxx镜像名字


# 3. 从远程仓库上拉去某个镜像
##
# 没有TAG等同于docker pull 镜像名字:latest
# 示例：docker pull redis:6.0.8
##
docker pull 某个xxx镜像名字[:TAG]



# 4. 查看镜像/容器/数据卷所占的空间
docker system df


# 5. 删除某个镜像
##
# -f 强制删除
# 删除多个：docker rmi -f 镜像名1:TAG 镜像名2:TAG
# 删除全部：docker rmi $(docker images -qa)
##
docker rmi [-f] [repository|image id]
```

### docker image
![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1663914792730-b132b0c6-5621-4547-8237-974aa1f5d166.png)

各个选项说明：

:::color3
REPOSITORY：表示镜像的仓库源

TAG：镜像的标签版本号

IMAGE ID：镜像ID

CREATED：镜像创建时间

SIZE：镜像大小



注意： 同一个仓库源可以有多个TAG版本，代表这个仓库源的不同版本，我们使用REPOSITORY：TAG来定义不同的镜像，如果不指定一个镜像的版本标签，，将默认使用lastest镜像。

:::

### docker system df
![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1663915971589-9fbae1d0-54a0-4a6d-a138-6f7ccd75d789.png)



### docker 虚悬镜像是什么（面试题）
**仓库名、标签都是none的镜像，俗称虚悬镜像 dangling image**

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1663916510561-1c4a08e4-3303-4e9b-9a05-c51f491bffc5.png)

## 容器命令
### 基础
```plain
# 1. 新建+启动容器
##
# options 说明：
# 	--name="容器新名字"   	为容器指定新名称，不指定，系统随机分配一个名称
# 	-d   									后台运行容器并返回容器ID，即启动守护式容器（后台运行）
#		-i										以交互模式运行容器，通常与-t同时使用
# 	-t										为容器重新分配一个伪输入终端，通常与-i同时使用，也即启动交互式容器（前台有伪终端，等待交互）
#		-P										随机端口映射
#   -p										指定端口映射


# docker中运行ubuntu ： docker run -it ubuntu /bin/bash
##
docker run [options] imagesName [command] [ARGs...]




# 2. 列出正在运行的容器实例
##
# options 说明：
# 	-a		列出当前所有正在运行的容器+历史上运行过的容器
# 	-l		显示最近创建的容器
# 	-m		显示最近n个创建的容器
# 	-q 		静默模式，只显示容器编号
##
docker -ps [options]


# 3. 退出容器
exit  		（run进入容器，exit退出，容器停止）
ctrl+p+q	（run进入容器，ctrl+p+q退出，容器不停止）


# 4. 启动已停止运行的容器
docker start 容器ID或者容器名



# 5. 重启容器
docker restart 容器ID或者荣启铭


# 6. 停止容器
docker stop 容器ID或者容器名


# 7. 强制停止容器
docker kill 容器ID或容器名

# 8. 删除已停止容器
# -f 强制删除
docker rm 容器ID
```





### 重要
#### 使用镜像以后台模式启动一个容器
`docker run -d centos`



问题： docker ps -a 进行查看，<font style="color:#E8323C;">会发现容器已经退出，并不存在该容器</font>。

主要原因：Docker容器后台运行，就必须有一个前台进程，容器运行的命令如果不是那些一值挂起的命令（top，tail）就会自动退出这个式docker容器的机制问题，docker前台没有运行的应用，这样的容器后台启动后就会立即自杀。

解决：所以最佳方案是将你要运行的程序以前台进程的形式运行，常见的就是命令行模式，表示我还有交互操作，别中断。



#### 查看容器日志
`docker logs 容器id`

#### 查看容器内运行的进程
`docker top 容器id`

#### 查看容器内部细节
`docker inspect 容器id`

#### 进入正在后台运行的容器并以命令行交互
1. `docker exec -it 容器ID bashShell` 例子：`docker exec -it ubuntu容器ID /bin/bash`
2. `docker attach 容器ID`

两者区别

+ attach 直接进入容器启动命令的终端，不会启动新的进程，用exit退出，会导致容器的停止
+ exec是在容器中打开新的终端，并且可以启动新的进程，用exit退出，不会导致容器的停止

#### 从容器内拷贝文件到主机（备份文件）
docker cp 容器ID：容器内的路径 目的主机路径



#### 导出容器（备份镜像）
export 导出容器的内容留作一个tar归档文件[对应import命令]

import 从tar包中的内容创建一个新的文件系统再导入为镜像



**案例**

`docker export 容器ID >文件名.tar`

 `cat 文件名.tar | docker import -镜像用户/镜像名：镜像版本号`



## 镜像分层
Docker中的镜像分层，支持通过扩展现有镜像，创建新的镜像。类似java继承一个Base基础类，自己再按需扩展，新镜像是从base镜像一层一层叠加生成，每安装一个软件，就在现有镜像的基础上增加一层。





镜像分层最大的好处就是共享资源，方便复制迁移

比如说有多个镜像都是从相同的base镜像构建处理啊，那么Docker Host只需要再磁盘上保存一份base镜像；同时内存中也只需加载一份base镜像，就可以为所有容器服务，而且镜像的每一层都可以被共享

## 镜像发布
### docker 镜像commit 命令
docker commit 提交容器副本，使之成为新的镜像

`docker commit -m “提交的描述信息”-a=作者 容器ID 要创建的目标镜像名:[标签名]`



案例：对不支持vim编辑命令的ubuntu增加支持，并发布镜像到本地

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1663923309666-8e873eed-752f-4eab-bfdd-d3c4953e11e9.png)

`docker commit -m "vim add ok" -a="zhoulinfeng" 031f455755c0 zhoulinfeng/myubuntu:1.1`

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1663923834227-2514fe61-87f6-4545-aee2-13e568e4d907.png)

### 本地镜像发布到阿里云
### 
1. 创建个人实例
2. 创建命名空间

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1663924623841-63fc0605-7127-4754-bd3c-c777c69673a4.png)

3. 创建仓库名称

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1663924764453-88e7dfcb-73f4-4faa-897d-d36d3265eb8b.png)

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1663924782953-8b46ca33-89e3-4f76-84b3-5d3e1d46bfbe.png)4. 按照操作指南进行操作

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1663924816787-deabf6f5-20de-4c32-9900-4cfbbb5874db.png)



5. 将阿里云上的镜像拉取到本地使用

### docker 私有库
docker Registry 是官方提供的工具，用于构建私有的镜像仓库

1. docker中下载镜像docker registry ：`docker pull registry`
2. 运行私有库Registry，相当于本地有个私有`docker run -d -p 5000:5000 -v /zzyyuse/myregistry/:/tmp/registry --privileged=true registry`
3. 案例演示创建一个新镜像， ubuntu安装ifconfig命令
4. 安装完成后，commit我们的新景象
5. curl 验证私服库上存在什么镜像： `curl -XGET 本机ip:5000/v2/_catalog`

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1663927226469-0affdd7f-128f-44f1-bcd6-1ee560841705.png)

6. 将新镜象修改符合私服规范的Tag

<font style="color:rgb(102, 102, 102);background-color:rgb(242, 248, 255);"> docker tag 镜像:tag ip地址和端口/名称:[镜像版本号]</font>

7. 修改配置文件使之支持http:修改完成后建议重启docker

```json
{
  "registry-mirrors": ["https://xlnl77c8.mirror.aliyuncs.com"],
  "insecure-registries":["192.168.229.140:5000"]
}
```



8. push推送到私服：`docker push 192.168.229.140:5000/ubuntu1.2:1.2`
9. curl验证私服库镜像 `curl -XGET 本机ip:5000/v2/_catalog`
10. pull到本地并运行



## 容器数据卷
**引出**

docker 挂载主机目录访问如果出现cannot open directory . : Permission denied

解决办法：在挂载目录后加一个 --privieged=true参数即可

****

`docker run -d -p 5000:5000 -v /zzyyuse/myregistry/:/tmp/registry --privileged=true registry`



其中解释 `-v /zzyyuse/myregistry/:/tmp/registry --privileged=true `、

默认情况下，仓库被创建再容器的var/lib/registry目录下，建议自行用容器卷映射，方便于宿主机联调

:::color3
-v      					自定义容器卷

/zzyyuse/myregistry/    	宿主机的路径

/tmp/registry  			容器内的路径

--privileged=true 		放开权限

:::



运行这个容器后，这样就完成了容器内部和宿主机某个绝对路径实现了信息共享和互通互联



### 作用
映射，容器内的数据备份+持久化到本地主机目录



### 是什么
卷就是目录或文件，存在于一个或多个容器中，由docker挂载到容器，但不属于联合文件系统，因此能够绕过联合文件系统提供一些用于存储或共享数据的特性；

卷的设计目的就是数据的持久化，完全独立于容器的生存周期，因此Docker不会在容器删除时删除其挂载的数据卷



### 特点
1. 数据卷可以在容器之间共享或重用数据
2. 卷中的更改可以直接实时生效
3. 数据卷中的更改不会包含在镜像的更新中
4. 数据卷的声明周期一直持续到没有容器使用它为止

### 案例
`docker run -it --privileged=true -v /tmp/host_data:/tmp/docker_data --name=u1 ubuntu`

命令将容器内部/tmp/docker_data同/tmp/host_data 关联起来

我们在容器内部的/tmp/docker_data中创建一个文件dockerin.txt，在宿主机/tmp/host_data下可以发现该文件，

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1664160937576-0f40fee4-b4e0-4f5c-9d70-9a8229f8d584.png)

同样在宿主机中创建一个文件hostin.tx

在容器内部/tmp/docker_data也能看见![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1664160995581-8e71e4f7-6259-4e2f-989c-fccb289c425b.png)



注意：

:::color3
即便容器已经停止了，宿主机此时添加内容，容器恢复后，数据也能得到同步

:::





### 容器数据卷ro和rw读写规则
`docker run -it --privileged=true -v 宿主机绝对路径:容器内目录:rw --name=容器名 镜像名`

默认rw   

需求，容器内部被限制，只能读取不能写(ro 即 read only):

`docker run -it --privileged=true -v 宿主机绝对路径:容器内目录:ro --name=容器名 镜像名`

此时，容器自己只能读，不能写，如果宿主机写入内容，可以同步给容器内，容器可以读取到





### 容器卷的继承和共享
容器1完成和宿主机得映射

`docker run -it --privileged=true -v 宿主机绝对路径:容器内目录:rw --name=容器名 镜像名`

容器2继承容器1得卷规则

`docker run -it --privileged=true --volumes-from 需要继承的容器名 --name=容器名 镜像名`





## 常规软件的安装
### 总体步骤
1. 搜索镜像
2. 拉去镜像
3. 查看镜像
4. 启动镜像
5. 停止容器
6. 移出容器

### 安装tomcat
`docker run -d -p 8080:8080 billygoo/tomcat8-jdk8`

### 安装mysql
`docker run -p 3307:3307 --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:5.7`

-e  MYSQL_ROOT_PASSWORD 设置密码

注意：需要进行一些配置，在mysql的配置文件中配置一些字符集，挂载容器数据卷

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1664174546252-abbcad9b-5203-45a3-b284-5e5e3d73929a.png)

### 安装redis
1. 在cenos宿主机下新建目录/app/redis         
2. 将一个redis.conf 文件模板拷贝进/app/redis目录下
3. /app/redis目录下修改redis.conf文件，默认出场的原始redis.conf
4. 使用redis6.0.8镜像创建容器
5. 测试redis-cli连接上来
6. 请证明docker启动使用了我们自己指定的配置文件
7. 测试redis-cli 连接上来第2次



# 高级篇
## Docker复杂安装祥说
### mysql主从复制
1. 新建主服务器容器实例

```bash
docker run -p 3307:3306 --name mysql-master -v /mydata/mysql-master/log:/var/log/mysql -v /mydata/mysql-master/data:/var/lib/mysql -v /mydata/mysql-master/conf:/etc/mysql -e MYSQL_ROOT_PASSWORD=root -d mysql:5.7

```

2. 进入/mydata/mysql-master/conf 目录下新建my.cnf

```bash
[mysqld]
## 设置server_id，同一局域网中需要唯一
server_id=1
## 指定不需要同步的数据库名称
binlog-ignore-db=mysql
## 开启二进制日志功能
log-bin=mall-mysql-bin
## 设置二进制日志使用内存大小（事务）
binlog_cache_size=1M
## 设置s使用的二进制日志格式（mixed，statement，row)
binlog_format=mixed
## 二进制日志过期清理时间，默认0，表示不自动清理
expire_logs_days=7
read-only=0

```

3. 修改完配置后重启master实例  `docker restart mysql-master`
4. 进入mysql-master容器
5. master容器实例内创建数据同步用户并赋予权限

```bash
create user 'slave'@'%' identified by 'slave';
GRANT REPLICATION SLAVE ON *.* TO 'slave'@'%';
```

6. 新建从服务器容器实例3308

```bash
docker run -p 3308:3306 --name mysql-slave -e MYSQL_ROOT_PASSWORD=root -v /mydata/mysql-slave/log:/var/log/mysql -v /mydata/mysql-slave/data:/var/lib/mysql -v /mydata/mysql-slave/conf:/etc/mysql -d mysql:5.7

```

7. 进入/mydata/mysql-slave/conf目录下新建my.cnf
8. 修改完配置后重启slave实例
9. 在数据库中查看主从同步状态
10. 进入mysql-slave容器
11. 在从数据库中配置主从复制

```bash
change master to master_host='192.168.229.140',master_user='slave',master_password='slave',master_port=3306,master_log_file='mall-mysql-bin.000009',master_log_pos=597,master_connect_retry=30;

```

12. 在从数据库中查看主从同步状态

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1664183665214-3c56adbb-7682-42f2-b8e9-2d7cdd6fb909.png)





### redis 三主三从集群配置
1. 关闭防火墙，启动docker服务
2. 新建6个docker容器实例

```bash
 docker run -d --name redis-node-1 --net host --privileged=true -v /data/redis/share/redis-node-1:/data redis:6.0.8 --cluster-enabled yes --appendonly yes --port 6381
 docker run -d --name redis-node-2 --net host --privileged=true -v /data/redis/share/redis-node-2:/data redis:6.0.8 --cluster-enabled yes --appendonly yes --port 6382
 docker run -d --name redis-node-3 --net host --privileged=true -v /data/redis/share/redis-node-3:/data redis:6.0.8 --cluster-enabled yes --appendonly yes --port 6383
 docker run -d --name redis-node-4 --net host --privileged=true -v /data/redis/share/redis-node-4:/data redis:6.0.8 --cluster-enabled yes --appendonly yes --port 6384
 docker run -d --name redis-node-5 --net host --privileged=true -v /data/redis/share/redis-node-5:/data redis:6.0.8 --cluster-enabled yes --appendonly yes --port 6385
 docker run -d --name redis-node-6 --net host --privileged=true -v /data/redis/share/redis-node-6:/data redis:6.0.8 --cluster-enabled yes --appendonly yes --port 6386

--net host   					使用宿主机的IP和端口，默认
--cluster-enabled yes 开启redis集群
--appendonly yes    	开启持久化
--port 6386  					redis端口号
```

3. 进入容器，构建主从关系

```bash
redis-cli --cluster create 192.168.229.140:6381 192.168.229.140:6382 192.168.229.140:6383 192.168.229.140:6384 192.168.229.140:6385 192.168.229.140:6386 --cluster-replicas 1


--cluster-replicas 1      为每个master创建一个slave节点


```

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1664248445628-7d329292-6511-4fa8-933b-3a226a90514c.png)

4.  查看节点状态

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1664248899322-ba3aa730-f707-4793-b5e9-a7c00ff70c5d.png)



#### redis读写路由正确案例
进入某个容器，连接redis  加上参数c,优化路由

`redis-cli -p 6391 -c`

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1664256657440-8bca1da9-7ceb-4b27-9c9c-23c3e924dc77.png)



`redis-cli --cluster check ip:port`  集群检查

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1664256829559-a3f4d97a-a19b-4a31-9be0-c8c884f4e9d1.png)



#### 出从容错切换迁移
![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1664257201983-59ca8987-40da-45ce-9ef7-97ee228c2755.png)

#### 主从扩容
1. docker 运行新加的实例 6387、6388两个节点
2. 进入6387容器实例内部
3. 将新增的6387作为master节点加入集群

`redis-cli --cluster add-node ip1:port1 ip2:port2`

+ ip1：port1就是将要作为master的新增节点
+ ip2：port2就是原来集群节点里面的领路人，相当于之前设置的6381
4. 检查集群情况：`redis-cli --cluster check ip:port`
5. 重新分配槽位: `redis-cli --cluster reshared 第一个redis的ip:端口`
6. 为新增的主节点6387增加从机

`redis-cli --cluster add-node  新增从机ip:port 新增主机ip:port --cluster-slave  --cluster-master-id  xxx`



#### 缩容
1. 先清除从节点6388

`redis-cli --cluster del-node 6388从机ip:port 从机6388节点ID`

2. 清理出来的槽位重新分配：`redis-cli --cluster reshared 第一个redis的ip:端口`

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1664259641104-17657386-e3cb-4e3d-90b9-3655f0271085.png)

3. 在删除6387

`redis-cli --cluster del-node 6387从机ip:port 从机6387节点ID`

4. 恢复原来的三主三从，检查集群情况



## DockerFile解析
### 简介
Dockerfile时用来构建Docker镜像的文本文件，是由一条条构建镜像所需的指令和参数构成的脚本。

### 编写dockerfile文件
#### 基础知识
1. 每条保留字指令都必须为大写字母且后面要跟随至少一个参数
2. 指令按照从上到下，顺序执行
3. #表示注释
4. 每条指令都会创建一个新的镜像曾并对镜像进行提交

#### 常用保留字
+ FROM ：基础镜像，当前新镜像时基于哪个镜像的，指定一个已经存在的镜像作为模板，第一条必须时from
+ MAINTAINER： 镜像维护者的姓名和邮箱地址
+ RUN： 容器构建的时候就会执行的命令，有两种格式（RUN是docker build时运行）
    - shell格式
    - exec格式
+ EXPOSE： 当前容器对外暴露的端口
+ WORKDIR： 指定在创建容器后，终端默认登录进来的工作目录，一个落脚点
+ USER： 指定该镜像以什么用户来运行
+ ENV： 用来在构建镜像过程中设置环境变量，相当于定义了一个变量，后面可以直接引用
+ ADD：  将宿主机目录下的文件拷贝进镜像切回自动处理URL和解压tar压缩包
+ COPY： 类似ADD，拷贝文件到目录镜像中，将从构建上下文目录中<源路径>的文件/目录复制到新的一层的镜像内的<目标>
+ VOLUME：容器数据卷，用于数据保存和持久化工作
+ CMD：指定容器启动后需要干的事情
    - 注意：可以有多个CMD指令，但是只有最后一个生效，cmd会被docker run之后的参数替换
+ ENTRYPOINT：也是用来指定一个容器启动时要运行的命令
    - 但是不会被docker run后面的命令覆盖，而且这些命令行参数会被当作参数送给ENTRYPOINT 指令指定的程序
    - ![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1664263073802-cb4eb8a2-bec8-4928-9d50-5b14369f3443.png)





#### 案例
需求：使得centos7镜像具备vim+ifconfig+jdk8

1. jdk下载
2. 编写Dockerfile文件

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1664267686136-6db4f0b3-efe0-4757-bc8f-366616271685.png)

3. 构建：docker build -t 新镜像名称：TAG .





### 虚悬镜像
在构建时没有指定镜像名和TAG 导致tab和名称都为none 的镜像

:::color3
`docker image ls -f dangling=true`     列出所有虚悬镜像

`docker image prune`         				移出所有虚悬镜像

:::

## Docker微服务实战






## Docker网络
### 常用命令
查看docker支持的网络模式

`docker network ls`

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1664329925027-3e2313e8-dc23-4332-9ca0-09c8e92b5d7f.png)

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1664330090970-e2f0e588-dbd9-466c-83a2-b4e9f392b4d7.png)

查看docker 网络支持的命令

`docker network command`

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1664329962967-da845a38-ce92-4632-9e9b-2621d3b6079a.png)



### docker network 能干什么
+ 容器间的互联和通信以及端口映射
+ 容器IP变动时候可以通过服务名直接网络通信而不受影响

### docker的网络模式


#### bridge
![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1664332187674-6924f50b-9e24-448c-a49c-e119e5b4ad7a.png)

为每个容器分配、设置IP，并将容器连接到一个docker，虚拟网桥，默认为该模式。

使用` --network bridge` 指定，也可以不指定，默认为该模式

#### host
![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1664332976137-1c66194c-875a-45c8-b15d-dde06a3c30f1.png)

容器将不会虚拟出自己的网卡，配置自己的IP等，而是使用宿主机的IP和端口

使用 --network host 指定 

![](https://cdn.nlark.com/yuque/0/2022/png/22908662/1664345906002-cf6413ec-9352-4fb9-8825-db0fbf5d0797.png)

#### none
容器有独立的network namespace，但并没有对其进行任何网络设置，如分配veth pair和网络桥接，IP等

使用 --network none 指定

#### container
新创建的容器不会创建自己的网卡和配置自己的IP，而是和一个指定的容器共享IP、端口范围等

使用 `--network container:NAME 或者 容器ID`  指定





#### 自定义网络
`docker netword  create  网络名称`

使用：

`docker run -d -p xxxx:xxx --networ 自定义网络名称 ....`



## Docker-compose容器编排
### 简介
Dockers-compose 时docker 官方的开源项目，负责实现对Docker容器集群的快速编排

 

Compose 是Docker 公司推出的一个工具软件，可以管理多个Docker容器组成的一个应用，你需要定义一个YAML配置文件docker-compose.yml,写好多个容器之间的调用关系，然后，只要一个命令，就能同时启动/关闭这些容器



docker 建议我们每个容器种只运行一个服务，因为docker容器本身占用资源极少，所以最好是将每个服务单独的分割开来，但是这样我们又面临一个问题：

如果我们需要同时部署好多个服务，难道要每个服务单独写Dockerfile然后再构建镜像，构建容器？所以docker官方为我们提供了docker-compose多服务部署的工具。

例如要实现一个web容器微服务项目，除了web服务器本身，往往还需要加上数据库，redis服务器，注册中心，甚至包括负载均衡容器等等。

Compose允许用户通过一个单独的docker-compose.yml模板文件，来定义一组相关联的应用容器为一个项目

可以很容易地用一个配置文件定义一个多容器的应用，然后使用一条指令安装这个应用的所有依赖，完成构建。Docker-compose解决了容器与容器





### 下载安装
[https://docs.docker.com/compose/install/linux/](https://docs.docker.com/compose/install/linux/)

### 核心概念
+ 一个文件
+ 两个要素
    - 服务：一个个应用容器实例，比如订单微服务、库存微服务、mysql容器
    - 工程： 由一组关联的应用容器组成一个完整业务单元，在docker-compose.yml文件种定义	

### 使用步骤
1. 编写Dockerfile定义各个微服务应用并构建出对应的镜像文件
2. 使用docker-compose.yml定义一个完整业务单元，安排好整体应用的各个容器服务
3. 最后，执行docker-compose up命令来启动并运行整个应用程序，完成一键部署上线



## Docker轻量级可视化工具Portainer
## Docker容器监控之CAdvisor+influxDB+Granfana


