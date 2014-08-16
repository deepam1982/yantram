sudo apt-get update

mkdir /home/in/inoho
mkdir /home/in/inoho/homeController
git clone https://github.com/deepam1982/yantram.git /home/in/inoho/homeController
mv /home/in/inoho/homeController/package.json /home/in/inoho/package.json
mkdir /home/in/inoho/configs

sudo apt-get install nodejs npm

npm install /home/in/inoho/package.json

grep -q net.ipv4.icmp_echo_ignore_broadcasts=0 /etc/sysctl.conf
if [ $? -eq 1 ]; then
echo net.ipv4.icmp_echo_ignore_broadcasts=0 | sudo tee -a /etc/sysctl.conf
fi

sudo perl -pi -e 's/raspberrypi/inoho/g' /etc/hostname
sudo perl -pi -e 's/raspberrypi/inoho/g' /etc/hosts

sudo cp /usr/share/zoneinfo/Asia/Kolkata /etc/localtime

sudo sed -i "\|T0:23:respawn:/sbin/getty -L ttyAMA0 115200 vt100|d" sudo /etc/inittab
sudo sed -i "\|dwc_otg.lpm_enable=0 console=ttyAMA0,115200 kgdboc=ttyAMA0,115200 console=tty1 root=/dev/mmcblk0p2 rootfstype=ext4 elevator=deadline rootwait|d" /boot/cmdline.txt
echo dwc_otg.lpm_enable=0 console=tty1 root=/dev/mmcblk0p2 rootfstype=ext4 elevator=deadline rootwait | sudo tee -a /boot/cmdline.txt

sudo cp /home/in/inoho/homeController/shellScripts/inoho.sh /etc/init.d/inoho
sudo chmod 755 /etc/init.d/inoho
sudo update-rc.d /etc/init.d/inoho defaults

sudo chmod 755 /home/in/inoho/homeController/shellScripts/checkIpAlias.sh
sudo update-rc.d /home/in/inoho/homeController/shellScripts/checkIpAlias.sh defaults

sudo chmod 755 /home/in/inoho/shellScripts/homeController/checkIpAlias.sh
line="* * * * * sudo /home/in/inoho/shellScripts/homeController/checkIpAlias.sh > /home/in/inoho/logs/checkIpAlias.log"
(crontab -u pi -l; echo "$line" ) | crontab -u pi -

sudo chmod 755 /home/in/inoho/homeController/shellScripts/wifiCheck.sh
line="* * * * * sudo /home/in/inoho/homeController/shellScripts/wificheck.sh > /home/in/inoho/logs/wificheck.log"
(crontab -u pi -l; echo "$line" ) | crontab -u pi -

