#!/bin/sh

# install django + uwsgi

PROJECT_DIR=$HOME/blog

sudo apt-get install -y git python-pip python python-dev libmysqlclient-dev  libjpeg-dev libpng-dev Cython libxml2-dev libxslt1-dev zlib1g-dev
sudo pip install django uwsgi pillow boto mysql-python djangorestframework drf-extensions django-cors-headers django-rest-swagger python-logstash django-haystack django-pagination lxml requests BeautifulSoup elasticsearch newrelic django-grappelli python-social-auth markdown2
sudo apt-get remove -y python-requests

sudo cp -r $PROJECT_DIR/setup/etc/init/uwsgi.conf /etc/init/
sudo cp -r $PROJECT_DIR/setup/etc/uwsgi/ /etc/uwsgi/

sudo service uwsgi restart
