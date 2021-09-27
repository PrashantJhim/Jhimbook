import { combineReducers, createStore } from 'redux'

// For Otp Purpose 
let Initial = {
    Page:undefined,
    Otp:undefined,
    Data:undefined
}
let OtpReducer = (state=Initial,action) =>{
    switch(action.type){
        case 'Otp':return{
            ...state,
            Page:action.Page,
            Otp:action.Otp,
            Data:action.Data
        }
        default:return state
    }
}
// For Email Purpose 
let IntialEmail = {
    Email:undefined
}
let EmailReducer = (state=IntialEmail,action) =>{
    switch(action.type){
        case 'Email':return{
            ...state,
            Email:action.Email
        }
        default:return state
    }
}

let InitialIcon = {Icon:undefined} 

let IconSelector = (state=InitialIcon,action)=>{
    switch(action.type){
        case 'Icon':return{
            ...state,
            Icon:action.Icon
        }
        default:return state
    }
}
let InitailImgDetails = {
    TypeOfMedia:undefined,
    Tags: undefined,
    Desc : undefined,
    Img: undefined,
    ImgSrc : undefined
}
let ImgUploadReducer = (state=InitailImgDetails,action) =>{
    switch(action.type){
        case "Upload":return{
            ...state,
            TypeOfMedia:action.TypeOfMedia,
            Tags:action.Tags,
            Desc:action.Desc,
            Img:action.Img,
            ImgSrc:action.ImgSrc
        }
        default:return state
    }
}
const InitalFeed = {arr:[]}
let FeedChanger = (state=InitalFeed,action) =>{
    switch(action.type){
        case "Change":return {
            ...state,
            arr:action.arr

        }
        default:return state
    }
}

let MainStore = combineReducers({
    Otp:OtpReducer,
    Email:EmailReducer,
    Icon:IconSelector,
    Upload:ImgUploadReducer,
    Feed:FeedChanger
})
let Store = createStore(MainStore)
export default Store 