FROM  node:7.7


ENV WORKSPACE /srv/www
ENV VERSION 1.0.2
ENV NODE_ENV production

#创建工具目录
RUN mkdir -p $WORKSPACE
#设置工具目录
WORKDIR $WORKSPACE
#安装PM2
RUN npm install -g pm2
#安装程序
RUN wget https://github.com/bing6/short/archive/${VERSION}.tar.gz -qO - | tar -zxf - -C $WORKSPACE --strip=1
#安装依赖
RUN npm install 
#设置默认端口
EXPOSE 3000
#pm2 
CMD ["pm2", "start", "bin/run", "-i", "2", "--no-daemon", "--max-memory-restart=500M"]
#CMD ["npm", "start", "--prod"]

