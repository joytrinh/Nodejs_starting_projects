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
        return res.end();
    }   
    if(url === '/users'){
        res.write('<html>')
        res.write('<body><h1>List of users</h1><br /><ul><li>User 1</li></ul><br /><ul><li>User 2</li></ul><br /><ul><li>User 3</li></ul><br /><ul><li>User 4</li></ul><br /><ul><li>User 5</li></ul></body>')
        res.write('</html>')
        return res.end()
    }
    if(url === '/create-user' && method === 'POST'){
        const body = []
        req.on('data', chunk => {
            console.log(chunk)
            body.push(chunk)
        })
        return req.on('end',()=>{
            const parseBody = Buffer.concat(body).toString()
            username = parseBody.split('=')[1]
            fs.writeFile('usernames.txt', username, err =>{
                res.statusCode = 302
                res.setHeader('Location','/')
                return res.end()
            })
        })        
    }
    res.setHeader('Content-Type','text-html')
        res.write('<html>')
        res.write('<head><title>My First Page</title><head>')
        res.write('<body><h1>Hello world! Welcome to my first nodejs server</h1></body>')
        res.write('</html>')
        res.end()
}
exports.handler = requestHandler
exports.someText = username