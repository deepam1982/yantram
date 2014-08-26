#!/bin/bash

DIR0=/home/admin/inoho
DIR1=$DIR0/homeController
DIR2=$DIR0/gitScripts
DIR3=$DIR2/shellScripts/upgradeScripts
REPO=https://github.com/deepam1982/yantram.git
BRANCH=dev

echo date

# step 1 compare current revision number with latest revision number at repo

currentRev=`git --work-tree=$DIR1 --git-dir=$DIR1/.git rev-parse origin/$BRANCH`
echo "$currentRev"
if git --work-tree=$DIR1 --git-dir=$DIR1/.git ls-remote $REPO $BRANCH | grep $currentRev ; then
	echo "nothing to upgrade"
	exit 0
fi

# step 2 check for hard-upgrade scripts

currentEpoch=`git --work-tree=$DIR1 --git-dir=$DIR1/.git show -s --format=%ct $currentRev`
git --work-tree=$DIR2 --git-dir=$DIR2/.git fetch origin
git --work-tree=$DIR2 --git-dir=$DIR2/.git reset --hard origin/$BRANCH
maxTime=$currentEpoch
for filename in $DIR3/*.sh 
	do 
		tStmp=`basename ${filename} .sh`
		tStmp=`date --date=$tStmp +%s`
		if [ "$maxTime" -lt "$tStmp" ] ; then 
			maxTime=$tStmp
			upgradeFile=${filename}
		fi		
	done
if [ -n "$upgradeFile" ] ; then 
        sudo sh $upgradeFile
        exit 0
fi
echo "hardupgrade file not found, starting softupgrade"

#step 3 soft update
git --work-tree=$DIR1 --git-dir=$DIR1/.git fetch origin
git --work-tree=$DIR1 --git-dir=$DIR1/.git reset --hard origin/$BRANCH

#step 4 restart homeController

sudo /etc/init.d/inoho stop
sudo /etc/init.d/inoho start

echo "upgrade complete"