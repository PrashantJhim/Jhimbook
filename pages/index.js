import Link from 'next/link'
import { useRouter } from 'next/router'
import {useEffect} from 'react'
import { useDispatch } from 'react-redux'
export default function Home() {
  let dispatch = useDispatch()
  const ImgSrc = 'https://www.pexels.com/photo/4350767/download/'
  const router = useRouter()
  useEffect(async()=>{
    // For Checking User Alreddy Login Or Not 
    const Request = await fetch('/api/Token',{
      method:'POST',
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({Request:'Token'})
    })
    const Response = await Request.json() 
    if (Response.Email != undefined && Response.Password != undefined){
      router.push('/Home')
    }
  },[])
    // ChangePass Function 
    let ChangePass = () =>{
        const Email = document.getElementById('Email').value 
        let DataToBeSent = {type:"Email",Email:Email}
        dispatch(DataToBeSent)
        router.push('/ChangePass')
    }
  // This Fetch Function Is For Checking Whether Login Credentials Are Right
  let Fetch = async() =>{
    const Email = document.getElementById('Email').value
    const Password = document.getElementById('Password').value
    let Request = await fetch('/api/Login',{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({Email:Email,Password:Password})
    })
    let Response = await Request.json() 
    if (Response.status == true){
      router.push('/Home')
    }
    if (Response.status == false){
      alert('Something Went Wrong')
    }
  }
  // This Function Is For Showing Password 
  let ShowPassword = (event) =>{
    var Checked = event.target.checked 
    if (Checked == true){
      document.getElementById('Password').type = 'text'
    }
    if (Checked == false){
      document.getElementById('Password').type = 'password'
    }
  }
  return (
    <div className = 'flex flex-row'>
    <img src = {ImgSrc} className = ' object-fill h-screen w-2/5 '/>
   <button className = 'fixed top-5 right-5 text-2xl hover:text-primary'><Link href = '/Register' >Register</Link> </button>
    <div className = "flex flex-col w-1/2 pt-9 pl-24">
    <h1 className = 'text-black mt-5 text-4xl mb-16 font-Main'>Login</h1>
    <h2 className = 'text-xl'>Email</h2>
    <input id = 'Email' className = 'border-black border-b text-lg w-72 h-11  pl-5' type = 'text' placeholder = 'Enter The Email'/>
    <h2 className = 'mt-5 text-xl'>Password</h2>
    <input id = 'Password' className = 'border-black text-lg border-b w-72 h-11  pl-5' type = 'password' placeholder = 'Enter The Password'/>
    <button className = 'text-md w-1/4 hover:text-primary mt-5' onClick = {ChangePass}>Forgot Password ?</button>
    <div className = 'flex flex-row mt-5 h-11'><input type = 'checkbox' className = ' w-9 h-9' onChange = {ShowPassword}/><h3 className ='text-xl mt-1 ml-2'>Show Password</h3></div>
    <button className = '   border bg-Insta text-white w-1/6 h-11 rounded-lg text-lg mt-5 hover:border-black hover:bg-white hover:text-black' onClick = {Fetch}>Login</button>
    </div>
    </div>
  )
}
