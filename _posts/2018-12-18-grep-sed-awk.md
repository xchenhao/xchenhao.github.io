---
layout: post
title:  "Linux 三剑客：grep/sed/awk"
categories: Linux
tags: grep sed awk linux
author: xchenhao
---

* content
{:toc}



### grep
- 格式：grep <参数> <匹配模式> <文件>
- 参数：
    + -v
    + -n
    + -i
    + -c
    + -E
    + --color=auto
    + -w
    + -o
    + -A
    + -B
    + -C
- 试例：

```bash
grep -v "oldboy" test1.txt
grep -n "oldboy" test1.txt
grep -n "." test1.txt # 类型于 cat -n test1.txt
grep -i "alex" test2.txt
grep -Ei "oldboy|alex" test2.txt
grep -c "oldboy" test2.txt # 统计数量
grep -o "oldboy" test2.txt # 只输出匹配的内容
grep -w oldboy /etc/passwd # 只匹配单词
grep -Ev "^$|#" nginx.conf
```

---
### sed
- 格式：sed <参数> <内置命令> <文件>
- 参数：
    + -n
    + -i
- 内置命令：
    + a
    + d
    + i
    + p
    + s/regexp/replacement/
- 试例：

```bash
sed '2a 106,dandan,CSO' persons.txt
sed '2i 106,dandan,CSO' persons.txt
sed '2a 106,dandan,CSO\n107,bingbing,CCO' person.txt
sed '2d' person.txt
sed '2,5d' person.txt
sed 's#zhangyao#dandan#g' person.txt
sed '2p' person.txt
sed -n '2p' person.txt
sed -n '2,3p' person.txt
sed -i '13i Port 52113\nPermitRootLogin no\nPermitEmptyPasswords no\nUseDNS no\nGSSAPIAuthentication no' /etc/ssh/sshd_config
sed -n '13,17p' /etc/ssh/sshd_config
sed 'N;s#\n#=#g'
```

---
### awk
- 格式：awk <参数> <模式 {动作}> 文件
- 参数：
    + -F
    + -v
- 试例：

```bash
awk -F "GET|HTTP" 'print $2' access.log
awk '$6~/Failed/{print $11}' /var/log/secure
awk 'NR==20,NR==30' filename
awk '{sum+=$0}END{print sum}' ett.txt
awk '{array[$1]++}END{for(key in array)print key,array[key]}' access.log

awk 'NR==5' oldboy.txt
awk 'NR==2,NR==6' oldboy.txt
awk '{print NR,$0}' oldboy.txt # 类似 cat -n oldboy.txt
awk 'NR==2,NR==6 {print NR,$0}' oldboy.txt
awk -F ":" '{print $1,$3,$NF}' oldboy.txt
awk '{gsub("/sbin/nologin", "/bin/bash", $0);print $0}' oldboy.txt #将 /sbin/nologin 替换为 /bin/bash
ifconfig eth0|awk -F "(addr:)|( Bcase:)" 'NR==2{print $2}' # 取 IP地址
ifconfig eth0|awk -F "[ :]+" 'NR==2{print $4}'
awk -F '/' '{print $3}' oldgirl.txt|sort|uniq -c
awk -F '/' '{hotel[$3]++;print $3,hotel[$3]}' oldgirl.txt
awk -F '/' '{array[$3]++}END{
  print "www.etiantian.org", array["www.etiantian.org"]
  print "post.etiantian.org", array["post.etiantian.org"]
  print "mp3.etiantian.org", array["mp3.etiantian.org"]
}' oldgirl.txt
awk -F '/' '{hotel[$3]++}END{for(domain in hotel)print domain,hotel[domain]}' oldgirl.txt
```

---
最后编辑于 12-16-2018 21:00
