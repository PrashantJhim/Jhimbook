import Pusher from 'pusher'
export default async(req,res)=>{
  
    const pusher = new Pusher({
        appId: "1236919",
        key: "d662e8e248be97d0f4ee",
        secret: "8c4de9dbdfc3e5578fa1",
        cluster: "ap2",
        useTLS: true,
      });
      
      const response = await pusher.trigger("Message", req.body.Sender, {
          message:req.body.Message
        });
    
      res.json({message:'Completed'})
} 