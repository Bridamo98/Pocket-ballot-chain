import { Injectable } from '@angular/core';
import rsa from 'js-crypto-rsa';
import * as nodeRSA from 'node-rsa';

@Injectable({
  providedIn: 'root'
})
export class CifradoService {


  key;
  signature;

  encryptPublicKey;
  encryptPrivateKey;

  signaturePublic;
  signaturePrivate;

  constructor() {
    this.key = new nodeRSA({b: 1024});
    this.encryptPrivateKey = this.key.exportKey('private');
    this.encryptPublicKey = this.key.exportKey('public');
  
    this.signature = new nodeRSA({b: 1024});
    this.signaturePrivate = this.signature.exportKey('private');
    this.signaturePublic = this.signature.exportKey('public');
  }

  getEncryptPublicKey(){
    return this.encryptPublicKey();
  }

  encrypt(object){
    return this.key.encrypt(object, 'base64');
  }

  decrypt(objectEncrypted){
    return this.key.decrypt(objectEncrypted, 'utf8');
  }

  encryptExternal(externalPublicKey, object){
    let temporalyKey;
    temporalyKey = new nodeRSA(externalPublicKey);
    return temporalyKey.encrypt(object, 'base64');
  }

  //Firma Digital
  sign(object){
    return this.signature.sign(object, 'base64', 'base64');
  }

  checkSing(objectUnsigned, objectSigned){
    return this.signature.verify(objectUnsigned, objectSigned, 'base64', 'base64');
  }

}