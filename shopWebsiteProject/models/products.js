const fs = require('fs')
const path = require('path')
const cart = require('./cart')

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
    constructor(id, title, imageURL, price, description){//create an object based on this class where I can pass a title into the constructor
        this.id = id
        this.title = title
        this.imageURL = imageURL
        this.price = price
        this.description = description        
    }
    //This is a function but no "function" keyword
    save(){//store products in an array and fetch it
        getProductsFromFile(products =>{
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id)
                const updatedProducts = [...products]
                updatedProducts[existingProductIndex] = this
                fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                    console.log(err)
                })
            } else {
                this.id = Math.floor(Math.random() * 999).toString()
                products.push(this)
                fs.writeFile(p, JSON.stringify(products), err => {
                    console.log(err)
                })
            }
        })
    }
    static deleteById(id){
        getProductsFromFile(products =>{
            const product = products.find(prod => prod.id === id)
            const updatedProducts = products.filter(prod => prod.id !== id)//We make an array of all products which are not deleted product
            fs.writeFile(p, JSON.stringify(updatedProducts), err =>{
                if (!err) {
                    cart.deleteProduct(id, product.price)    
                }
            })
        })
    }
    static fetchAll(cb){//static = I can call this method directly on the class itself and not on an instantiated obj
        getProductsFromFile(cb)
    }

    static findById (id, cb){
        getProductsFromFile(products =>{
            const product = products.find(p => p.id === id)
            cb(product)
        })
    }
}