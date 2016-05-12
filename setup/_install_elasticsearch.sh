#!/bin/sh

# install elasticsearch
sudo apt-get update
sudo apt-get -y upgrade
sudo add-apt-repository -y ppa:webupd8team/java
sudo apt-get update
sudo apt-get -y install oracle-java8-installer
wget https://download.elastic.co/elasticsearch/release/org/elasticsearch/distribution/deb/elasticsearch/2.3.1/elasticsearch-2.3.1.deb
sudo dpkg -i elasticsearch-2.3.1.deb
sudo update-rc.d elasticsearch defaults
# 설정
sudo service elasticserch restart

# install kibana
echo "deb http://packages.elastic.co/kibana/4.4/debian stable main" | sudo tee -a /etc/apt/sources.list.d/kibana-4.4.x.list
sudo apt-get update
sudo apt-get -y install kibana
sudo update-rc.d kibana defaults 96 9
sudo service kibana restart

# install logstash
echo 'deb http://packages.elastic.co/logstash/2.2/debian stable main' | sudo tee /etc/apt/sources.list.d/logstash-2.2.x.list
sudo apt-get update
sudo apt-get -y install logstash
sudo update-rc.d logstash defaults 96 9
# 설정
sudo service logstash restart
