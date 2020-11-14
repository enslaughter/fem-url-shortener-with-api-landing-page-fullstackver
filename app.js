const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

const convertedURLS = [];

const{
    PORT = 3000
} = process.env

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("index", {urls: convertedURLS});
})

app.post("/", function(req, res){
    
    const url = "https://api.shrtco.de/v2/shorten?url="+req.body.url;
    https.get(url, function(response){
        response.on("data", function(data){
            const urlData = JSON.parse(data);

            if(urlData.ok == true){
                const urlInfo = {
                    original_url: urlData.result.original_link,
                    short_url: urlData.result.short_link
                };
    
                convertedURLS.push(urlInfo);
                console.log(convertedURLS);
            } else {
                console.log(urlData);
            } 
            
        });

        response.on("end", function(){
            res.redirect("/");
        })
    });
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));