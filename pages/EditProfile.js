import {useState,useEffect} from 'react'
import {useRouter} from 'next/router'
import { useDispatch } from 'react-redux'
import Axios from 'axios'
import {head} from 'next/head'

let Edit = () =>{
    const dispatch = useDispatch()
    const Router = useRouter()
    const [ProfilePhoto,ChangePhoto] = useState('https://www.pexels.com/photo/8692663/download/')
    const [FullName,ChangeFullName] = useState('Loading...')
    const [Email,ChangeEmail] = useState('Loading...')
    const [Password,ChangePassword] = useState('Loading...')
    const [Bio,ChangeBio] = useState('Loading...')
    
    let FetchDetails = async() =>{
         // For Checking User Alreddy Login Or Not 
       const Request = await fetch('/api/Token',{
        method:'POST',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({Request:'Token'})
      })
      const Response = await Request.json() 
      if (Response.Email == undefined && Response.Password == undefined){
          Router.push('/')
      } 
      else{
          ChangeFullName(Response.FullName)
          ChangeEmail(Response.Email)
          ChangePassword(Response.Password)
          
      }
    }
    // This Part Is For Uploading Data To Cloudinary
    let ImgDetails = async(event) =>{
        const file = event.target.files[0]
        const MediaType = event.target.id

        let formData = new FormData()
        formData.append('file',file)
        formData.append('upload_preset','vngt5mgz')
        const resp = await Axios.post('https://api.cloudinary.com/v1_1/prashant-jhim/upload',formData)
       ChangePhoto(resp.data.secure_url)
        if (resp.data.public_id == undefined){
            alert('Something Goes Wrong')
        }
    }
    useEffect(()=>{
        if (FullName == 'Loading...' && Password == 'Loading...'){
            FetchDetails()
        }
    })
    let Back = () =>{
        Router.push('/Home')
    }
    let Save = async() =>{
        // Otp
        const Request = await fetch("/api/Otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Email:document.getElementById('Email').value }),
          });
        const Response = await Request.json();
        const EncrptOtp = Response.Otp;
        const Details = {
            ProfilePhoto:ProfilePhoto,
            Email:document.getElementById('Email').value,
            FullName:document.getElementById('FullName').value,
            Password:document.getElementById('Password').value
        }
        const Send = {
            type:'Otp',
            Otp:EncrptOtp,
            Data:Details,
            Page:'/EditProfile'
        }

        dispatch(Send)
        Router.push('/Otp')
        
        
    }
    return (
        <div className = 'flex flex-row'>
        <head>
        <title>Edit Profile</title>
        </head>
        <div className = 'relative  mt-11 ml-11 w-96 h-96'>
        <img src = {ProfilePhoto} className = ' rounded-full   w-80 h-80'/>
        <input onChange = {ImgDetails} type = 'file' className = 'absolute bottom-5 left-24'/>
        </div>
        <div className = 'h-screen  flex flex-col w-1/2 border-l border-black'>
        <div className = 'fixed w-60  top-5 right-0'>
        <button onClick = {Save} className = 'bg-Insta hover:bg-white hover:text-black hover:border-black  text-xl text-white border rounded w-20 h-11'>Save</button>
        <button onClick = {Back} className = 'bg-Insta hover:bg-white hover:text-black  hover:border-black ml-5 text-xl text-white border rounded w-20 h-11'>Cancel</button>
        </div>
        <h1 className = 'text-4xl font-Secondary mt-5 ml-11'>Edit Profile</h1>
        <h1  className = 'text-3xl font-Third mt-5 ml-5'>FullName</h1>
        <input id = 'FullName' type = 'text' className = ' bg-white w-96 h-11 ml-5 text-2xl border-b border-black' defaultValue =  {FullName}/>
        <h1 className = 'text-3xl font-Third  mt-5 ml-5'>Email</h1>
        <input id = 'Email' type = 'text' className = 'w-96 bg-white  h-11 ml-5 text-2xl border-b border-black' disabled defaultValue = {Email}/>
        <h1 className = 'text-3xl font-Third mt-5 ml-5'>Password</h1>
        <input id = 'Password' type = 'text' className = 'w-96 h-11 ml-5 text-2xl border-b border-black' defaultValue = {Password}/>
        <h1 className = 'text-3xl font-Third mt-5 ml-5'>Bio</h1>
        <textarea id = 'Bio' className = ' h-60 mb-5 rounded w-96 border border-black text-xl pl-3 pt-2 ml-5' defaultValue = {Bio}/>
        </div>
        
        
        </div>
    )
}
export default Edit