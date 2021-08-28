const cookie = require('cookie')
export default async (request,response)=>{
    response.setHeader('Set-Cookie', cookie.serialize('jwt', '', {
        httpOnly: true
      }));
    response.status(200).send({status:true})
}