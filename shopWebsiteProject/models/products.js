const products  = []

module.exports = class Product {
    constructor(t){//create an object based on this class where I can pass a title into the constructor
        this.title = t
    }
    //This is a function but no "function" keyword
    save(){//store products in an array and fetch it
        products.push(this)
    }

    static fetchAll(){//static = I can call this method directly on the class itself and not on an instantiated obj
        return products
    }
}