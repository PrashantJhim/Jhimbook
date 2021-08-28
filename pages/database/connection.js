const mongoose = require('mongoose') 
mongoose.connect("mongodb://localhost:27017/NewDataBase", { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => {
        console.log('Connected')
    }
).catch((error) => {
    console.log(error)
})
