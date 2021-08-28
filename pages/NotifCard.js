import { useEffect,useState } from "react"
import {useRouter} from 'next/router'
import Link from 'next/link'

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
  useEffect(()=>{
   ProfilePhotoData()
  })
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
  return (
      <div className = ' relative ml-96 mt-2 pt-1 pl-2 w-96  h-14   flex flex-row'  >
      <img onClick = {ProfileOpen} src = {ProfilePhoto} className = 'w-12 mr-2 h-12 rounded-full'  />
      <h2 className = 'text-sm w-60 ml-2 mt-2 '><strong >{props.FullName}</strong> {props.Message}</h2>
      <Link href = {'/Post/' + props.Post}><img   src = {props.Src} className = 'absolute right-0 top-0  ml-5 w-11 h-11'/></Link>
      </div>
  )
}
export default NotifCard