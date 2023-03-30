var keypair = require('keypair');
//var { generateKeyPair } = require('crypto');

export function getPublicPrivateKeyPair () {
  var result = keypair();
  console.log(result);
  //console.log(getPublicPrivateKeyPair1());
  return result;
}

// export function getPublicPrivateKeyPair1 () {
//     const result = generateKeyPair('rsa', {
//       modulusLength: 4096,
//       publicKeyEncoding: {
//         type: 'pkcs1',
//         format: 'pem'
//       },
//       privateKeyEncoding: {
//         type: 'pkcs1',
//         format: 'pem',
//         cipher: 'aes-256-cbc',
//         passphrase: 'top secret'
//       }
//     // Handle errors and use the generated key pair
//     }, (err: any, publicKey: any, privateKey: any) => {
//       console.log(publicKey, privateKey, err);
//       return publicKey;
//     });
//     console.log(result)
//     return result;
// }