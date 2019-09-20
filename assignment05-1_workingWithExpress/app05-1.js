const express = require("express")

const app = express()
/*
app.use((req,res,next)=>{
    console.log('This is my FIRST middleware')
    next()
})
app.use((req,res,next)=>{
    console.log('This is my SECOND middleware')
    
})
*/
app.use('/users',(req,res,next)=>{
    console.log('This is my FIRST middleware')
    res.send('<h1>This is the users page</h1>')
})
app.use('/',(req,res,next)=>{
    console.log('This is my FIRST middleware')
    res.send('<h1>This is my first express app</h1>')
})
app.listen(3000)