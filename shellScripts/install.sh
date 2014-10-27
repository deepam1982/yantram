#!/bin/bash

DIR0=/home/admin/inoho
DIR1=$DIR0/homeController
DIR2=$DIR0/gitScripts
DIR3=$DIR0/gitScripts/shellScripts/upgradeScripts
REPO=https://github.com/deepam1982/yantram.git
BRANCH=dev

mkdir $DIR0
mkdir $DIR1
mkdir $DIR0/logs
mkdir $DIR0/configs

git clone -b $BRANCH $REPO $DIR1
cp $DIR1/package.json $DIR1/../package.json

git init $DIR2
git --work-tree=$DIR2 --git-dir=$DIR2/.git remote add -f origin $REPO
git --git-dir=$DIR2/.git config core.sparsecheckout true
echo "shellScripts" >> $DIR2/.git/info/sparse-checkout
git --work-tree=$DIR2 --git-dir=$DIR2/.git pull origin $BRANCH

echo "------------------ git clone inoho done ----------------";

wget http://nodejs.org/dist/v0.10.25/node-v0.10.25-linux-arm-pi.tar.gz
tar -xvzf node-v0.10.25-linux-arm-pi.tar.gz
mv -if node-v0.10.25-linux-arm-pi /opt/node
rm node-v0.10.25-linux-arm-pi.tar.gz

sudo ln -s /opt/node/bin/node /usr/bin/node
sudo ln -s /opt/node/bin/npm /usr/bin/npm

echo "------------------ nodejs and npm installation done ----------------";

npm install $DIR0/
mv -if node_modules/Inoho/node_modules/ inoho/node_modules
rm -r node_modules

echo "------------------ inoho node package installation done ----------------";


sudo cp $DIR1/shellScripts/inoho.sh /etc/init.d/inoho
sudo chmod 755 /etc/init.d/inoho
sudo update-rc.d inoho defaults

echo "------------------ added inoho.sh to startup scripts ----------------";

sudo cp $DIR1/shellScripts/syncSystemClock.sh /etc/init.d/syncSystemClock
sudo chmod 755 /etc/init.d/syncSystemClock

echo "------------------ added syncSystemClock.sh to init.d ----------------";

sudo cp $DIR1/shellScripts/checkIpAlias.sh /etc/init.d/checkIpAlias.sh
sudo chmod 755 /etc/init.d/checkIpAlias.sh
sudo update-rc.d checkIpAlias.sh defaults

sudo chmod 755 $DIR1/shellScripts/checkIpAlias.sh
line="* * * * * sudo bash $DIR1/shellScripts/checkIpAlias.sh > $DIR0/logs/checkIpAlias.log"
(crontab -u root -l; echo "$line" ) | crontab -u root -

echo "------------------ checkIpAlias added to cron ----------------";

sudo chmod 755 $DIR1/shellScripts/wifiCheck.sh
line="* * * * * sudo bash $DIR1/shellScripts/wifiCheck.sh > $DIR0/logs/wifiCheck.log"
(crontab -u root -l; echo "$line" ) | crontab -u root -

echo "------------------ checkWifi added to cron ----------------";

sudo chmod 755 $DIR1/shellScripts/updateCron.sh
line="0 0 * * * sudo bash $DIR1/shellScripts/updateCron.sh > $DIR0/logs/updateCron.log"
(crontab -u root -l; echo "$line" ) | crontab -u root -

echo "------------------ updateCron added to cron ----------------";
