import { useEffect,useState } from "react"
import {useRouter} from 'next/router'

let NotifCard = (props) =>{
  const Router = useRouter()
  const [ProfilePhoto,ChangeProfile] = useState('') 
  let ProfilePhotoData = async() =>{
    const Profile = await fetch('/api/ProfilePhoto',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({Email:props.Email})
    }) 
    const Response = await Profile.json() 
    console.log(ProfilePhoto)
    ChangeProfile(Response.Src)
}
let CheckFollow = async () =>{
  const Userdata = await fetch('/api/CheckToken')
    const Details = await Userdata.json()
    const by = Details.Email
  const Check = await fetch('/api/CheckFollow',{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({Follow:props.Email,by:by})
  })
  const Resp = await Check.json() 
  if (Resp.status == true){
      document.getElementById('Follow').style.display = 'none'
      document.getElementById('UnFollow').style.display = 'block'
  }
}
  useEffect(()=>{
    CheckFollow()
   ProfilePhotoData()
  })
  let GotoPost = () =>{
    Router.push('/Post/' + props.Post)
   }
  let  ProfileOpen = async() =>{
    const Profile = await fetch('/api/SearchId',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({Email:props.Email})
        })
        const Get = await Profile.json() 
        const Id = Get.id 
        Router.push('/Profile/'+Id)
  }

  // Sending Notfication 
  let Notification = async() =>{
    // Need To be Encrpyt

    const Userdata = await fetch('/api/CheckToken')
    const Details = await Userdata.json()
    if ( Details.Email != undefined){
    const Message  =  '  Starts Following You'
    const SendToDatabase = {
        Post:'ljkjkaf',
        Type:'Follow',
        FullName:Details.FullName,
        Email:Details.Email,
        Src:';fk;sf;a',
        EmailOfRealPost:props.Email,
        Message:Message
    }
    const SentToApi = await fetch('/api/Notfication',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(SendToDatabase)
    })
    const ResponseFromApi = await SentToApi.json()
    const SentMessage = await fetch('/api/Pusher',{
        method:'POST',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({Type:'Like',Sender:props.Email,Message:Message})
    })
    const Response = SentMessage.json()
    }
    
}

let Follow = async( )=>{
    const Request = await fetch('/api/Token',{
        method:'POST',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({Request:'Token'})
      })
    const Response = await Request.json() 
      // For Fetching Profile Photo 
    const ProfileImg = await fetch('/api/ProfilePhoto',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({Email:Response.Email})
    })
    const Photo = await ProfileImg.json()
    const DataToSave = {
        Follow:props.Email,
        by:Response.Email,
        FullDetails:{
            ProfilePhoto:Photo.Src,
            FullName:Response.FullName,
            Email:Response.Email
        }
    }
    const SaveTheData = await fetch('/api/Follow',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(DataToSave)
    })
    const Saved = await SaveTheData.json() 
    if (Saved.status == true){
        Notification()
        document.getElementById('Follow').style.display = 'none'
        document.getElementById('UnFollow').style.display = 'block'
    }
    if (Saved.status == false){
        document.getElementById('Follow').style.display = 'block'
        document.getElementById('UnFollow').style.display = 'none'
    }
}
  return (
      <div className = ' ml-96 mt-2 pt-1 pl-2 w-96 relative h-14    flex flex-row'  >
      <img onClick = {ProfileOpen} src = {ProfilePhoto} className = 'w-12 mr-2 h-12 rounded-full'  />
      <h2 className = 'text-sm w-60 ml-2 mt-2 ' ><strong >{props.FullName}</strong> {props.Message}</h2>
      <button onClick = {Follow} id = 'Follow' className = 'w-20 absolute right-0 top-2 text-xs rounded hover:text-black hover:bg-white border border-black h-8 bg-Insta text-white'>Follow Back</button>
      <button  onClick = {Follow} id = 'UnFollow' className = ' hidden w-20  absolute right-0 top-2 text-xs rounded hover:bg-red-600 hover:text-white border border-black h-8 bg-white text-black'>Following</button>
      </div>
  )
}
export default NotifCard