#!/bin/sh

TEMPDIR=~/tmp
PROJECT_DIR=$HOME/blog
mkdir $TEMPDIR

sudo apt-get install -y gcc make libpcre3 libpcre3-dev zlib1g zlib1g-dev libssl-dev

wget -P $TEMPDIR/ http://nginx.org/download/nginx-1.10.0.tar.gz
tar -zxvf $TEMPDIR/nginx-*.tar.gz -C $TEMPDIR/
cd $TEMPDIR/nginx-* && ./configure && make && sudo make install

sudo cp $PROJECT_DIR/setup/etc/init.d/nginx /etc/init.d/
sudo cp -r $PROJECT_DIR/setup/etc/nginx/ /etc/

sudo chmod +x /etc/init.d/nginx
sudo update-rc.d -f nginx defaults
sudo mkdir /var/log/nginx
sudo mkdir /etc/nginx/sites-enabled
sudo ln -s $PROJECT_DIR/setup/etc/nginx/sites-avaliable/blog /etc/nginx/sites-enabled/blog

sudo service nginx restart
