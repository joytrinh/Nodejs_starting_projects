const path = require("path")
const express = require("express")
const rootDir = require("../util/path")
const router = express.Router()

router.get('/users',(req,res,next)=>{ // '/admin/users' we can omit /admin here
    res.sendFile(path.join(rootDir,'views','users.html'))//__dirname = current folder
})
router.post('/users',(req,res,next)=>{// '/admin/users' we can omit /admin here
//    console.log(req.body)
    res.redirect('/')
})
module.exports = router