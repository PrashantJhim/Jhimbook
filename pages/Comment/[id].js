import {useState,useEffect} from 'react' 
import {useRouter} from 'next/router'
import {head} from 'next/head'
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
    // For Getting Email 
    const Id = context.params.id 
    const DataOfId = await fetch("http://localhost:3000/api/Post",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({id:Id})
    })
    const ResultEmail = await DataOfId.json() 

    const Data = await fetch("http://localhost:3000/api/FeedComment",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({id:Id})
    })
    const Result = await Data.json() 
    return {
       props:{data:Result,Id:Id,ResultEmail:ResultEmail}
    }
}


let Comment = ({data,Id,ResultEmail}) =>{
    const [CommentsArr,ChangeComments] = useState(data.Arr)
    const [Email,ChangeEmail] = useState(undefined)
    const Router = useRouter()
    let Token = async () =>{
        const Userdata = await fetch('/api/Token')
        const Details = await Userdata.json() 
        if (Details.Email == undefined && Details.Password == undefined){
            Router.push('/')
        }
        else{
            ChangeEmail(Details.Email)
        }
    }
    useEffect(()=>{
        Token()
    })
    // Sending Notfication 
    let Notification = async() =>{
        const Userdata = await fetch('/api/CheckToken')
        const Details = await Userdata.json()
        if ( Details.Email != undefined){
        const Message  =  ' Comments Your Post'
        const SendToDatabase = {
            Post:Id,
            Type:'Comment',
            FullName:Details.FullName,
            Src:ResultEmail.Image,
            Email:Details.Email,
            EmailOfRealPost:ResultEmail.Email,
            Message:Message
        }
        console.log(ResultEmail.Email)
        const SentToApi = await fetch('/api/Notfication',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(SendToDatabase)
        })
        const ResponseFromApi = await SentToApi.json()
        const SentMessage = await fetch('/api/Pusher',{
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({Type:'Like',Sender:ResultEmail.Email,Message:Message})
        })
        const Response = SentMessage.json()
        }
        
    }
    let SendComment = async () =>{
        // For Token
       const Token = await fetch('/api/CheckToken') 
       const ResponseToken = await Token.json() 
       const Email = ResponseToken.Email 
       const FullName = ResponseToken.FullName 
       // for Profile 
       const RequestPhoto = await fetch('/api/ProfilePhoto',{
           method:"POST",
           headers:{"Content-Type":"application/json"},
           body:JSON.stringify({Email:Email})
       })
       const ResponsePost = await RequestPhoto.json() 
       const ProfilePhoto = ResponsePost.Src 
       const Post = String(Id)
       const Details = {
           Email,
           FullName,
           ProfilePhoto,
           Post,
           Comment:document.getElementById('Comment').value
       }
       const Send = await fetch('/api/Comment',{
           method:"POST",
           headers:{"Content-Type":"application/json"},
           body:JSON.stringify(Details)
       })
       const Sent = await Send.json() 
       if (Sent.status == true){
           if (ResultEmail.Email != Email){
            Notification()
           }
           
       }
       ChangeComments(Sent.Arr)
    }
    // Back Function 
    let BackFunction = () =>{
        Router.push('/Home')
    }
    // Like And Delete Function 
    let LikAndDel = async(event) =>{
        const IdOfComment = event.target.value
        const Type = event.target.innerHTML 
        const Post = Id
        const Token = await fetch('/api/CheckToken') 
        const resp = await Token.json()
        const Email = resp.Email 
        const Request = await fetch('/api/LikeAndDel',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({Email,Type,id:IdOfComment,Post})
        })
        const Response = await Request.json() 
        if (Type == 'Like' && Response.status == 'Liked'){
            event.target.innerHTML = 'Unlike'
        }
        if (Type == 'Unlike' && Response.status == 'Unliked'){
            event.target.innerHTML = 'Like'
        }
        ChangeComments(Response.Arr)

    }
    // Map Function For Mapping Comments 
    let MapAll = (Arr) =>{
        if (Email != undefined){
            const Liked = () =>{
                const ArrOf = Arr.Liked 
                if (ArrOf.indexOf(Email) != -1){
                    return (
                        <button id = "Like" onClick = {LikAndDel} value = {Arr._id} className = 'text-sm mr-5' >Unlike</button>
                    )
                }
                if (ArrOf.indexOf(Email) == -1){
                    return (
                        <button id = "Like" onClick = {LikAndDel} value = {Arr._id} className = 'text-sm mr-5' >Like</button>
                    )
                }
            }
            const Delete = () =>{
                if (Arr.Email == Email){
                    return (
                        <button id = 'Delete' onClick = {LikAndDel} value = {Arr._id}className = 'text-sm text-red-600 mr-24'>Delete</button>
                    )
                }
                else{
                    return(
                        <div></div>
                    )
                }
            }
            let GoToProfile = async () =>{
                const Profile = await fetch('/api/SearchId',{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({Email:Arr.Email})
                })
                const Get = await Profile.json() 
                const Id = Get.id 
                Router.push('/Profile/'+Id)
            }
            return(
                <div className = 'flex flex-col h-auto border-t mb-1 border-black'>
               <div className = 'flex flex-row'> 
               <img className = ' mt-1 ml-2 rounded-full w-9 h-9' src = {Arr.ProfilePhoto}/>
               <h2 className = 'mt-2  ml-2' onClick = {GoToProfile}><strong  onClick = {GoToProfile}>{Arr.FullName}</strong></h2>
               <p className = 'text-sm mt-3 ml-2'>{Arr.Comment}</p>
               </div>
               <div className = 'flex flex-row pl-14'>
               <Liked/>
               <Delete/>
               <h3 className = 'text-sm text-red-600'>{Arr.Likes} Likes</h3>
               </div>
                </div>
            )
        }
        
    }
    
    return (
        <div className = 'flex flex-col'>
        <head>
        <title>Comments</title>
        </head>
        <div className = 'flex flex-row h-12 border-b border-black mb-2'><button onClick = {BackFunction} className = 'text-xl text-white bg-black hover:text-black hover:bg-white h-9 mt-2 ml-5 w-14 border border-black rounded'>Back</button></div>
        <div className = 'flex flex-row'><input className = ' mt-2 pl-5 border border-black rounded ml-3 w-80 h-9' id = "Comment" type = 'text' placeholder = 'Enter The Comment'/>
        <button className = 'border border-black text-lg mt-2 ml-5 w-24 rounded h-9 bg-black text-white hover:text-black hover:bg-white' onClick = {SendComment}>Send</button></div>
        <div className = 'mt-5 '>
        {CommentsArr.map(MapAll)}
        </div>
        </div>
    )
}
export default Comment