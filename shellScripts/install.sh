
mkdir /home/admin/inoho
mkdir /home/admin/inoho/homeController
mkdir /home/admin/inoho/logs
mkdir /home/admin/inoho/configs

git clone -b dev https://github.com/deepam1982/yantram.git /home/admin/inoho/homeController
cp /home/admin/inoho/homeController/package.json /home/admin/inoho/

echo "------------------ git clone inoho done ----------------";

wget http://nodejs.org/dist/v0.10.25/node-v0.10.25-linux-arm-pi.tar.gz
tar -xvzf node-v0.10.25-linux-arm-pi.tar.gz
mv -if node-v0.10.25-linux-arm-pi /opt/node
rm node-v0.10.25-linux-arm-pi.tar.gz

sudo ln -s /opt/node/bin/node /usr/bin/node
sudo ln -s /opt/node/bin/npm /usr/bin/npm

echo "------------------ nodejs and npm installation done ----------------";

npm install /home/admin/inoho/
mv -if node_modules/Inoho/node_modules/ inoho/node_modules
rm -r node_modules

echo "------------------ inoho node package installation done ----------------";


sudo cp /home/admin/inoho/homeController/shellScripts/inoho.sh /etc/init.d/inoho
sudo chmod 755 /etc/init.d/inoho
sudo update-rc.d inoho defaults

echo "------------------ added inoho.sh to startup scripts ----------------";

sudo cp /home/admin/inoho/homeController/shellScripts/inoho.sh /etc/init.d/checkIpAlias.sh
sudo chmod 755 /etc/init.d/checkIpAlias.sh
sudo update-rc.d checkIpAlias.sh defaults

sudo chmod 755 /home/admin/inoho/homeController/shellScripts/checkIpAlias.sh
line="* * * * * sudo /home/admin/inoho/homeController/shellScripts/checkIpAlias.sh > /home/admin/inoho/logs/checkIpAlias.log"
(crontab -u pi -l; echo "$line" ) | crontab -u pi -

echo "------------------ checkIpAlias added to cron ----------------";

sudo chmod 755 /home/admin/inoho/homeController/shellScripts/wifiCheck.sh
line="* * * * * sudo /home/admin/inoho/homeController/shellScripts/wificheck.sh > /home/admin/inoho/logs/wificheck.log"
(crontab -u pi -l; echo "$line" ) | crontab -u pi -

echo "------------------ checkWifi added to cron ----------------";
