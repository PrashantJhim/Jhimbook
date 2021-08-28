import {useEffect,useState} from 'react'
import Axios from 'axios'
import head from 'next/head'
import Menu from  './Menu'
import {useDispatch} from 'react-redux'
import {useRouter} from 'next/router'
let Create = () =>{
    const [UploadStatus,ChangeUploadStatus] = useState('Not Uploaded')

    const Router = useRouter()
    const dispatch = useDispatch()
    useEffect(()=>{
        let IconChange = {type:"Icon",Icon:'Create'}
        dispatch(IconChange)
    },[])

    // Feature To Show Input File 
    let FileUploadSelect = (event) =>{
        let Type = event.target.value 
        let Checked = event.target.checked 
        if (Checked == true){
            if (Type == 'Image'){
                document.getElementById('Video').style.display = 'none'
            }
            if (Type == 'Video'){
                document.getElementById('Image').style.display = 'none'
            } 
            document.getElementById(Type).style.display = 'block'
        }
        if (Checked == false){
            document.getElementById(Type).style.display = 'none'
        }
    }
    // This Part Is For Uploading Data To Cloudinary
    let ImgDetails = async(event) =>{
        const file = event.target.files[0]
        const MediaType = event.target.id

        ChangeUploadStatus('Uploading')

        let formData = new FormData()
        formData.append('file',file)
        formData.append('upload_preset','vngt5mgz')
        const resp = await Axios.post('https://api.cloudinary.com/v1_1/prashant-jhim/upload',formData)
        console.log(resp.data.secure_url)
        if (resp.data.public_id != undefined){
            ChangeUploadStatus('Uploaded')
            let Details = {
                type:'Upload',
                TypeOfMedia:MediaType,
                Tags: document.querySelector('#Tag').value,
                Desc : document.querySelector('#Desc').value,
                Img: resp.data.public_id,
                ImgSrc :resp.data.secure_url
            }
            dispatch(Details)
            
        }
        if (resp.data.public_id == undefined){
            alert('Something Goes Wrong')
        }
    }
    // Next Function 
    let NextPage = () =>{
        if (UploadStatus == 'Uploaded') {
            Router.push('/Create/Preview')
        }
        if (UploadStatus != 'Uploaded'){
            alert('Its Not Uploaded')
        }
        
    }
    return (
        <div className = 'flex flex-col'>
        <head>
        <title>
        JhimBook
        </title>
        </head>
        <Menu/>
        <div className = 'relative mt-11'><button onClick = {NextPage} className = 'hover:bg-white hover:text-black absolute top-0 right-11 text-white w-20 text-xl rounded bg-black border border-black'>Next</button></div>
        <div className = 'flex h-screen flex-row'>
        <div className = 'flex w-1/2 flex-col mt-2 bg-grey-600'>
        <h1 className = 'ml-5 text-5xl font-Secondary'>Create Post</h1>
        <h3 className = 'text-2xl ml-5 font-Secondary  text-green-600'>Status : {UploadStatus}</h3>
        <div className = ' w-screen mt-11   h-11 flex flex-row' ><input type = 'text' className = ' text-xl  ml-5 border rounded pl-2 w-40 border-black' id = "Tag" placeholder = 'Enter The Tag'/><p className = 'font-bold'></p></div>
        <textarea className = ' pt-2 pl-2 w-96 text-xl mt-5 ml-5 rounded h-40 border border-black' id = "Desc" placeholder = 'Enter The Description'/>
        
        <h2 className = 'text-3xl mt-2 ml-5 font-Secondary'>Select Any One</h2>
        <div className = 'flex flex-row'>
        <div className = 'flex flex-row mt-5 ml-5  h-6'>
        <input onChange = {FileUploadSelect}  type = 'checkbox' className = 'w-5 h-5' value = 'Image'/>
        <h3 className = 'font-Secondary text-2xl -mt-1 ml-2'>Image</h3>
        </div>
        <input id = 'Image' type = 'file' onChange = {ImgDetails} accept = 'image/*' className = 'hidden  mt-5 ml-5'/>
        </div>

        <div className = 'flex flex-row'>
        <div className = 'flex flex-row mt-5 ml-5  h-6'>
        <input  onChange = {FileUploadSelect}  type = 'checkbox' className = 'w-5 h-5' value = 'Video'/>
        <h3 className = 'font-Secondary text-2xl -mt-1 ml-2'>Video</h3>
        </div>
        <input id = 'Video' type = 'file' onChange = {ImgDetails} accept = 'video/*' className = ' hidden mt-5 ml-5'/>
        </div>

        </div>
        <img className = 'h-96' src = 'CreatePost.png'/>
        </div>
        </div>
    )
}
export default Create