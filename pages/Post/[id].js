import { useEffect,useState } from "react"
import ReactPlayer from 'react-player'
import {head} from 'next/head'
import { useRouter } from "next/router";
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
export const getStaticPaths = async () =>{
    const Data = await fetch("http://localhost:3000/api/Feed")
    const Results = await Data.json() 
    const Result = Results.Arr
    const DataArr = Result.map(Arr =>{
        return{
            params:{id:String(Arr._id)}
        }
    })
    return{
        paths:DataArr,
        fallback:false
    }
}
export const getStaticProps = async (context) =>{
    const Id = context.params.id 
    const Data = await fetch("http://localhost:3000/api/Post",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({id:Id})
    })
    const Result = await Data.json() 
    
    const DataOfComment = await fetch("http://localhost:3000/api/FeedComment",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({id:Id})
    })
    const ResultOfComment = await DataOfComment.json() 
    return {
       props:{data:Result,Comments:ResultOfComment.Arr,Id:Id},
       revalidate: 1
    }
}
let Post = ({data,Comments,Id}) =>{
    const [ArrOfComments,ChangeComments] = useState(Comments)
    const Router = useRouter()
    const [ProfilePhoto,ChangeProfile] = useState('')
    const [LikeIcon,ChangeLikeIcon] = useState('/BlackLike.svg')
    let ProfilePhotoData = async() =>{
        const Profile = await fetch('/api/ProfilePhoto',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({Email:data.Email})
        }) 
        const Response = await Profile.json() 
        ChangeProfile(Response.Src)
    }
    // Checking Post Been Liked before 
    let CheckLikeBefore = async() =>{
        const Userdata = await fetch('/api/CheckToken')
        const Details = await Userdata.json()
        const request = await fetch('/api/CheckLike',{
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({id:data._id,Email:Details.Email})
        })
        const response = await request.json() 
        
        
        if (response.status == true){
            ChangeLikeIcon('/RedLike.svg')
        }
        if (response.status == false){
            ChangeLikeIcon('/BlackLike.svg')
        }
    }
    useEffect(()=>{
        CheckLikeBefore()
        ProfilePhotoData()
    })
    let OpenComment = () =>{
        if (Id != undefined){
        Router.push('/Comment/'+ Id)
        }
    }
    let Media = () =>{
        if (data.Type == 'Image'){
            return (
                <img className = 'w-96 rounded h-96 border-l border-b border-t border-black  object-contain' src = {data.Image}/>
            )
        }
        if (data.Type == 'Video'){
            return(
                <div className = 'w-96 rounded overflow-hidden h-96 border-l border-b border-t border-black  object-contain'><ReactPlayer  controls  height = '100%' width = '100%' url = {data.Image}/></div>
            )
        }
        else{
            return (
            <img src = 'gif.gif'/>)
        }
    }
    // Sending Notfication 
    let Notification = async() =>{
        const Userdata = await fetch('/api/CheckToken')
        const Details = await Userdata.json()
        if ( Details.Email != undefined){
        const Message  = ' Likes Your Post'
        const SendToDatabase = {
            Post:Id,
            Type:'Like',
            FullName:Details.FullName,
            Email:Details.Email,
            Src:data.Image,
            EmailOfRealPost:data.Email,
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
            body:JSON.stringify({Type:'Like',Sender:data.Email,Message:Message})
        })
        const Response = SentMessage.json()
        }
        
    }
    // Like Feature 
    let Likefeature = async() =>{
        const Userdata = await fetch('/api/CheckToken')
        const Details = await Userdata.json()
        // Register Like 
        const LikeFetch = await fetch('/api/Like',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({id:data._id,Email:Details.Email,Details:Details})
        })
        const Response = await LikeFetch.json() 
        if (Response.status == true){
            if (data.Email != Details.Email){
                 Notification()
            }
            ChangeLikeIcon('/RedLike.svg')
        }
        if (Response.status == false){
            ChangeLikeIcon('/BlackLike.svg')
        }
    }
    let BackFunction = () =>{
        Router.push('/Home')
    }
     // Map Function For Mapping Comments 
     let MapAll = (Arr) =>{
        return(
            <div className = 'flex flex-col h-auto border-t mb-1 border-black'>
           <div  onClick = {OpenComment} className = 'flex flex-row'> 
           <img className = ' mt-2 ml-2 rounded-full w-7 h-7' src = {Arr.ProfilePhoto}/>
           <h2 className = 'mt-2 text-sm  ml-2'><strong>{Arr.FullName}</strong></h2>
           <p className = 'text-xs mt-3 ml-2'>{Arr.Comment}</p>
           </div>
           
            </div>
        )
    }
    let GoToProfile = async () =>{
        const Profile = await fetch('/api/SearchId',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({Email:data.Email})
        })
        const Get = await Profile.json() 
        const Id = Get.id 
        Router.push('/Profile/'+Id)
    }
    return (
        <div className = ' flex flex-col w-screen h-screen'>
        <head>
        <title>Post</title>
        </head>
        <div><button onClick = {BackFunction} className = 'ml-5 mt-2 w-24 h-11 text-xl hover:bg-white hover:text-black text-white bg-black rounded border border-black '>Back</button></div>
        <div className = 'flex flex-row rounded mt-9 ml-48  h-auto'>
        <Media/>
       <div className = 'flex flex-col border rounded border-black w-96' >
       
       <div className = 'flex border-b w-96 border-b border-black flex-row'>
       <img onClick = {GoToProfile} className = ' ml-5 mt-1 w-9 mb-1 h-9 rounded-full' src = {ProfilePhoto}/>
       <h2 onClick = {GoToProfile} className = 'ml-2 mt-1 font-Secondary text-2xl'>{data.FullName}</h2>
       </div>
       <div className = 'h-72 overflow-auto'>
       {ArrOfComments.map(MapAll)}
       </div>
       <div className = 'flex flex-row h-11 border-t  border-black '><button className = 'ml-2  mr-3  h-11' onClick = {Likefeature}><img className = 'w-7 h-7' src = {LikeIcon}/></button><button className = 'mr-1 h-11' onClick = {OpenComment}><img className = 'w-7 h-7' src = '/Comment.svg'/></button><button className = ' h-11 ml-2 mr-2'><img className = '  w-6 h-6' src = '/Message3.svg'/></button><button className = ' h-11 ml-56'><BookmarkBorderOutlinedIcon/></button></div>
       
       </div>
        </div>
        </div>
    )
}
export default Post 