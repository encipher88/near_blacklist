#!/bin/bash
for line in `cat STEP1.txt`
do
 ip=$line

 sed -i -e "s/:24567//" $HOME/STEP1.txt
   echo $ip
    ping $ip -c 3 -n -q ${HOST} > /dev/null
    	if [ $? -ne "0" ]; then echo "ne dostupen"
     else
  echo $ip  >> "/root/STEP2.txt"
   fi
done 





	