FROM  node:7.7


ENV WK /srv/orange
#创建工具目录
RUN mkdir -p $WK
#设置工具目录
WORKDIR $WK

ADD package.json $WK
