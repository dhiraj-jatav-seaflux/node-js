const fs =  require('fs')

const requestHandler = (req,res)=>{
    const url = req.url;
    const method = req.method;

    if(url ==='/'){
        res.write('<html>')
        res.write('<head><title>Node js</title></head>')
        res.write('<body><h1>Welcome to Node js</h1><form action="/message" method = "POST"><input type="text" name="message"/><button>Submit</button></form></body>')
        res.write('</html>')
        return res.end();
    }

    if(url === '/message' && method === 'POST'){
        const body = [];
        req.on('data',(chunk)=>{
            console.log(chunk);
            body.push(chunk);
        })
        
        return req.on('end',()=>{
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            fs.writeFileSync('message.txt',message);
            res.statusCode = 302;
            res.setHeader('Location','/');
            return res.end();
            
        })
    }
}

module.exports = requestHandler;

// exports.handler = requestHandler  This exports can also be used 

// module.exports = {
//     handler:requestHandler,
//     data:"Some hard coded data"
// }

// Both of this exports are valid and works fine  