const fs = require('fs')
const path = require('path')

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
)
module.exports = class Cart {
    static addProduct(id, productPrice){
        //Fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0}
            if (!err) {
                cart = JSON.parse(fileContent)
            }
            // Analyze the cart => Find existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id)
            if (!existingProductIndex) {//prevent the error price of undefined
                return
            }
            const existingProduct = cart.products[existingProductIndex]
            let updatedProduct
            if (existingProduct) {
                updatedProduct = { ...existingProduct}
                updatedProduct.qty++
                cart.products = [...cart.products]
                cart.products[existingProductIndex] = updatedProduct
            } else {
                updatedProduct = {id: id, qty: 1}
                cart.products = [...cart.products, updatedProduct]
            }
            cart.totalPrice = cart.totalPrice + +productPrice //add one more + to convert from a string to a number
            fs.writeFile(p, JSON.stringify(cart), err =>{
                console.log(err)
            })
        })

    }

    static deleteProduct(id, productPrice){
        fs.readFile(p, (err, fileContent) => {
            if(err){
                return
            }
            const updatedCart = {...JSON.parse(fileContent)}
            const product = updatedCart.products.find(prod => prod.id === id)
            if (!product) { //prevent the error price of undefined
                return
            }
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id)
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * product.qty
            fs.writeFile(p, JSON.stringify(updatedCart), err =>{
                console.log(err)
            })
        })
    }
    static getCart(cb){
        fs.readFile(p, (err, fileContent)=>{
            const cart = JSON.parse(fileContent)
            if (err) {
                cb(null)
            } else{
                cb(cart)
            }
        })
    }
}

/* we added a cart model which only holds static methods because we don't really create a cart 
that often, instead we just want to work with the data storage behind it.
It's not that good if we only work with files for data storage because accessing them is a bit slow
*/ 