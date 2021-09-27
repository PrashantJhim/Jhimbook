import ReactPlayer from 'react-player'
import {useRouter} from 'next/router'
import {useState,useEffect} from 'react'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import CloseIcon from '@material-ui/icons/Close';

let Card = (props) =>{
    const Button1 = String(props.id) + 'Show'
    const Button2 = String(props.id) + 'Close'
    const Button3 = String(props.id) + 'Delete'
    const router = useRouter()
    const Id = props.id
    let [Start,Change] = useState(false)
    const [ProfilePhoto,ChangeProfile] = useState('')
    const [LikeIcon,ChangeLikeIcon] = useState('BlackLike.svg')
    let ProfilePhotoData = async() =>{
        const Profile = await fetch('/api/ProfilePhoto',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({Email:props.Email})
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
            body:JSON.stringify({id:props.id,Email:Details.Email})
        })
        const response = await request.json() 
        if (Details.Email == props.Email){
            document.getElementById(Button3).style.display = 'block'
        }
        const Loaded = {type:'Loading'} 
        
        
        if (response.status == true){
            
            ChangeLikeIcon('RedLike.svg')
        }
        if (response.status == false){
            
            ChangeLikeIcon('BlackLike.svg')
        }
    }
    useEffect(()=>{
        ProfilePhotoData()
        CheckLikeBefore()
    })
    
    let OpenComment = () =>{
        router.push('/Comment/'+ Id)
    }
    let Media = () =>{
        if (props.Type == 'Image'){
            return (
                <img alt = 'Photo'   src ={props.Image} />
            )
        }
        if (props.Type == 'Video'){
            return(
                <ReactPlayer  controls  height = '385px' width = '100%' url = {props.Image}/>
            )
        }
        else{
            return (
            <img src = 'gif.gif'/>)
        }
    }
    let ShowOption = () =>{
        const id = String(props.id)
        const Id = String(props.id) + 'Show'
        const Id2 = String(props.id) + 'Close'
        document.getElementById(id).style.display = 'flex'
        document.getElementById(Id).style.display = 'none'   
        document.getElementById(Id2).style.display = 'block' 
        
    }
    let CloseOption = () =>{
        const id = String(props.id)
        const Id = String(props.id) + 'Close'
        const Id2 = String(props.id) + 'Show'
        document.getElementById(id).style.display = 'none'
        document.getElementById(Id).style.display = 'none'
        document.getElementById(Id2).style.display = 'block'
    }
    // Sending Notfication 
    let Notification = async() =>{
        // Need To be Encrpyt

        const Userdata = await fetch('/api/CheckToken')
        const Details = await Userdata.json()
        if ( Details.Email != undefined){
        const Message  =  ' Likes Your Post'
        const SendToDatabase = {
            Post:Id,
            Type:'Like',
            FullName:Details.FullName,
            Email:Details.Email,
            Src:props.Image,
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
    const DeleteFeature = async() =>{
        const id = props.id  
        const DeletePost = await fetch('/api/DeletePost',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({id:id})
        })
        const GotDeleted = await DeletePost.json() 
        if (GotDeleted.status == true){
            router.push('/')
            router.push('/Home')
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
            body:JSON.stringify({id:props.id,Email:Details.Email,Details:Details})
        })
        const Response = await LikeFetch.json() 
        if (Response.status == true){
            if (Details.Email != props.Email){
                Notification()
            }
            ChangeLikeIcon('RedLike.svg')
        }
        if (Response.status == false){
            ChangeLikeIcon('BlackLike.svg')
        }
    }
    let ShowPost = () =>{
        router.push('/Post/' + props.id)
    }
    let GoToProfile = async () =>{
        const Profile = await fetch('/api/SearchId',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({Email:props.Email})
        })
        const Get = await Profile.json() 
        const Id = Get.id 
        router.push('/Profile/'+Id)
    }
    // Navigate to messages Part 
    let NavigateMessage = async () =>{
        const Profile = await fetch('/api/SearchId',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({Email:props.Email})
        })
        const Get = await Profile.json() 
        const Token = await fetch('/api/TokenId') 
        const GotToken = await Token.json()
        const PersonClicked = GotToken.id 
        const PersonToMessage = Get.id 
        // To Check it is Same or if not navigate to Message 
        // API For Getting User Details 
        const Sendrequest = await fetch('/api/ChatDetails',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({id1:PersonClicked,id2:PersonToMessage})
        })
        const ResponseDetails = await Sendrequest.json()
        const Friend1 = ResponseDetails.Friend1 
        const Friend2 = ResponseDetails.Friend2 

        const GetIdOfMessage = await fetch('/api/CreateChat',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({id1:PersonClicked,info1:Friend1,info2:Friend2,id2:PersonToMessage})
        })
        const Response = await GetIdOfMessage.json() 
        if (Response.status == true){
            router.push('/Chat/'+Response.id)
        }
    }
    return (
        <div className = ' flex flex-col w-96 ml-96 h-auto border border-black mt-9 ml-24 rounded overflow-hidden '>
        
        <div className = 'flex flex-row border-b border-black h-11 pt-1 '><img className = 'h-9 w-9 ml-2 mr-2 border border-black rounded-full ' src = {ProfilePhoto}/><h2 className = 'text-lg w-72 font-bold text-black'>{props.FullName}</h2>
        <div  className = ' relative flex flex-col  '>
        <button id = {Button1} onClick = {ShowOption}  className = ' h-2 h-8'><MoreHorizIcon/></button>
        <button id = {Button2}  onClick = {CloseOption}  className = 'hidden  h-2 h-8'><CloseIcon/></button>
        <div id = {Id} className = ' hidden z-20 absolute w-24 h-24 flex -right-4 top-9 flex-col bg-white border border-black rounded font-Secondary  '>
        <button className = 'text-lg border-b border-black hover:text-red-600' onClick = {GoToProfile} >View Profile</button>
        <button className = 'text-lg  border-b border-black hover:text-red-600' onClick = {ShowPost}>View Post</button>
        <button id = {Button3} className = ' hidden text-lg text-red-600' onClick = {DeleteFeature}>Delete</button>
        </div>
        <div>
        </div>
         </div></div>
        <Media/>
        <div className = 'flex flex-row h-11 '><button className = 'ml-2  mr-3  h-11' onClick = {Likefeature}><img className = 'w-7 h-7' src = {LikeIcon}/></button><button onClick = {OpenComment} className = 'mr-1 h-11'><img className = 'w-7 h-7' src = 'Comment.svg'/></button><button className = ' h-11 ml-2 mr-2' onClick = {NavigateMessage}><img className = '  w-6 h-6' src = 'Message3.svg'/></button></div>
        <p className = 'ml-1 mr-1'> <strong>{props.FullName}</strong>:- {props.Desc} </p>
        </div>
    )
}
export default Card