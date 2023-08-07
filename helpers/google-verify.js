const {OAuth2Client} = require('google-auth-library');


const client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID );

async function googleVerify( token = '' ) {

  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  // Extraer los datos que usare de la cta de Google
  const {name, email, picture} = ticket.getPayload();

  // Retorno datos con los nombres que usare
  return {
    nombre: name,
    correo: email,
    img: picture
  }

}

module.exports = {
    googleVerify
}