const express = require ('express');
const serverless = require('serverless-http');
const app = express();
const path = require('path')
const api = require('./ssApi')
const { v4: uuidv4 } = require('uuid');

//ids
const ssSessionIdNamespace = uuidv4();
const ssUserId = uuidv4();
let ssPageLoad = uuidv4();;

//middleware
app.set('view engine', 'ejs');
app.use(express.static('src'));

app.get('/query',(req, res)=>{
    res.json({message: "api is working"})
    // api.callSearch(req.query,ssSessionIdNamespace,ssUserId,ssPageLoad)
    //     .then( result => {
    //         res.json(result.data)
    //     })
    //     .catch( err => res.json({err}) )
})

app.get('/*',(req, res)=>{
    ssPageLoad = uuidv4();
    res.sendFile(path.join(__dirname, "../src/index.html"))
})

//local server
// app.listen(3000, ()=>{
//     console.log("server is running on port 3000");
// })

serverless
const handler = serverless(app);
module.exports.handler = async (event, context) => {
    return await handler(event, context);
};