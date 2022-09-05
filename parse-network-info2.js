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



 
  const bids = Object.keys(idset);
 
  for (var j=0; j < bids.length; j++) {
    const id = bids[j];
    if (!idset[id].pool) {
     
      blacked.push(`"${idset[id].addr}"`);
    }
  }

  console.log(blacked.join(","));
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

