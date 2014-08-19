sudo apt-get update
echo "------------------ os update done ----------------";

mkdir /home/admin/inoho
mkdir /home/admin/inoho/homeController
mkdir /home/admin/inoho/logs
mkdir /home/admin/inoho/configs

git clone -b dev https://github.com/deepam1982/yantram.git /home/admin/inoho/homeController
cp /home/admin/inoho/homeController/package.json /home/admin/inoho/
mkdir /home/admin/inoho/configs
echo "------------------ git clone inoho done ----------------";

wget http://nodejs.org/dist/v0.10.25/node-v0.10.25-linux-arm-pi.tar.gz
tar -xvzf node-v0.10.25-linux-arm-pi.tar.gz
sudo mkdir /opt/node
sudo cp node-v0.10.25-linux-arm-pi/* /opt/node/
rm -r node-v0.10.25-linux-arm-pi
rm node-v0.10.25-linux-arm-pi.tar.gz

sudo ln -s /opt/node/bin/node /usr/bin/node
sudo ln -s /opt/node/bin/npm /usr/bin/npm

echo "------------------ nodejs and npm installation done ----------------";

npm install /home/admin/inoho/
mv -if node_module/Inoho/node_module inoho/node_module
rm -r node_module

echo "------------------ inoho node package installation done ----------------";

grep -q net.ipv4.icmp_echo_ignore_broadcasts=0 /etc/sysctl.conf
if [ $? -eq 1 ]; then
echo net.ipv4.icmp_echo_ignore_broadcasts=0 | sudo tee -a /etc/sysctl.conf
fi

echo "------------------ enabled responce to broadcast ping  ----------------";

sudo perl -pi -e 's/raspberrypi/inoho/g' /etc/hostname
sudo perl -pi -e 's/raspberrypi/inoho/g' /etc/hosts

echo "------------------ hostname changed to inoho ----------------";

sudo cp /usr/share/zoneinfo/Asia/Kolkata /etc/localtime

echo "------------------ localtime set to Kolkata ----------------";

sudo sed -i "\|T0:23:respawn:/sbin/getty -L ttyAMA0 115200 vt100|d" /etc/inittab
echo  \#T0:23:respawn:/sbin/getty -L ttyAMA0 115200 vt100 | sudo tee -a /etc/inittab

cp /boot/cmdline.txt /boot/cmdline_bkp.txt
sudo sed -i "\|dwc_otg.lpm_enable=0 console=ttyAMA0,115200 kgdboc=ttyAMA0,115200 console=tty1 root=/dev/mmcblk0p2 rootfstype=ext4 elevator=deadline rootwait|d" /boot/cmdline.txt
sudo sed -i "\|dwc_otg.lpm_enable=0 console=ttyAMA0,115200 console=tty1 root=/dev/mmcblk0p2 rootfstype=ext4 elevator=deadline rootwait|d" /boot/cmdline.txt
echo dwc_otg.lpm_enable=0 console=tty1 root=/dev/mmcblk0p2 rootfstype=ext4 elevator=deadline rootwait | sudo tee -a /boot/cmdline.txt

echo "------------------ disabled getty ----------------";

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
