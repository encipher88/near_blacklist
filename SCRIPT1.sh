#!/bin/bash
for line in `cat STEP1.txt`
do
 ip=$line

 sed -i -e "s/:24567//" $HOME/STEP1.txt
   echo $ip
    ping $ip -c 3 -n -q ${HOST} > /dev/null
    	if [ $? -ne "0" ]; then echo "ne dostupen"
     else
   curl -s -d '{"jsonrpc": "2.0", "method": "network_info", "id": "dontcare", "params": [null]}' -H 'Content-Type: application/json' "$ip:3030" | node parse-network-info.sh  >> "/root/STEP1.txt"
   fi
done 





	