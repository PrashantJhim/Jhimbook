import {useState,useEffect} from 'react'
import {useRouter} from 'next/router'
import {useSelector} from 'react-redux'
import Link from 'next/link'

 let Menu = (props) =>{
    const Router = useRouter()
    const IconSelected = useSelector(state=>state.Icon)
    const [UserArr,ChangeUserArr] = useState([])
    const [SearchArr,ChangeArr] = useState([])
    // for Icon Darking 
    let [CreateIcon,ChangeCreate] = useState('/Create.svg')
    let [HomeIcon,ChangeHome] = useState('/Home.svg')
    let [MessageIcon,ChangeMessage] = useState('/Message.svg')
    let [LikeIcon,ChangeLike] = useState('/Like.svg')
    const [ProfilePhoto,ChangeProfilePhoto] = useState('https://res.cloudinary.com/prashant-jhim/image/upload/skkwmdf0v7vxre2hxzba')
    let DoneFirst = async() =>{
        // for getting token 
        const data = await fetch('/api/Token',{
            method:"POST",
            headers:{"Content-Type":"application/json"}
        })
        const datass = await data.json() 
        // For Fetching Profile Photo 
        const ProfileImg = await fetch('/api/ProfilePhoto',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({Email:datass.Email})
        })
        const Photo = await ProfileImg.json()
        ChangeProfilePhoto(Photo.Src)
    }
    let IconCheck = async() =>{
        const Icon = IconSelected.Icon 
        const Id = props.id 
        const RequestId = await fetch('/api/TokenId',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({Request:'Token'})
        })
        const ResponseId = await RequestId.json() 
        const TokenId = ResponseId.id
        if (Icon == 'Profile' && TokenId == Id ){
            document.getElementById('/Profile').style.border = '1px solid black'
            ChangeCreate('/Create.svg')
            ChangeHome('/Home.svg')
            ChangeMessage('/Message.svg')
            ChangeLike('/Like.svg')
        }
    }
    // useEffect for Darking The Selected Icon 
    useEffect(()=>{
        IconCheck()
        DoneFirst()
    })
    // Click Function for Going To Profile 
    let ProfileShow = async(event) =>{
        const RequestId = await fetch('/api/TokenId',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({Request:'Token'})
        })
        const ResponseId = await RequestId.json() 
        if (ResponseId.id != undefined){
            const RealUser = ResponseId.id
            const CardUser = event.target.id
        if (RealUser == CardUser){
            Router.push('/Profile/'+CardUser)
        }
        if (RealUser != CardUser){
            Router.push('/Profile/' + CardUser)
        }
        }
        if (ResponseId.id == undefined){
            Router.push("/")
        }
        
    }
   // Search User Function 
   let SearchUser = (Arr) =>{
        
    return (
        <Link href = {'/Profile/'+Arr._id}>
        <a>
        <div className = 'h-11 flex flex-row  '>
        <img className = 'h-9 w-9 mt-1 ml-2 rounded-full border border-black ' id = {Arr._id} onClick = {ProfileShow} src = {Arr.ProfilePhoto}/>
        <h1  className = 'font-bold  ml-2 mt-2' id = {Arr._id}   >{Arr.FullName}</h1>
        </div>
        </a>
        </Link>
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
        if (SearchFound.length == 0){
            document.getElementById('SearchBar').style.border = '0px'
        }
        if (SearchFound.length != 0){
            document.getElementById('SearchBar').style.border = '1px solid black'
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
    // Navigation Function 
    let Navigate = (event) =>{
        const Page = event.target.id 
        Router.push(Page)
    }
    let ProfilePhotoOption = () =>{
        document.getElementById('ProfileButton').style.display = 'flex'
        document.getElementById('/Profile').style.display = 'none'
        document.getElementById('/Profile2').style.display = 'block'
    }
    let CloseProfilePhotoOption = () =>{
        document.getElementById('ProfileButton').style.display = 'none'
        document.getElementById('/Profile').style.display = 'block'
        document.getElementById('/Profile2').style.display = 'none'
    }
    let GoToProfilePage = async() =>{
        const RequestId = await fetch('/api/TokenId',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({Request:'Token'})
        })
        const ResponseId = await RequestId.json() 
        Router.push('/Profile/'+ResponseId.id)
    }
    // Logout 
    let Logout = async() =>{
        const LogoutReq = await fetch('/api/Logout')
        const Response = await LogoutReq.json() 
        if (Response.status == true){
            Router.push('/')
        }
    }
    return (
        <div className = 'h-11 z-20  w-screen'>
        <div className = 'flex flex-row w-screen  h-14 border-b border-black fixed top-0 bg-white'>
        <h1 className = 'text-4xl font-Secondary w-2/5 pt-2 pl-5 '>JhimBook</h1>
        <div className = 'flex flex-col h-screen'>
        <input onChange = {Search} onClick = {OnClickFetch} className = 'text-sm border border-black rounded w-36 h-9 pl-2 mt-2' type = 'text' placeholder = 'Search People'/>
        <div id = 'SearchBar' className = ' mt-4 bg-white  rounded h-auto w-80 -ml-11 '>
        {SearchArr.map(SearchUser)}

        </div>
        </div>
        <div className = 'flex flex-row h-14 w-2/5 bg-white border-b border-black pt-3 fixed top-0 right-0'>
        <img onClick = {Navigate} id = '/Create' className = ' mt-0 ml-5 h-7'  src = {CreateIcon}/>
        <img onClick = {Navigate} id = '/Home' className = 'ml-5 h-7'  src = {HomeIcon}/>
        <img onClick = {Navigate} id = "/Message" className = 'ml-5 h-7'  src = {MessageIcon}/>
        <img onClick = {Navigate} id = "/Like" className = 'ml-5 h-8' src = {LikeIcon}/>
        <div className = 'flex flex-col'>
        <img  src = {ProfilePhoto}  id = '/Profile' onClick = {ProfilePhotoOption} className = 'h-7  ml-5 w-7 rounded-full '/>
        <img  src = {ProfilePhoto}  id = '/Profile2' onClick = {CloseProfilePhotoOption} className = ' hidden h-7 border border-black ml-5 w-7 rounded-full '/>
        <div id = 'ProfileButton' className = ' hidden -ml-2 mt-5 w-28 h-28 flex flex-col bg-white border border-black rounded'>
        <button className = 'font-Secondary hover:text-red-600 text-lg border-b border-black' onClick = {GoToProfilePage}>View Profile</button>
        <button className = 'font-Secondary hover:text-red-600 text-lg border-b border-black'>Setting</button>
        <button className = 'font-Secondary text-red-600 text-lg' onClick = {Logout}>logout</button>
        </div>
        </div>
        </div>
        </div>
        
    
        </div>
    )
}
export default Menu