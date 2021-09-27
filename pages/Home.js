import Menu from './Menu'
import head from 'next/head'
import {useEffect,useState} from 'react'
import {useDispatch} from 'react-redux'
import {useRouter} from 'next/router'
import Card from './Card'
export async function getStaticProps() {
    const res = await fetch("http://localhost:3000/api/Feed");
    const json = await res.json();
    return {
      props: {
        data: json
      },
      revalidate: 1
    };
  }
let Home = ({data}) =>{
    const router = useRouter()
    const [ArrOfFeed,ChangeFeedArr] = useState(data.Arr)
    const Length = data.Arr.length 
    const dispatch = useDispatch()
    console.log(ArrOfFeed)
    // token Fetching 
    let Token = async()=>{
       // For Checking User Alreddy Login Or Not 
       const Request = await fetch('/api/Token',{
        method:'POST',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({Request:'Token'})
      })
      const Response = await Request.json() 
      if (Response.Email == undefined && Response.Password == undefined){
        router.push('/')
    }
  }
  const StatusChange = async(status) =>{
    // For Checking User Alreddy Login Or Not 
    const Request = await fetch('/api/TokenId',{
      method:'POST',
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({Request:'Token'})
    })
    const Response = await Request.json() 
    const SendStatus = await fetch('/api/Online',{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({id:Response.id,status:status})
    })
    const GetStatus = await SendStatus.json()
  }
    
    useEffect(()=>{
        let IconChange = {type:"Icon",Icon:'Home'}
        dispatch(IconChange)
        Token()
        StatusChange(true) 
        return () =>{
          StatusChange(false)
        }
        
    },[])
let MapAll = (Arr) =>{
  return (
    <Card id = {Arr._id} Image = {Arr.Image} Type = {Arr.Type} Email = {Arr.Email} FullName = {Arr.FullName} Desc = {Arr.Desc}/>
  )
}    
    return (
        <div>
        <head>
        <title>JhimBook</title>
        </head>
        <Menu/>
        <div className = 'mt-11 z-10'>
        {ArrOfFeed.map(MapAll)}
        </div>
        
        </div>
    )
}
export default Home