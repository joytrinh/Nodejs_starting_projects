const fs = require('fs')
const path = require('path')

module.exports = class Product {
    constructor(t){//create an object based on this class where I can pass a title into the constructor
        this.title = t
    }
    //This is a function but no "function" keyword
    save(){//store products in an array and fetch it
        const p = path.join(path.dirname(process.mainModule.filename), 
        'data', 
        'products.json'
        ) //'data' is the name of a folder, 'products.json' we will store product in this file

        fs.readFile(p,(err, fileContent) => {
            let products = []
            if(!err){
                products = JSON.parse(fileContent)
            }
            products.push(this) //this = class Product
        })

        fs.writeFile(p, JSON.stringify(products), (err) => {
            console.log(err)
        })
    }

    static fetchAll(cb){//static = I can call this method directly on the class itself and not on an instantiated obj
        const p = path.join(path.dirname(process.mainModule.filename), 
        'data', 
        'products.json'
        )
        fs.readFile(p,(err,fileContent) =>{
            if(err) cb([]) // we do not need an "else" because after return [], it will stop execution
            cb(JSON.parse(fileContent))
        })
    }
}