---
layout: post
title:  "Python 笔记 3(网络相关)"
categories: Python
tags: Python
author: xchenhao
---

* content
{:toc}



### socket

```python
import socket

# 创建一个 tcp socket
s1 = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# 创建一个 udp socket
s2 = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
```

### [UDP](/2019/01/08/network-note-1/#udp-网络通过过程)

#### 客户端收发数据

```python
'''
创建客户端套接字
发送/接收数据
关闭套接字
'''

#coding=utf-8

from socket import *

#1. 创建套接字
udpSocket = socket(AF_INET, SOCK_DGRAM)

#2. 准备接收方的地址（服务端）
sendAddr = ('192.168.1.103', 8080)

#3. 从键盘获取数据
sendData = raw_input("请输入要发送的数据:")

#4. 发送数据到指定的电脑上
udpSocket.sendto(sendData, sendAddr)

#5. 等待接收对方发送的数据
recvData = udpSocket.recvfrom(1024) # 1024 表示本次接收的最大字节数

#6. 显示对方发送的数据
print(recvData)

#7. 关闭套接字
udpSocket.close()
```

#### 服务端

```python
#coding=utf-8

from socket import *

#1. 创建套接字
udpSocket = socket(AF_INET, SOCK_DGRAM)

#2. 绑定本地的相关信息，如果一个网络程序不绑定，则系统会随机分配
bindAddr = ('', 7788) # ip地址和端口号，ip一般不用写，表示本机的任何一个ip
udpSocket.bind(bindAddr)

#3. 等待接收对方发送的数据
recvData = udpSocket.recvfrom(1024) # 1024表示本次接收的最大字节数

#4. 显示接收到的数据
print recvData

#5. 关闭套接字
udpSocket.close()
```

#### echo 服务器

```python
#coding=utf-8

from socket import *

#1. 创建套接字
udpSocket = socket(AF_INET, SOCK_DGRAM)

#2. 绑定本地的相关信息
bindAddr = ('', 7788) # ip地址和端口号，ip一般不用写，表示本机的任何一个ip
udpSocket.bind(bindAddr)

num = 1
while True:

    #3. 等待接收对方发送的数据
    recvData = udpSocket.recvfrom(1024) # 1024表示本次接收的最大字节数

    #4. 将接收到的数据再发送给对方
    udpSocket.sendto(recvData[0], recvData[1])

    #5. 统计信息
    print('已经将接收到的第%d个数据返回给对方,内容为:%s'%(num,recvData[0]))
    num+=1


#5. 关闭套接字
udpSocket.close()
```

#### 聊天室

```python
#coding=utf-8

from socket import *
from time import ctime

#1. 创建套接字
udpSocket = socket(AF_INET, SOCK_DGRAM)

#2. 绑定本地的相关信息
bindAddr = ('', 7788) # ip地址和端口号，ip一般不用写，表示本机的任何一个ip
udpSocket.bind(bindAddr)

while True:

    #3. 等待接收对方发送的数据
    recvData = udpSocket.recvfrom(1024) # 1024表示本次接收的最大字节数

    #4. 打印信息
    print('【%s】%s:%s'%(ctime(),recvData[1][0],recvData[0]))


#5. 关闭套接字
udpSocket.close()
```

#### 广播

```python
#coding=utf-8

import socket, sys

dest = ('<broadcast>', 7788)

# 创建udp套接字
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
# 对这个需要发送广播数据的套接字进行修改设置，否则不能发送广播数据
s.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST,1)

# 以广播的形式发送数据到本网络的所有电脑中
s.sendto("Hi", dest)

print "等待对方回复（按ctrl+c退出）"

while True:
    (buf, address) = s.recvfrom(2048)
    print "Received from %s: %s" % (address, buf)
```

### [TFTP](/2019/01/08/network-note-1/#tftp)

```python
#coding=utf-8

from socket import *
import struct
import sys

if len(sys.argv) != 2:
    print('-'*30)
    print("tips:")
    print("python xxxx.py 192.168.1.1")
    print('-'*30)
    exit()
else:
    ip = sys.argv[1]

# 创建udp套接字
udpSocket = socket(AF_INET, SOCK_DGRAM)

#构造下载请求数据
cmd_buf = struct.pack("!H8sb5sb",1,"test.jpg",0,"octet",0)

#发送下载文件请求数据到指定服务器
sendAddr = (ip, 69)
udpSocket.sendto(cmd_buf, sendAddr)

p_num = 0

recvFile = ''

while True:
    recvData,recvAddr = udpSocket.recvfrom(1024)

    recvDataLen = len(recvData)

    # print recvAddr # for test

    # print len(recvData) # for test

    cmdTuple = struct.unpack("!HH", recvData[:4])

    # print cmdTuple # for test

    cmd = cmdTuple[0]
    currentPackNum = cmdTuple[1]        

    if cmd == 3: #是否为数据包

        # 如果是第一次接收到数据，那么就创建文件
        if currentPackNum == 1:
            recvFile = open("test.jpg", "a")

        # 包编号是否和上次相等
        if p_num+1 == currentPackNum:
            recvFile.write(recvData[4:]);
            p_num +=1
            print '(%d)次接收到的数据'%(p_num)

            ackBuf = struct.pack("!HH",4,p_num)

            udpSocket.sendto(ackBuf, recvAddr)
        # 如果收到的数据小于516则认为出错
        if recvDataLen<516:
            recvFile.close()
            print '已经成功下载！！！'
            break

    elif cmd == 5: #是否为错误应答
        print "error num:%d"%currentPackNum
        break

udpSocket.close()
```

