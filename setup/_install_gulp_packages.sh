#!/bin/sh

PROJECT_DIR=$HOME/blog

curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install -y nodejs
sudo apt-get install -y ghostscript

cd $PROJECT_DIR
sudo npm install --no-bin-links gulp
sudo npm install --no-bin-links gulp --save-dev
#sudo npm install gulp-webserver merge-stream gulp-concat gulp-uglify gulp-minify-html gulp-watch gulp-sass gulp-livereload gulp-util
sudo npm install --no-bin-links gulp-webserver
sudo npm install --no-bin-links merge-stream
sudo npm install --no-bin-links gulp-concat
sudo npm install --no-bin-links gulp-uglify
sudo npm install --no-bin-links gulp-minify-html
sudo npm install --no-bin-links gulp-watch
sudo npm install --no-bin-links gulp-sass
sudo npm install --no-bin-links gulp-livereload
sudo npm install --no-bin-links gulp-util
sudo ln -s $PROJECT_DIR/node_modules/gulp/bin/gulp.js /usr/bin/gulp
