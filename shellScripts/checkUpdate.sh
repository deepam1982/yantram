#!/bin/bash

DIR0=/home/admin/inoho
DIR1=$DIR0/homeController
DIR2=$DIR0/gitScripts
DIR3=$DIR2/shellScripts/upgradeScripts
REPO=https://github.com/deepam1982/yantram.git
BRANCH=`git --work-tree=$DIR1 --git-dir=$DIR1/.git rev-parse --abbrev-ref HEAD`

echo "checking updates from branch $BRANCH"
echo `date`

currentRev=`git --work-tree=$DIR1 --git-dir=$DIR1/.git rev-parse origin/$BRANCH`
echo "$currentRev"
if git --work-tree=$DIR1 --git-dir=$DIR1/.git ls-remote $REPO $BRANCH | grep $currentRev ; then
	msg=`git --work-tree=$DIR1 --git-dir=$DIR1/.git log --oneline -n 1` 
	echo "No updates, $msg"
	exit 0
else 
	echo "updates available"
fi

