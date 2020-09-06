var peer;
var connections = {};
//var peer_id;
var mensajesServicio;
var inicializar = function() {
    peer = new Peer({
        host: location.hostname,
        port: (location.protocol === 'https:' ? 443 : 9000),
        path: '/peerjs'
    });
    //mostrar el peer_id
    peer.on('open', function () {
        //perr_id.innerHTML = peer.id;
        console.log('peer open: ' + peer.id);
    });

    peer.on('connection', function (connection) {
        connections[connection.peer] = connection;
        //peer_id = connection.peer;
        console.log('conexion establecida');
        connections[connection.peer].on('data', function (data) {
            //desencriptar
            console.log(data + " Enviado de: "+ connection.peer);
            mensajesServicio.redirigirMensaje(data, connections[connection.peer].peer);
        });
    });

    peer.on('error', function (err) {
        alert('Error: ' + err);
        console.log(err);
    })
}

var enviar = function(msj, otro_peer_id) {
    console.log('Enviando mensaje ' + msj);
    //encriptar...
    connections[otro_peer_id].send(msj);
}

var enviarMensaje = function(msj, otro_peer_id) {//si no existe conexion con ese peer_id crear la conexion y enviar el msj

    if (otro_peer_id) {
        //peer_id = otro_peer_id;
        connections[otro_peer_id] = peer.connect(otro_peer_id);
        connections[otro_peer_id].on('open', function () {
            console.log('Conexion establecida');
            enviar(msj, otro_peer_id);
        });
        connections[otro_peer_id].on('data', function (data) {
            //desencriptar
            console.log(data + " Enviado de: "+ otro_peer_id);
            mensajesServicio.redirigirMensaje(data, connections[otro_peer_id].peer);
        });
    } else {
        alert('Ingresa un peerId');
        return false;
    }
}
