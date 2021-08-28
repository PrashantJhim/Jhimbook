import {useSelector,useDispatch} from 'react-redux'
import {useState} from 'react'
import {useRouter} from 'next/router'
import ReactPlayer from 'react-player'
import Menu from '../Menu'
let Preview = () =>{
    const Router = useRouter()
    const dispatch = useDispatch()
    const Details = useSelector(state=>state.Upload)
    console.log(Details)
    let CancelButton = () =>{
        Router.push('/Create')
    }
    // Uploading Video Or Picture 
    let Upload = async() =>{
        const data = await fetch('/api/Token',{
            method:"POST",
            headers:{"Content-Type":"application/json"}
        })
        const datass = await data.json() 
            let DataForUp = {
                Type:Details.TypeOfMedia,
                Email:datass.Email,
                FullName:datass.FullName,
                Image:Details.ImgSrc,
                Likes:0,
                Liked:[],
                Tag:Details.Tags,
                Desc: Details.Desc
            }
           
               console.log(DataForUp)
            const Update = await fetch("/api/AddImg",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(DataForUp)
            })
            const Result = await Update.json()
            if (Result.status == true){
                alert('Uploaded')
                Router.push('/Home')

            }
           
           
        
    }
    let PreviewMedia = () =>{
        if (Details.TypeOfMedia == 'Image') {
            return(
                <img className = 'mt-5 ml-24 w-80 border border-black rounded ' src = {Details.ImgSrc}/>
            )
        }
        if (Details.TypeOfMedia == 'Video'){
            return (
                <div  className = 'mt-5 ml-24 w-96 border border-black rounded '><ReactPlayer controls height = '385px' width = '100%' url = {Details.ImgSrc}/></div>
            )
        }
        else{
            return(
                <div><h1>Loading</h1></div>
            )
        }
    }
    return(
        <div className = 'flex flex-col'>
        <div className = 'relative mt-5'>
        <button onClick = {CancelButton} className = ' hover:bg-white hover:text-black bg-black w-24 absolute top-0 left-5 h-9 text-lg text-white border border-black rounded'>Cancel</button>
        <button onClick = {Upload} className = ' hover:bg-white hover:text-black bg-black w-24 absolute top-0 right-5 h-9 text-lg text-white border border-black rounded'>Upload</button>
        </div>
        <div className = 'flex flex-col pl-52'>
        <h1 className = 'font-Secondary text-4xl mt-5 ml-24'>Details Of Post</h1>
        <h2 className = 'font-Secondary mt-2 ml-24  text-2xl'>Tag : <strong>{Details.Tags}</strong></h2> 
        <h2 className = 'font-Secondary ml-24  text-2xl '>Desc : <strong>{Details.Desc}</strong></h2>
        <PreviewMedia/>
        
        </div>
        </div>
    )
}
export default Preview