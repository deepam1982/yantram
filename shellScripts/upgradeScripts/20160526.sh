#!/bin/bash

cat <<\EOF > /etc/init.d/checkIpAlias.sh &&
#!/bin/sh
DIR0=/home/admin
DIR1=$DIR0/inoho/homeController

sudo bash $DIR1/shellScripts/checkIpAlias.sh > $DIR0/inoho/logs/checkIpAlias.log
EOF

echo "checkIpAlias updated."