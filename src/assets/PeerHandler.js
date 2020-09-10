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
var inicializar = function() {
    peer = new Peer({
        host: location.hostname,
        port: (location.protocol === 'https:' ? 443 : 9000),
        path: '/peerjs'
    });
    //mostrar el peer_id
    peer.on('open', function () {
        peer_id = peer.id;
        console.log('peer open: ' + peer.id);
    });

    peer.on('connection', function (connection) {
        //connections[connection.peer] = connection;
        //peer_id = connection.peer;
        console.log(connection.metadata.p_msj);
        console.log('conexion establecida');
        mensajesServicio.redirigirMensaje(connection.metadata.p_msj, connection.peer);

        //connections[connection.peer].on('data', function (data) {
            //desencriptar
          //  console.log(data + " Enviado de: "+ connection.peer);
           // mensajesServicio.redirigirMensaje(data, connections[connection.peer].peer);
        //});

        connection.close();
    });

    peer.on('error', function (err) {
        alert('Error: ' + err);
        console.log(err);
    })
}


var setVoto = function(pVoto){
    this.voto = pVoto;
    mensajesServicio.setVoto(pVoto);
}

var enviarMensaje = function(msj, otro_peer_id) {//si no existe conexion con ese peer_id crear la conexion y enviar el msj

    if (otro_peer_id) {
        //peer_id = otro_peer_id;
        var options = {
            metadata: {
                p_msj: msj
            },
            serialization: "json"
        };
        peer.connect(otro_peer_id, options);
        //connections[otro_peer_id].on('open', function () {
        //    console.log('Conexion establecida');
        //    enviar(msj, otro_peer_id);
        //});
        //connections[otro_peer_id].on('data', function (data) {
            //desencriptar
            //console.log(data + " Enviado de: "+ otro_peer_id);

            //mensajesServicio.redirigirMensaje(mensaje, connections[otro_peer_id].peer);

       // });
    } else {
        alert('Ingresa un peerId');
        return false;
    }
}
