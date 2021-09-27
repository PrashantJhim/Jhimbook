import {useEffect} from 'react'
import head from 'next/head' 
import {useRouter} from 'next/router'
import Menu from './Menu'
import {useState} from 'react'
import {useDispatch} from 'react-redux'
let Message = () =>{
    const Router = useRouter()
    const [UserArr,ChangeUserArr] = useState([])
    const [SearchArr,ChangeArr] = useState([])
    const [MessageArr,ChangeMessageArr] = useState([])
    const dispatch = useDispatch()
    // Fetch Data  
    const FetchData = async() =>{
        const FetchToken = await fetch('/api/TokenId') 
        const GetToken = await FetchToken.json() 
        const GetData = await fetch('/api/ReadAll',{
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({id:GetToken.id})
        
        }
        )
        const GotData = await GetData.json()
        if (GotData.status == true){
            ChangeMessageArr(GotData.Arr)
        }
    }
    useEffect(()=>{
        let IconChange = {type:"Icon",Icon:'Message'}
        dispatch(IconChange)
        FetchData()
    },[])
    let OnClickChat = async(event) =>{
        const FetchToken = await fetch('/api/TokenId') 
        const GetToken = await FetchToken.json() 
        const id1 = GetToken.id 
        const id2 = event.target.id 
        // API For Getting User Details 
        const Sendrequest = await fetch('/api/ChatDetails',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({id1:id1,id2:id2})
        })
        const ResponseDetails = await Sendrequest.json()
        const Friend1 = ResponseDetails.Friend1 
        const Friend2 = ResponseDetails.Friend2 

        const GetIdOfMessage = await fetch('/api/CreateChat',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({id1:id1,info1:Friend1,info2:Friend2,id2:id2})
        })
        const Response = await GetIdOfMessage.json() 
        if (Response.status == true){
            Router.push('/Chat/'+Response.id)
        }
        
    }
    // Search User Function 
    let SearchUser = (Arr) =>{
        
        return (
        <div onClick = {OnClickChat} id = {Arr._id} className = 'h-11 ml-2  mt-5 flex flex-row  '>
        <img className = 'h-9 w-9 mt-1 ml-2 rounded-full border border-black ' id = {Arr._id} src = {Arr.ProfilePhoto}/>
        <h1  className = 'font-bold  ml-2 mt-2' id = {Arr._id}   >{Arr.FullName}</h1>
        </div>
        
        )
    }
    // searching Function 
    let Search = (event) =>{
        var Value = event.target.value.toLowerCase()
        var SearchFound = [] 
        const Arr = UserArr
        for (let i = 0 ; i < Arr.length;i++){
            var Point = 0
            var Pos = 0
            var FetchValue = Arr[i].FullName.toLowerCase() 
            for (let j of FetchValue){
                if (j != Value[Pos]){
                    break
                }
                if (j == Value[Pos]){
                    Point++
                }
                Pos++
            }
            if (Point != 0){
                SearchFound.push(Arr[i])
            }
        }

        ChangeArr(SearchFound)
    }
    let OnClickFetch = async() =>{
        const FetchArr = await fetch('/api/Searchfeed') 
        const ResponseArr = await FetchArr.json()
        if (ResponseArr.status == true){
            ChangeUserArr(ResponseArr.Arr)
        }
        if (ResponseArr.status == false){
            alert('Something Went Wrong')
        }
    }
    let Backbutton = () =>{
        document.getElementById('Message').style.display = 'none'
        document.getElementById('Chat').style.display = 'flex'
    }
    let DisplayChat = () =>{
        document.getElementById('Message').style.display = 'flex'
        document.getElementById('Chat').style.display = 'none'
    }

    const PrintArr = (Arr) =>{
        const NavigateToMessage = async() =>{
            Router.push('/Chat/'+Arr.Room)
        }
       if (Arr != null){
        return(
            <div onClick = {NavigateToMessage} className = ' relative flex border-b mb-2 h-20 border-black flex-row'>
            <img className = 'w-14 h-14 ml-5 mt-2 rounded-full' src = {Arr.Profile}/>
            <h1 className = 'ml-5 mt-3 text-lg '>{Arr.FullName}</h1>
            <p className = 'absolute bottom-3 text-black left-24'>{Arr.Message}</p>
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
        <div id = 'Message' className = 'fixed hidden pl-11 top-14 w-screen h-screen bg-opacity-30  bg-black'>
        <div className = 'w-96 mt-11 flex flex-col rounded border border-black h-96 ml-96 bg-white  '>
        <div className = ' relative  flex flex-row w-96'>
        <button onClick = {Backbutton} className = 'top-0 left-4 text-lg w-14 h-9 border border-black rounded bg-black text-white hover:bg-white hover:text-black'> Back </button>
        <h1 className = 'ml-24 text-xl'>Message</h1>
        </div>
        <input onChange = {Search} onClick = {OnClickFetch} className = 'mt-2 w-80 h-11 text-lg pl-5 box-border ml-2 border-b border-black' type = 'text' placeholder = 'Search User'/>
        {SearchArr.map(SearchUser)}
        </div>
        
        </div>

        <div id = 'Chat' className = 'flex  flex-col rounded border border-black w-96 h-1/2 ml-96 mt-11 '>

        <div className = 'relative border-b border-black  w-96 '>
        <h1 className = 'font-Third text-2xl ml-11 mt-2'>Messages</h1>
        <button onClick = {DisplayChat}>
        <img  className = 'absolute top-2 right-5 w-7 h-7' src = 'CreateMessage.svg'/>
        </button>
        </div>

        {MessageArr.map(PrintArr)} 
        
        </div>


        </div>

    )
}
export default Message