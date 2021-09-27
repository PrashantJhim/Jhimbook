// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
require('../database/connection')

const Schema = require('../database/Schema')
const Mongoose = require('mongoose')


export default async (req, res) => {
  var DataList  = Mongoose.models.data|| Mongoose.model('data',Schema);
    // Room Id 
    const Room  = req.body.Room
    // Message 
    const Message = req.body.Message 
    // Finding The Sender Details 
    const Sender = await DataList.find({_id:req.body.IdOfSender}) 
    // Findinf The Receiver Details 
    const Receiver = await DataList.find({_id:req.body.IdOfReceiver})
    
    // Condition For Non Existing User 
    if (Sender.length == 0 && Receiver.length == 0){
      res.status(200).send({status:false})
    } 
    if (Sender.length != 0 && Receiver.length != 0){
      // For Changing In Receiver DataBase (_Receiver)
      // Find All Arrays Of Sender 
      const ProfilePhotoOfSender = Sender[0]['ProfilePhoto'] 
      const EmailOfSender = Sender[0]['Email']
      const FullNameOfSender = Sender[0]['FullName']  
      // Arrays  Of Receciver 
      const EmailsArr = Receiver[0]['MessageEmail']
      const EmailsArr2 = Sender[0]['MessageEmail']
      const EmailOfReceiver = Receiver[0]['Email']
      const EmailCheck1 = EmailsArr.indexOf(EmailOfSender) 
      const EmailCheck2 = EmailsArr2.indexOf(EmailOfReceiver)
      console.log(EmailCheck1,EmailCheck2)
      
      if (EmailCheck1 == -1 && EmailCheck2 == -1 ){
        
      const UpdateEmailsArr = [...EmailsArr,EmailOfSender]
      const MessagesArr = Receiver[0]['MessagesDetails']
      const UpdateMessagesArr = [...MessagesArr,{id:req.body.IdOfSender,Room:Room,FullName:FullNameOfSender,Email:EmailOfSender,Message:Message,Profile:ProfilePhotoOfSender}]
      // Make Update in Receiver Database 
      const UpdateReceiver = await DataList.updateOne({_id:req.body.IdOfReceiver},{$set:{MessageEmail:UpdateEmailsArr,MessagesDetails:UpdateMessagesArr}})

      // For Changing In Sender DataBase (_Sender)
      // Find All Arrays Of Sender 
      const ProfilePhotoOfReceiver = Receiver[0]['ProfilePhoto'] 
      const FullNameOfReceiver = Receiver[0]['FullName']  
      // Arrays  Of Receciver 

      const UpdateEmailsArr2 = [...EmailsArr2,EmailOfReceiver]
      const MessagesArr2 = Sender[0]['MessagesDetails']
      const UpdateMessagesArr2 = [...MessagesArr2,{id:req.body.IdOfReceiver,Room:Room,FullName:FullNameOfReceiver,Email:EmailOfReceiver,Message:Message,Profile:ProfilePhotoOfReceiver}]
      // Make Update in Receiver Database 
      const UpdateSender = await DataList.updateOne({_id:req.body.IdOfSender},{$set:{MessageEmail:UpdateEmailsArr2,MessagesDetails:UpdateMessagesArr2}})
      res.status(200).send({status:true})
      }

      if (EmailCheck1 != -1 && EmailCheck2 != -1){
      EmailsArr[EmailCheck1] = undefined
      const UpdateEmailsArr = [...EmailsArr,EmailOfSender]
      const MessagesArr = Receiver[0]['MessagesDetails']
      MessagesArr[EmailCheck1] = undefined
      const UpdateMessagesArr = [...MessagesArr,{id:req.body.IdOfSender,Room:Room,FullName:FullNameOfSender,Email:EmailOfSender,Message:Message,Profile:ProfilePhotoOfSender}]
      // Make Update in Receiver Database 
      const UpdateReceiver = await DataList.updateOne({_id:req.body.IdOfReceiver},{$set:{MessageEmail:UpdateEmailsArr,MessagesDetails:UpdateMessagesArr}})

      // For Changing In Sender DataBase (_Sender)
      // Find All Arrays Of Sender 
      const ProfilePhotoOfReceiver = Receiver[0]['ProfilePhoto'] 
      const FullNameOfReceiver = Receiver[0]['FullName']  
      // Arrays  Of Receciver 

      const UpdateEmailsArr2 = [...EmailsArr2,EmailOfReceiver]
      EmailsArr2[EmailCheck2] = undefined 
      const MessagesArr2 = Sender[0]['MessagesDetails']
      MessagesArr2[EmailCheck2] = undefined 
      const UpdateMessagesArr2 = [...MessagesArr2,{id:req.body.IdOfReceiver,Room:Room,FullName:FullNameOfReceiver,Email:EmailOfReceiver,Message:Message,Profile:ProfilePhotoOfReceiver}]
      // Make Update in Receiver Database 
      const UpdateSender = await DataList.updateOne({_id:req.body.IdOfSender},{$set:{MessageEmail:UpdateEmailsArr2,MessagesDetails:UpdateMessagesArr2}})
      res.status(200).send({status:true})
      }


    }
  
  } 
   

  
