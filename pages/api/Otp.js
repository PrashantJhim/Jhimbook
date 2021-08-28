const Secure = require('bcryptjs')
const sendgrid = require('@sendgrid/mail')
export default async (req,res) =>{
    const Api = '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'
    sendgrid.setApiKey(Api)
    
    const Otp = String(Math.floor(Math.random()*10000))
    const EncOtp = await Secure.hash(Otp,12)
    var otp = Otp
    let message = {
        to:req.body.Email,
        from:'pkjhim2016@gmail.com',
        subject: "Otp For Verification Of User",
        html: `<div id = 'Container'>
        <div id = 'Main'>
            <h1>Welcome To JhimBook(Beta)</h1>
            <p>Thanks For Taking Interest In Our Beta Testing</p>
            <p>This Password Is Only Valid For 90 Seconds  </p>
            <p>One-Time-Password = ${otp}</p> 
        </div>
    </div>`
    }
    
    sendgrid.send(message).then((response)=>console.log('Sent Successful'))
    .catch(()=>{res.status(200).send({status:false})})
    res.status(200).send({status:true,Otp:EncOtp})
    
    

}