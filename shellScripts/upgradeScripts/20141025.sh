#!/bin/bash

DIR0=/home/admin/inoho
DIR1=$DIR0/homeController
DIR2=$DIR0/gitScripts
DIR3=$DIR2/shellScripts/upgradeScripts

sudo cp $DIR2/shellScripts/inoho.sh /etc/init.d/inoho

echo "------------------ added inoho.sh to init.d ----------------";
