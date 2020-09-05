
var peer;
var conn;
var peer_id;
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
        conn = connection;
        peer_id = connection.peer;
        console.log('conexion establecida');
        conn.on('data', function (data) {
            // Will print 'this is a test'
            mensajesServicio.redirigirMensaje(data);
            console.log(data);
        });
    });

    peer.on('error', function (err) {
        alert('Error: ' + err);
        console.log(err);
    })
}

var establecerConexion = function(otro_peer_id) {

    if (otro_peer_id) {
        peer_id = otro_peer_id;
        conn = peer.connect(peer_id);
        conn.on('open', function () {
            console.log('Conexion establecida');
        });
        conn.on('data', function (data) {
            console.log(data);
            mensajesServicio.redirigirMensaje(data);
        });
    } else {
        alert('Ingresa un peerId');
        return false;
    }
}

var enviarMensaje = function(msj) {
    console.log('Enviando mensaje ' + msj);
    conn.send(msj);
}
