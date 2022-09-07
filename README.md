# near_blacklist

My research concerns the debug page. I will tell you how to detect nodes that do not sign blocks or chunks. Within the framework of the shardnet, I use this information to add nodes to the Blacklist, since they give an extra load on the communication channel and do not provide any information about the network, thereby reducing the number of blocks or chunks I process. As part of staking research, this information can be used to detect a validator that partially skips chunks or blocks - this information can be accumulated and statistics on the quality of the validator's work over time can be displayed. Thus, let the user choose and reward the best validators, as well as save and increase their stake as much as possible

parse-network-info-orig.js

```
function parseIt(instream) {

  const data = JSON.parse(instream);
  const active_peers = data.result.active_peers;
  const known_producers = data.result.known_producers;

  let idset = {}, blacked = [];

  //console.log("Hello " + data);
  for (var j=0; j < active_peers.length; j++) {
    const peer = active_peers[j];
    // console.log(peer.id, "|", peer.addr);
    idset[peer.id] = { addr: peer.addr, id: peer.id, pool: '' };
  }

  for (var j=0; j < known_producers.length; j++) {
    const peer = known_producers[j];
    // console.log(peer.peer_id, "|", peer.addr, peer.account_id);
    if (idset[peer.peer_id]) {
     idset[peer.peer_id].pool  = peer.account_id;
    }
  }

  const ids = Object.keys(idset);
  console.log("\nAll peers");
  console.log("| Key | IPAddr | Pool |");
  for (var j=0; j < ids.length; j++) {
    const id = ids[j];
    console.log("|", id, "|", idset[id].addr, "|", idset[id].pool);
  }

  const prods = Object.keys(idset);
  console.log("\nProducers");
  console.log("| Key | IPAddr | Pool |");
  for (var j=0; j < prods.length; j++) {
    const id = prods[j];
    if (idset[id].pool) {
      console.log("|", id, "|", idset[id].addr, "|", idset[id].pool);
    }
  }
	
  const bids = Object.keys(idset);
  console.log("\nNon producers");
  console.log("| Key | IPAddr | Pool |");
  for (var j=0; j < bids.length; j++) {
    const id = bids[j];
    if (!idset[id].pool) {
      console.log("|", id, "|", idset[id].addr, "|", idset[id].pool);
      blacked.push(`"${idset[id].id}@${idset[id].addr}"`);
    }
  }

  console.log("\nBlacklist?s=", blacked.join(","));
}

function getInput() {
  return new Promise(function (resolve, reject) {
    const stdin = process.stdin;
    let data = '';

    stdin.setEncoding('utf8');
    stdin.on('data', function (chunk) {
      data += chunk;
    });

    stdin.on('end', function () {
      resolve(data);
    });

    stdin.on('error', reject);
  });
}

getInput().then(parseIt).catch(console.error);
```

1 clone repo
```
git clone https://github.com/encipher88/near_blacklist.git
```

2 use this command
```
curl -s -d '{"jsonrpc": "2.0", "method": "network_info", "id": "dontcare", "params": [null]}' -H 'Content-Type: application/json' 127.0.0.1:3030 | node parse-network-info-orig.js
```

3 get response


ok correct return


4. ok everything works - then run 
```
bash script1.sh
```
```
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
```

Script parsing all ip who produced chunk and block and writing in file step1.txt

5. We have to make the records in STEP1 look like this 
We include the script several times so that all possible IPs are entered into the database.
Then we have to remove the duplicates


6. Run script2 - This will filter out nodes that are not responding to the request, since when you try to request a curl from a non-responding node, the script freezes

```
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
```

7. Run Script3  All available nodes are polled and all nodes that do not participate in the network consensus are entered into the black file

```
#!/bin/bash
for line in `cat STEP2.txt`
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
```

8 Then we have to remove the duplicates and add to config file with right syntax
    Restart the node 

9. 
As a result, we got nodes that do not meet the requirements of the network.
Or
Incompetent validators
Or
improved the uptime of their node
and also reduced traffic consumption and sending empty requests to bad nodes.







