// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  serverUrl: 'http://localhost:3000', // 'http://186.81.169.18:3000',
  socketUrl: 'http://localhost:4000', // 'http://186.81.169.18:4000',

  // Constantes de Blockchain
  votar: 1,
  obtenerResultados: 2,
  syncBlockchain: 3,
  ofrecerBloque: 4,
  aprobarBloque: 5,
  inicializarVotacion: 6,
  obtenerPk: 7,
  responderPk: 8,
  solicitarBCH: 9,
  syncCompleteBlockchain: 10,
  calcularResultados: 11,

  // tipos de votacion
  ranking: 1,
  popular: 2,
  clasificacion: 3,


};

export const envTipoTx = {
    // tipos de transaccion
    inicioVotacion: 0,
    voto: 1,
    resultado: 2,
};

export const envEstatus = {
  activo: 'Activo',
  inactivo: 'Inactivo'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
