class Mensaje {
    tipoPeticion;
    contenido;
    constructor(tipoPeticion, contenido){
      this.tipoPeticion = tipoPeticion;
      this.contenido = contenido;
    }
}

var voto;
var peer = null;
var connections = {};
var peer_id;
var mensajesServicio;
var votarServicio;
var nombreUsuario;
var usuarioPeer = null;
var peerID;

var inicializar = function() {
    desconectar();
    peer = new Peer({
      host: location.hostname,
      port: (location.protocol === 'https:' ? 5000 : 5000),
      path: '/peerjs'
    });
    peer.on('open', function () {
        peer_id = peer.id;
        console.log('peer open: ' + peer.id);

        let usuarioValidador = {
            peerId: peer.id,
            nombre: usuarioPeer
        };

        if (usuarioValidador.nombre !== null){
          votarServicio.setUsuario(usuarioValidador);
        }
    });

    peer.on('connection', function (connection) {
        console.log(connection.metadata.p_msj);
        console.log('conexion establecida');
        mensajesServicio.redirigirMensaje(connection.metadata.p_msj, connection.peer);
        peerID = connection.peer;
        connection.close();
    });

    peer.on('error', function (err) {
        console.log('Error: ' + err);
/*
        if(err.disconnect){
            console.log('se desconecto el peer');
        }
*/
        console.log(err);
    })

    peer.on('disconnected', function () {
      console.log('peer desconectado');
      //votarServicio.eliminarValidador(peerID);
      peer = null;
      usuarioPeer = null;
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

var desconectar = function() {
  if (peer != null){
    peer.disconnect();
  }
}
