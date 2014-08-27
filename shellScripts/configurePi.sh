sudo apt-get update
echo "------------------ os update done ----------------";

grep -q net.ipv4.icmp_echo_ignore_broadcasts=0 /etc/sysctl.conf
if [ $? -eq 1 ]; then
echo net.ipv4.icmp_echo_ignore_broadcasts=0 | sudo tee -a /etc/sysctl.conf
fi

echo "------------------ enabled responce to broadcast ping  ----------------";

sudo perl -pi -e 's/raspberrypi/inoho/g' /etc/hostname
sudo perl -pi -e 's/raspberrypi/inoho/g' /etc/hosts
sudo hostname inoho

echo "------------------ hostname changed to inoho ----------------";

sudo cp /usr/share/zoneinfo/Asia/Kolkata /etc/localtime

echo "------------------ localtime set to Kolkata ----------------";

#sudo sed -i "\|T0:23:respawn:/sbin/getty -L ttyAMA0 115200 vt100|d" /etc/inittab
#echo  \#T0:23:respawn:/sbin/getty -L ttyAMA0 115200 vt100 | sudo tee -a /etc/inittab

#cp /boot/cmdline.txt /boot/cmdline_bkp.txt
#echo "dwc_otg.lpm_enable=0 console=tty1 root=/dev/mmcblk0p2 rootfstype=ext4 elevator=deadline rootwait" | sudo tee -a /boot/cmdline.txt
#sudo sed -i "\|dwc_otg.lpm_enable=0 console=ttyAMA0,115200 kgdboc=ttyAMA0,115200 console=tty1 root=/dev/mmcblk0p2 rootfstype=ext4 elevator=deadline rootwait|d" /boot/cmdline.txt
#sudo sed -i "\|dwc_otg.lpm_enable=0 console=ttyAMA0,115200 console=tty1 root=/dev/mmcblk0p2 rootfstype=ext4 elevator=deadline rootwait|d" /boot/cmdline.txt

#echo "------------------ disabled getty ----------------";

#sudo useradd -m admin -G sudo
#sudo passwd admin

#sudo passwd -l pi

#echo "------------------ new admin account created ----------------";
