import {useEffect,useState} from 'react' 
import {useDispatch} from 'react-redux'
import ReactPlayer from 'react-player'
import {head} from 'next/head'
import {useRouter} from 'next/router'
import Menu from './Menu'
export const getStaticPaths = async () =>{
    const Data = await fetch("http://localhost:3000/api/Users")
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
    const FetchUser = await fetch('http://localhost:3000/api/UserDetails',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({id:Id})
    })
    const Response = await FetchUser.json() 
    const Result = Response.Details
    const Email = Result.Email 
    // To Get Following Or Followers 
    const SendDetails = await fetch('http://localhost:3000/api/Followers',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({Email:Email})
    })
    const GetDetails = await SendDetails.json()
    // To Get Following Or Followers 
    const SendDetails1 = await fetch('http://localhost:3000/api/Following',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({Email:Email})
    })
    const GetDetails2 = await SendDetails1.json()
    const FetchMedia = await fetch('http://localhost:3000/api/UserFeed',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({Email:Email})
    })
    const ResponseFeed = await FetchMedia.json()
    const Feed = ResponseFeed.Arr
    return {
       props:{data:Result,Feed:Feed,IdOfUser:Id,Followers:GetDetails.Followers,Following:GetDetails2.Following},
       revalidate: 1
    }
}
let Profile = ({data,Feed,IdOfUser,Followers,Following,Email}) =>{
    const [WindowName,ChangeName] = useState('')
    const [ArrOfWindow,ChangeArr] = useState([])
    const Router = useRouter()
    const [ArrOfFeed,ChangeFeed] = useState(Feed)
    const dispatch = useDispatch()
    let CheckFollow = async (by) =>{
        const Check = await fetch('/api/CheckFollow',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({Follow:data.Email,by:by})
        })
        const Resp = await Check.json() 
        if (Resp.status == true){
            document.getElementById('Follow').style.display = 'none'
            document.getElementById('UnFollow').style.display = 'block'
            document.getElementById('EditProfile').style.display = 'none'
        }
        if (Resp.status == false){
            document.getElementById('Follow').style.display = 'block'
            document.getElementById('UnFollow').style.display = 'none'
            document.getElementById('EditProfile').style.display = 'none'
        }
        
    }
    let CheckProfile = async() =>{
        const Request = await fetch('/api/Token',{
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({Request:'Token'})
          })
        const Response = await Request.json() 
        if (Response.Email == undefined){
            Router.push('/')
        }
        if (Response.Email == data.Email){
            document.getElementById('Follow').style.display = 'none'
            document.getElementById('UnFollow').style.display = 'none'
            document.getElementById('EditProfile').style.display = 'block'
        }
        if (Response.Email != data.Email){
            CheckFollow(Response.Email)
        }
    }
    useEffect(()=>{
        CheckProfile()
        let IconChange = {type:"Icon",Icon:'Profile'}
        dispatch(IconChange)
        ChangeFeed(Feed)
    })

    

    let Print = (Arr) =>{
        if (Arr.Type == 'Video'){
            return (
                <div id = {Arr._id} onClick = {()=>{Router.push('/Post/'+Arr._id)}} className = 'w-80 h-80 mr-2'><ReactPlayer id = {Arr._id} controls   height = '320px' width = '320px' url = {Arr.Image}/></div>
            )
        }

        if (Arr.Type = 'Image') {
            return (
                <div id = {Arr._id}  onClick = {()=>{Router.push('/Post/'+Arr._id)}} ><img id = {Arr._id} className = 'w-80 h-80 mr-2' src = {Arr.Image}/></div>
            )
        }
        
            
        
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
            Follow:data.Email,
            FollowDetails:{
                Email:data.Email,
                FullName:data.FullName,
                ProfilePhoto:data.ProfilePhoto
            },
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
    let WindowOpen = (event) =>{
        ChangeName(event.target.id)
        const id = event.target.id 
        if (id == 'Following'){
            ChangeArr(Following)
        }
        if (id == 'Followers'){
            ChangeArr(Followers)
        }
        document.getElementById('Window').style.display = 'block'
    }
    let CloseWindow = () =>{
        document.getElementById('Window').style.display = 'none'
    }
    let PrintCard = (Arr) =>{
        const Data = Arr.FullDetails
        return(
            <div className = 'flex border-b border-black flex-row'>
            <img className = 'w-11 mb-1 h-11 rounded-full ml-5 mt-2 ' src = {Data.ProfilePhoto}/>
            <h1 className = ' font-Third ml-5 mt-3  text-2xl'>{Data.FullName}</h1>
            </div>
        ) 
    }
    let PrintCard2 = (Arr) =>{
        const Data = Arr.FollowDetails
        return(
            <div className = 'flex border-b border-black flex-row'>
            <img className = 'w-11 mb-1 h-11 rounded-full ml-5 mt-2 ' src = {Data.ProfilePhoto}/>
            <h1 className = ' font-Third ml-5 mt-3  text-2xl'>{Data.FullName}</h1>
            </div>
        ) 
    }
    let ShowFriends = () =>{
        if (WindowName == 'Followers'){
            return (
                <div>
                {ArrOfWindow.map(PrintCard)}
                </div>
            )
        }
        if (WindowName == 'Following'){
            return (
                <div>
                {ArrOfWindow.map(PrintCard2)}
                </div>
            )
        }
        else{

            return (
                <div></div>
            )
        }
    }

    return (
        <div className = 'flex flex-col'>
        <head>
        <title>{data.FullName}</title>
        </head> 
        <div id = 'Window' className = 'z-40 hidden fixed w-full bg-black h-screen bg-opacity-60 pl-11'>
        <div className = ' rounded  border border-black mt-24 w-96 h-96 bg-white ml-96'>
        <div className = ' relative h-11  border-b border-black flex flex-row'>
        <h1 className = 'w-96 mt-2 ml-24 text-2xl font-Third'>{WindowName}</h1>
        <button className = ' absolute top-2 right-2  hover:text-red-600   font-Third text-2xl' onClick = {CloseWindow}>Close</button>
        </div>
        <div className = 'flex flex-col'>
        <ShowFriends/>
        </div>
        </div>
        </div>
        <Menu id = {IdOfUser}/>
        
        <div className = 'flex flex-row mt-11'>
        <img  className = ' ml-80 mb-11 rounded-full w-32 h-32'  src = {data.ProfilePhoto}/>
        <div className = 'flex flex-col w-96'>
        <div className = 'flex flex-row'>
        <h1 className = 'font-Third ml-11 text-2xl'>{data.FullName}</h1>
        </div>
        <div className = 'flex mt-2 ml-11 flex-row'>
        <h2 className = 'mr-5'>Posts: <strong>{ArrOfFeed.length}</strong></h2>
        <h2 id = 'Followers' className = 'mr-5 z-30 ' onClick = {WindowOpen}>Followers:  <strong>{Followers.length}</strong></h2>
        <h2 id = 'Following' className = 'z-30' onClick = {WindowOpen}>Following: <strong>{Following.length}</strong></h2>
        </div>
        <div>
        
        </div>
        </div>
        <button id = 'Follow' onClick = {Follow} className = 'w-20   rounded text-sm h-9 text-white bg-Insta hover:text-black hover:bg-white border border-black '>Follow</button>
        <button id = "UnFollow" onClick = {Follow} className = 'w-20 hidden rounded text-sm h-9 text-white bg-Insta hover:text-black hover:bg-white border border-black '>UnFollow</button>
        <button onClick = {()=>{Router.push('/EditProfile')}} id = "EditProfile" className = 'w-20 hidden rounded text-sm h-9 text-black bg-white hover:text-white hover:bg-black border border-black '>Edit Profile</button>
        </div>
        <div className = ' pl-40 flex flex-wrap flex-row'>
        {ArrOfFeed.map(Print)}
        </div>
        
        </div>
    )
}
export default Profile