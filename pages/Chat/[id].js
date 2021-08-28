import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Pusher from 'pusher-js'
import {useState,useEffect} from 'react'
import {useRouter} from 'next/router'
export const getStaticPaths = async () =>{
    const Data = await fetch("http://localhost:3000/api/Chats")
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
    const id = context.params.id
    const GetData = await fetch("http://localhost:3000/api/GetChat",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({id:id})
    })
    const GetDetails = await GetData.json()
    return {
        props: {
          details: GetDetails.Details,
          ID:id
        }
      };
}
const Chat = ({details,ID}) =>{
    const [Details,ChangeDetails] = useState({id:undefined,FullName:undefined,ProfilePhoto:undefined})
    const [ArrOfMess,ChangeArr] = useState(details.Messages)
    const [Status,ChangeStatus] = useState('Offline')
    const Router = useRouter()

    const FetchDetails = async() =>{
        const GetToken = await fetch('/api/TokenId',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({})
        }) 
        const GotToken = await GetToken.json() 
        if (GotToken.id == undefined){
            Router.push('/')
        }
        if (GotToken.id != undefined){
            if (GotToken.id == details.Friend1 && GotToken.id != details.Friend2){
                const Data = {
                    id:details.Friend2,
                    ProfilePhoto:details.Info2.ProfilePhoto,
                    FullName:details.Info2.FullName
                }
                const GetStatus = await fetch('/api/CheckOnline',{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({id:details.Friend2}) 
                })
                const RespStatus = await GetStatus.json() 
                if (RespStatus.status == true && RespStatus.Online == true){
                    ChangeStatus('Online')
                }
                ChangeDetails(Data)
            }
            if (GotToken.id != details.Friend1 && GotToken.id == details.Friend2){
                const Data = {
                    id:details.Friend1,
                    ProfilePhoto:details.Info1.ProfilePhoto,
                    FullName:details.Info1.FullName
                }
                const GetStatus = await fetch('/api/CheckOnline',{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({id:details.Friend1}) 
                })
                const RespStatus = await GetStatus.json() 
                if (RespStatus.status == true && RespStatus.Online == true){
                    ChangeStatus('Online')
                }
                ChangeDetails(Data)
            }
            if (GotToken.id == details.Friend1 && GotToken.id == details.Friend2){
                Router.push('/Message')
            }

        }

    }
    // Fetch Messages 
    const GetMessage = async() =>{
        const Get = await fetch('/api/GetAllMess',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({id:ID})
        })
        const Got = await Get.json()
        console.log(Got)
        if (Got.status == true){
            ChangeArr(Got.Messages)
        }
    }
    // function for Listening to Incoming Notification
    let ListenNotif = async() =>{
        const pusher = new Pusher('d662e8e248be97d0f4ee', {
            cluster: "ap2",
          });
        const Channel = pusher.subscribe('Message')  
        
            Channel.bind(String(ID),function(data){
                GetMessage()
            })
        
        
    }
    useEffect(()=>{
        FetchDetails()
        ListenNotif()
    },[])

    const ProfileOpen = () =>{
        Router.push('/Profile/'+Details.id)
    }
    let MapAll = (Arr) =>{
        return (
            <div className = 'mt-5   flex h-auto w-96 flex-col'>
            <p className = 'ml-2 text-xs '>{Arr.FullName}</p>
            <h1 className = 'overflow-clip overflow-hidden border-l-2 border-red-600 pl-2   text-xl '>{Arr.Message}</h1>
            </div>
        )
    }
    const Send = async( ) =>{
        const Message = document.getElementById('Message').value 
        const GetToken = await fetch('/api/CheckToken',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({})
    }) 
        const GotToken = await GetToken.json() 

        const SendDetails = await fetch('/api/AddMessage',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({id:ID,FullName:GotToken.FullName,Message:Message})
        })
        const GotResponse = await SendDetails.json()
        if (GotResponse.status == true ){
        const SentMessage = await fetch('/api/Pusher/Message',{
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({Type:'Like',Sender:String(ID),Message:Message})
        })
        const Response = SentMessage.json()
        }
    }
    if (Details.id == undefined){
        return (
            <div className = 'fixed pl-20 top-24 left-96'>
            <iframe src="https://giphy.com/embed/feN0YJbVs0fwA" width="280" height="280" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/artists-on-tumblr-design-feN0YJbVs0fwA"></a></p>
            </div>
        )
    }
    if (Details.id != undefined){
        return (
            <div className = '  w-screen  overflow-auto  flex flex-col'>
    
            <div className = 'flex  fixed bg-white w-screen top-0 border-b h-14 border-black flex-row'>
            <img className = 'w-11 ml-5 mt-1 h-11 rounded-full' src = {Details.ProfilePhoto}/>
            <h1 className = ' relative mt-1 ml-5 text-xl'>
            {Details.FullName}
            <p id = "Status" className = ' absolute left-2 text-sm bottom-1 text-green-600'>{Status}</p>
            </h1>
            
            </div>
            <div className ='mb-24 mt-14 flex flex-col overflow-auto'>
            {ArrOfMess.map(MapAll)}
            </div>
    
            <div className = 'fixed  flex-row flex bottom-5 w-screen'>
            <input id = "Message" className = 'text-lg pl-5 h-11 ml-5 border border-black rounded w-96' type = 'text' placeholder = 'Enter The Message '/>
            <button onClick = {Send} className = 'bg-Insta text-white w-24 h-11 rounded ml-5 hover:bg-red-600   text-lg'>Send</button>
            </div>
            
            
            </div>
        )
    }
}
export default Chat