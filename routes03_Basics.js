const fs = require('fs')
var username = ''
const requestHandler = (req,res)=>{
    const url = req.url
    const method = req.method
    if(url === '/'){
        res.write('<html>');
        res.write('<head><title>Enter username</title><head>');
        res.write('<body><form action="/create-user" method="POST"><input type="text" name="create-user"><button type="submit">Create User</button></form></body>');
        res.write('</html>');
        return res.end();//without "return" here, you cannot execute below codes because it doesn't matter that "if()", If you still have some "res.write" below, you should have "return"
    }   
    if(url === '/users'){
        res.write('<html>')
        res.write('<body><h1>List of users</h1> <ul><li>User 1</li></ul> <ul><li>User 2</li></ul> <ul><li>User 3</li></ul> <ul><li>User 4</li></ul> <ul><li>User 5</li></ul></body>')
        res.write('</html>')
        return res.end()
    }
    if(url === '/create-user' && method === 'POST'){
        const body = []//We create an array to store chunks after they come in
        req.on('data', chunk => {// request data is just a text
            console.log(chunk) //concat all data in the array to be a string
            body.push(chunk)
        })
        return req.on('end',()=>{
            const parseBody = Buffer.concat(body).toString()//create a new buffer on that string
            username = parseBody.split('=')[1]//username = whatever-the-user-entered, first element is username and the second element is the value
            fs.writeFile('usernames.txt', username, err =>{
                res.statusCode = 302//redirect to status code
                res.setHeader('Location','/')//tell the browser where to redirect too by sending the Location of the header
                return res.end()
            })
        })        
    }
    res.setHeader('Content-Type','text-html')//I would send some html codes
        //write a response
        res.write('<html>')
        res.write('<head><title>My First Page</title><head>')
        res.write('<body><h1>Hello world! Welcome to my first nodejs server</h1></body>')
        res.write('</html>')
        res.end()
}
exports.handler = requestHandler
exports.someText = username