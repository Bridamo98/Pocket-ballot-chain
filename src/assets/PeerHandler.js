class Mensaje {
    tipoPeticion;
    contenido;
    constructor(tipoPeticion, contenido){
      this.tipoPeticion = tipoPeticion;
      this.contenido = contenido;
    }
}

var voto;
var peer;
var connections = {};
var peer_id;
var mensajesServicio;
var votarServicio;
var nombreUsuario;
var usuarioPeer;

var inicializar = function() {
    peer = new Peer({
      host: location.hostname,
      port: (location.protocol === 'https:' ? 443 : 5000),
      path: '/peerjs'
    });
    peer.on('open', function () {
        peer_id = peer.id;
        console.log('peer open: ' + peer.id);

        let usuarioValidador = {
            peerId: peer.id,
            nombre: usuarioPeer
        };

        votarServicio.setUsuario(usuarioValidador);

    });

    peer.on('connection', function (connection) {
        console.log(connection.metadata.p_msj);
        console.log('conexion establecida');
        mensajesServicio.redirigirMensaje(connection.metadata.p_msj, connection.peer);
        connection.close();
    });

    peer.on('error', function (err) {
        console.log('Error: ' + err);
        console.log(err);
    })
}


var setVoto = function(pVoto){
    this.voto = pVoto;
    mensajesServicio.setVoto(pVoto);
}

var enviarMensaje = function(msj, otro_peer_id) {

    if (otro_peer_id) {
        var options = {
            metadata: {
                p_msj: msj
            },
            serialization: "json"
        };
        console.log("En PeerHandler se envía a:", otro_peer_id);
        peer.connect(otro_peer_id, options);
    } else {
        console.log('Error: Ingresa un peerId');
        return false;
    }
}
