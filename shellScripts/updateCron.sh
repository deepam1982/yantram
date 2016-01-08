#!/bin/bash

DIR0=/home/admin/inoho
DIR1=$DIR0/homeController
DIR2=$DIR0/gitScripts
DIR3=$DIR2/shellScripts/upgradeScripts
REPO=https://github.com/deepam1982/yantram.git
BRANCH=`git --work-tree=$DIR1 --git-dir=$DIR1/.git rev-parse --abbrev-ref HEAD`

echo "trying to upgrade from branch $BRANCH"
echo `date`

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
arr1=( $(for el in $DIR3/*.sh; do echo "$el"; done | sort))
for filename in "${arr1[@]}" # it will traverse files in assending order by name.
	do 
		tStmp=`basename ${filename} .sh`
		tStmp=`date --date=$tStmp +%s`
		if [ "$maxTime" -lt "$tStmp" ] ; then 
#			maxTime=$tStmp	#run all upgrade files having greater date in assending order.
			upgradeFile=${filename}
			sudo bash $upgradeFile	
		fi		
	done
if [ -n "$upgradeFile" ] ; then 
#        sudo bash $upgradeFile
        echo "hardupgrade done, starting softupgrade"
else
	echo "hardupgrade file not found, starting softupgrade"
fi

#step 3 soft update
git --work-tree=$DIR1 --git-dir=$DIR1/.git fetch origin
git --work-tree=$DIR1 --git-dir=$DIR1/.git reset --hard origin/$BRANCH

echo "softupgrade done, updating revId"
#step 4 update revId
currentRev=`git --work-tree=$DIR1 --git-dir=$DIR1/.git rev-parse origin/$BRANCH`
revId=`echo $currentRev | cut -c1-7`

jsonFile=$DIR0/configs/systemConfig.json
jsonFile_bkp=$DIR0/configs/_systemConfig_bkp_bkp.json
touch $jsonFile
cp $jsonFile $jsonFile_bkp
node > ${jsonFile} <<EOF
try{var data = require('${jsonFile_bkp}');}
catch(err){data={};}
data.revId='${revId}';
console.log(JSON.stringify(data, null, 4));
EOF
rm $jsonFile_bkp

echo "revId updated, restarting home controller"
#step 5 restart homeController

sudo at -M now + 1 minute <<< 'sudo service inoho start'
sudo /etc/init.d/inoho stop

echo "upgrade complete"