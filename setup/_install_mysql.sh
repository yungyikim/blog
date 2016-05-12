#!/bin/sh

PROJECT_DIR=$HOME/blog

wget http://dev.mysql.com/get/mysql-apt-config_0.3.5-1ubuntu14.04_all.deb
sudo dpkg -i mysql-apt-config_0.3.5-1ubuntu14.04_all.deb
sudo apt-get update
sudo debconf-set-selections <<< 'mysql-server-5.7 mysql-community-server/root_password password dkssudgktpdy'
sudo debconf-set-selections <<< 'mysql-server-5.7 mysql-community-server/root_password_again password dkssudgktpdy'
sudo apt-get install -y mysql-server-5.7

# mysql-server-5.7을 수동으로 설치한다.
#sudo debconf-set-selections <<< 'mysql-server-5.5 mysql-server/root_password password dkssudgktpdy'
#sudo debconf-set-selections <<< 'mysql-server-5.5 mysql-server/root_password_again password dkssudgktpdy'
#sudo apt-get install -y mysql-server

sudo cp -r $PROJECT_DIR/setup/etc/mysql/ /etc/
sudo service mysql restart

# set db
mysql -u"root" -p"dkssudgktpdy" mysql -e "create user admin;"
mysql -u"root" -p"dkssudgktpdy" mysql -e "create user admin@localhost identified by 'dkssudgktpdy';"
mysql -u"root" -p"dkssudgktpdy" mysql -e "create user 'admin'@'%' identified by 'dkssudgktpdy';"
mysql -u"root" -p"dkssudgktpdy" mysql -e "create database webapp;"
mysql -u"root" -p"dkssudgktpdy" mysql -e "grant all privileges on webapp.* to admin@localhost;"
mysql -u"root" -p"dkssudgktpdy" mysql -e "grant all privileges on webapp.* to admin@'%';"
mysql -u"root" -p"dkssudgktpdy" mysql -e "grant all on *.* to 'admin'@'%' identified by 'dkssudgktpdy' with grant option;"
mysql -u"root" -p"dkssudgktpdy" mysql -e "flush privileges;"
