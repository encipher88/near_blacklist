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

