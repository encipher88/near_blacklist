#!/bin/bash
for line in `cat 22.txt`
do
 ip=$line
   echo $ip
   ping $ip -c 2 -n -q ${HOST} > /dev/null
   if [ $? -ne "0" ]; then echo "ne dostupen"
     else
     json=$(curl -s -d '{"jsonrpc": "2.0", "method": "network_info", "id": "dontcare", "params": [null]}' -H 'Content-Type: application/json' $ip:3030 | node parse-network-info2.js )
    if [ -z "$json" ]; then echo "net zapisi"
   
   else 
    curl -s -d '{"jsonrpc": "2.0", "method": "network_info", "id": "dontcare", "params": [null]}' -H 'Content-Type: application/json' $ip:3030 | node parse-network-info2.js  >> "/root/black.txt" 
   fi
   fi
done 





	