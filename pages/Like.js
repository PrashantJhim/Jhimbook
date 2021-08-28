import {useEffect,useState} from 'react' 
import Menu from './Menu' 
import head from 'next/head'
import { useRouter } from 'next/router'
import Pusher from 'pusher-js'
import {useDispatch} from 'react-redux'
import Card from './NotifCard'
import Card2 from './FollowNotif'
let Like = () =>{
    const Router = useRouter()
    const [ArrOfNotif,ChangeArr] = useState([])
    const dispatch = useDispatch()
    // Get The Notifaication 
    let GetNotif = async () =>{
        const Token = await fetch('/api/CheckToken') 
        const Response = await Token.json()
        const Request = await fetch('/api/GetNotif',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({Email:Response.Email})
        })
        const Resp = await Request.json() 
        ChangeArr(Resp.Arr)
    }
    // function for Listening to Incoming Notification
    let ListenNotif = async() =>{
        
        const Token = await fetch('/api/CheckToken') 
        const Response = await Token.json()
        const pusher = new Pusher('d662e8e248be97d0f4ee', {
            cluster: "ap2",
          });
        const Channel = pusher.subscribe('Notification')  
        if (Response.Email == undefined){
            Router.push('/')
        }
        if (Response.Email != undefined){
            Channel.bind(Response.Email,function(data){
                GetNotif()
            })
        }
        
    }
    useEffect(()=>{
        let IconChange = {type:"Icon",Icon:'Like'}
        dispatch(IconChange)
        ListenNotif()
        GetNotif()
    },[])
    // Map All Notification 
    let Print = (Arr) =>{
        if (Arr.TypeOfNot != 'Follow'){
            return (
                <Card FullName = {Arr.FullName} Post = {Arr.Post} Message = {Arr.Message} Email = {Arr.Email} Src = {Arr.Src}/>
              )
        }
        if (Arr.TypeOfNot == 'Follow'){ 
            return(
                <Card2 FullName = {Arr.FullName} Post = {Arr.Post} Message = {Arr.Message} Email = {Arr.Email} Src = {Arr.Src}/>
            )
        }
      }
      let Media = () =>{
        if (ArrOfNotif.length == 0){
            return (
                <div className = 'pl-40'>
                <img className = 'w-96 h-96 ml-60' src = 'gif.gif'/>
                <h2 className = 'text-5xl font-Secondary ml-96'>Loading</h2>
                </div>
            )
        }
        if (ArrOfNotif.length != 0){
            return (
                <div className = 'flex flex-col mt-2'>
                {ArrOfNotif.map(Print)}
                </div>
            )
        }
       
    }
    
    return (
        <div>
        <head>
        <title>
        JhimBook
        </title>
        </head>
        <Menu/>
        <h1 className = 'mt-5 ml-96 pl-2 text-3xl font-Secondary'>Notifications </h1>
        <Media/>
        </div>
    )
}
export default Like