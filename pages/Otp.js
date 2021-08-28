import { useSelector } from 'react-redux'
import {useState,useEffect} from 'react'
import { useRouter } from 'next/router'
const Secure = require('bcryptjs')
let Otp = () =>{
    let Router = useRouter()
    let Data = useSelector(state=>state.Otp)
    let UserDetails = Data.Data
    let [Seconds,ChangeSeconds] = useState(90)
    
    useEffect(()=>{
        if (Data.Otp == undefined){
            Router.push('/')
        }
    })
    
    if (Seconds > 0) {
        setTimeout(() =>{ ChangeSeconds(Seconds- 1)
            if (Seconds == 1){
                document.querySelector('#Submitbutton').disabled = true;
               
            }
            
        }
        , 1000);
    }
   let Back = () =>{
       const BackPage = Data.Page 
       Router.push(BackPage)
   }
   let CheckOtp = async() =>{
       const EnterOtp = String(document.getElementById('Otp').value)
       const Compare = await Secure.compare(EnterOtp,Data.Otp)
       if (Compare == true){
           if (Data.Page == '/Register'){
            const Request = await fetch('/api/Register',{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(UserDetails)
            })
            const Response = await Request.json() 
            if (Response.status == true){
                Router.push('/Home')
            }
            if (Response.status == false){
                alert('Something Went Wrong') 
                Router.push('/Register')
            }
           }
           if (Data.Page == '/ChangePass'){
               const Req = await fetch('/api/ChangePass',{
                   method:"POST",
                   headers:{"Content-Type":"application/json"},
                   body:JSON.stringify(UserDetails)
               })
               const Res = await Req.json() 
               if (Res.status == true){
                   Router.push('/Home')
               }
               if (Res.status == false){
                   Router.push('/Register')
               }
           }
           if (Data.Page == '/EditProfile'){
               const Req = await fetch('/api/ChangeData',{
                   method:"POST",
                   headers:{"Content-Type":"application/json"},
                   body:JSON.stringify(UserDetails)
               })
               const Res = await Req.json()
               console.log(Res)
               if (Res.status == true){
                Router.push('/Home')
            }
               if (Res.status == false){
                Router.push('/Register')
            }
           }
       }
       if (Compare == false){
           alert('Wrong Otp')
       }

   }
    return (
        <div>
        <div className = 'flex flex-col mt-11 ml-24 pl-9 pt-5 border border-black w-96 h-96 rounded '>
        <h2 className = 'font-Secondary text-5xl mt-2 ml-5 mb-2' >Enter The Otp </h2>
        <p className = 'text-lg ml-5 mb-2'>Hi <strong>{UserDetails.FullName}</strong></p>
        <p className = 'text-sm ml-5'>Otp is Sent To <strong>{UserDetails.Email}</strong></p>
        <p className = 'text-xl ml-5 mt-5'>Time Remaining <strong>{Seconds} Sec</strong></p>
        <input id = 'Otp' className = 'border-b pl-5 border-black w-60 ml-5 h-11 mt-5 mb-11 text-lg' type = 'text' placeholder ='Enter The OTP'/>
        <div className = 'flex flex-row ml-5'>
        <button className = 'border border-black bg-black text-white w-24 h-9 text-xl rounded mr-5 hover:bg-white hover:text-black' id = 'Submitbutton' onClick = {CheckOtp}>Submit</button>
        <button className = 'border border-black bg-black text-white w-24 h-9 text-xl rounded hover:bg-white hover:text-black' onClick = {Back}>Back</button>
        </div>
        </div>
        </div>
    )
}
export default Otp 