### TCP

#### 服务器
  1. socket创建一个套接字
  2. bind绑定ip和port
  3. listen使套接字变为可以被动链接
  4. accept等待客户端的链接
  5. recv/send接收发送数据

```python
#coding=utf-8
from socket import *

# 创建socket
tcpSerSocket = socket(AF_INET, SOCK_STREAM)

# 绑定本地信息
address = ('', 7788)
tcpSerSocket.bind(address)

# 使用socket创建的套接字默认的属性是主动的，使用listen将其变为被动的，这样就可以接收别人的链接了
tcpSerSocket.listen(5)

# 如果有新的客户端来链接服务器，那么就产生一个新的套接字专门为这个客户端服务器
# newSocket用来为这个客户端服务
# tcpSerSocket就可以省下来专门等待其他新客户端的链接
newSocket, clientAddr = tcpSerSocket.accept()

# 接收对方发送过来的数据，最大接收1024个字节
recvData = newSocket.recv(1024)
print '接收到的数据为:',recvData

# 发送一些数据到客户端
newSocket.send("thank you !")

# 关闭为这个客户端服务的套接字，只要关闭了，就意味着为不能再为这个客户端服务了，如果还需要服务，只能再次重新连接
newSocket.close()

# 关闭监听套接字，只要这个套接字关闭了，就意味着整个程序不能再接收任何新的客户端的连接
tcpSerSocket.close()
```

#### 客户端

```python
#coding=utf-8
from socket import *

# 创建socket
tcpClientSocket = socket(AF_INET, SOCK_STREAM)

# 链接服务器
serAddr = ('192.168.1.102', 7788)
tcpClientSocket.connect(serAddr)

# 提示用户输入数据
sendData = raw_input("请输入要发送的数据：")

tcpClientSocket.send(sendData)

# 接收对方发送过来的数据，最大接收1024个字节
recvData = tcpClientSocket.recv(1024)
print '接收到的数据为:',recvData

# 关闭套接字
tcpClientSocket.close()
```

#### 模拟 QQ 聊天

##### 客户端

```python
#coding=utf-8
from socket import *

# 创建socket
tcpClientSocket = socket(AF_INET, SOCK_STREAM)

# 链接服务器
serAddr = ('192.168.1.102', 7788)
tcpClientSocket.connect(serAddr)

while True:

    # 提示用户输入数据
    sendData = raw_input("send：")

    if len(sendData)>0:
        tcpClientSocket.send(sendData)
    else:
        break

    # 接收对方发送过来的数据，最大接收1024个字节
    recvData = tcpClientSocket.recv(1024)
    print 'recv:',recvData

# 关闭套接字
tcpClientSocket.close()
```

##### 服务端

```python
#coding=utf-8
from socket import *

# 创建socket
tcpSerSocket = socket(AF_INET, SOCK_STREAM)

# 绑定本地信息
address = ('', 7788)
tcpSerSocket.bind(address)

# 使用socket创建的套接字默认的属性是主动的，使用listen将其变为被动的，这样就可以接收别人的链接了
tcpSerSocket.listen(5)

while True:

    # 如果有新的客户端来链接服务器，那么就产生一个信心的套接字专门为这个客户端服务器
    # newSocket用来为这个客户端服务
    # tcpSerSocket就可以省下来专门等待其他新客户端的链接
    newSocket, clientAddr = tcpSerSocket.accept()

    while True:

        # 接收对方发送过来的数据，最大接收1024个字节
        recvData = newSocket.recv(1024)

        # 如果接收的数据的长度为0，则意味着客户端关闭了链接
        if len(recvData)>0:
            print 'recv:',recvData
        else:
            break

        # 发送一些数据到客户端
        sendData = raw_input("send:")
        newSocket.send(sendData)

    # 关闭为这个客户端服务的套接字，只要关闭了，就意味着为不能再为这个客户端服务了，如果还需要服务，只能再次重新连接
    newSocket.close()

# 关闭监听套接字，只要这个套接字关闭了，就意味着整个程序不能再接收任何新的客户端的连接
tcpSerSocket.close()
```

### 相关链接
[网络笔记 1](/2019/01/08/network-note-1/)

### 编辑记录

创建：01-08-2019 22:55 周二<br />
编辑：01-09-2019 22:00 周三<br />





























