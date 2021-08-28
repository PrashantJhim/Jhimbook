import { useRouter } from 'next/router'
import { useEffect , useState} from 'react'
import {useSelector,useDispatch} from 'react-redux'


let ChangePassword = () =>{
    const dispatch = useDispatch()
    const Router = useRouter()
    const [Match,ChangeMatch] = useState(false)
    const UserEmail = useSelector(state=>state.Email)
    useEffect(()=>{
        if (UserEmail.Email == undefined){
            Router.push('/')
        }
    })
    const router = useRouter()
    // Back Function to Router 
    let Back = () =>{
        router.push('/')
    }
    let MatchPassword = () =>{
        const Pass1 = document.getElementById('Pass1').value 
        const Pass2 = document.getElementById('Pass2').value 
        if (Pass1 == Pass2){
            ChangeMatch(true)
            document.getElementById('Match').innerHTML = 'true'
            document.getElementById('Match').style.color = 'green'
        }
        if (Pass1 != Pass2){
            ChangeMatch(false)
            document.getElementById('Match').innerHTML = 'false'
            document.getElementById('Match').style.color = 'crimson'
        }
    }
    
    let ShowPassword = (event) =>{
        const Checked = event.target.checked 
        if (Checked == true){
            document.getElementById('Pass1').type = 'text' 
            document.getElementById('Pass2').type = 'text' 
        }
        if (Checked == false){
            document.getElementById('Pass1').type = 'password' 
            document.getElementById('Pass2').type = 'password' 
        }
         
    }
    let ChangePassword = async() =>{
        // Otp
        const Request = await fetch("/api/Otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Email: UserEmail.Email }),
          });
        const Response = await Request.json();
        const EncrptOtp = Response.Otp;
        // For FullNAme 
        const Req = await fetch('/api/GetFullName',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({Email:UserEmail.Email})
        })
        const Res = await Req.json() 
        const FullName = Res.FullName 
        if (Res.status == true){
            const NewPassword = document.getElementById('Pass1').value
        let Details = {type:"Otp",Otp:EncrptOtp,Data:{FullName:FullName,Email:UserEmail.Email,Password:NewPassword},Page: "/ChangePass"}
        dispatch(Details)
        Router.push('/Otp')
        
        }
        else{
            alert('Something Went Wrong')
             Router.push('/')
        }
        }

    return (
        <div className = 'h-screen bg-white'>
        <div className = ' pl-8  pt-5 border border-black bg-gray-50 flex flex-col  h-80 w-80 absolute top-24 left-1/3 rounded drop-shadow-xl relative'>
        <h1 className = 'font-Secondary ml-5 mt-2 text-4xl mb-5'>Change Password</h1>
        <input id = 'Pass1' type = 'password' placeholder = 'Enter The Password' className = 'ml-2 text-secondary bg-transparent pl-5 w-56 border-black h-9 border-b'/>
        <input id = 'Pass2' onChange = {MatchPassword} type = 'password' placeholder = 'Confirm The Password' className = ' mt-5 ml-2 text bg-transparent pl-5 w-56 border-black h-9 border-b'/>
        
        <p className = "text-sm mt-2 ml-5">Matched : <strong id = 'Match'></strong></p>
        <div className = 'flex flex-row h-11 '><input className = 'h-5 mt-2 w-9' type = 'checkbox' onChange = {ShowPassword} /><h2 className ='mt-2' >Show Password</h2></div>
        <div className = 'flex flex-row mt-2'> <button className = 'border border-black bg-black text-white ml-5 text-xl rounded w-24 h-9 hover:bg-white hover:text-black' onClick = {ChangePassword}>Submit</button> <button className = 'border border-black ml-5 bg-black text-white text-xl rounded w-24 h-9 hover:bg-white hover:text-black' onClick = {Back}>Back</button> </div>
        </div>
        
        </div>
    )
}
export default ChangePassword