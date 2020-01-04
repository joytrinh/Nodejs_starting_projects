const fs = require('fs')
const path = require('path')
const p = path.join(path.dirname(process.mainModule.filename), 
        'data', 
        'products.json'
    )
const getProductsFromFile = cb => {
    
    fs.readFile(p,(err,fileContent) =>{
        if(err) {
            cb([])
        } else {
            cb(JSON.parse(fileContent))
        }   
    })
}
module.exports = class Product {
    constructor(t){//create an object based on this class where I can pass a title into the constructor
        this.title = t
    }
    //This is a function but no "function" keyword
    save(){//store products in an array and fetch it
        getProductsFromFile(products =>{
            products.push(this)
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err)
            })
        })
    }

    static fetchAll(cb){//static = I can call this method directly on the class itself and not on an instantiated obj
        getProductsFromFile(cb)
    }
}