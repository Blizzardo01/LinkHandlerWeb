const http = require('http');
const fs = require('fs');
const { MongoClient, Collection } = require("mongodb");
const client = new MongoClient(CONNECTION_STRING);
const hostname = '127.0.0.1';
const port = 3000;


const server = http.createServer((req, res) => {
    let body = [];
    let exclude = [ "styles.css", "favicon.ico" ];
    let urlRequest = req.url.replace("/","");
    //let urlResponse = 
    //todo: cleanup bad requests

    // clean-up
    for (var i = 0; i < exclude.length; i++) {
        urlRequest = urlRequest.replace(exclude[i], "");
    }

    if ((urlRequest !== null && urlRequest.length !== 0) && ExistInSavedDb(urlRequest)) {
        console.log("Server Request: " + urlRequest);
        RedirectToNewPage(urlRequest, res);
    }

    req.on('error', (err) => {
        console.error(err);
    })
    .on('data', (dataRecieved) => {
        body.push(dataRecieved);
        URLredirect = guid();
        body.push("http://127.0.0.1:3000/" + URLredirect)
        body.push(URLredirect)
        console.log(`new data recieved!: ${body}`);
        var doc = CreateObj(body[0].toString(), body[1], body[2]);
        console.log("inserted: " + doc);

        async function addDoc() {
            await client.connect();
            client.db("LinkHandler").collection("URLS").insertOne(doc);
            console.log("added document");
        }
        addDoc();
    })
    .on('end', () => {

    });
    
    function CreateObj(regularURL, modifiedURL, redirectURL){
        var obj = { id: guid,
        url: regularURL,
        modurl: modifiedURL,
        specificdirect: redirectURL}

        return obj;
    }

    async function ExistInSavedDb(inputRequest) {
        var search = await QueryDatabase(inputRequest);

        if (search.specificdirect == inputRequest){
            console.log("file exists");
            return true;
        } else {
            return false;
        }
    }

    async function QueryDatabase(inputRequest) {
        var query = { specificdirect: inputRequest };
        await client.connect();
        var search = await client.db("LinkHandler").collection("URLS").findOne(query);
        client.close();

        return search;
    }

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4();
    }

    async function RedirectToNewPage(inputRequest, response) {
        // todo: Perform the following
        var redirect = await QueryDatabase(inputRequest);

        response.writeHead(301, {location: redirect.url
        });
        response.end();
    }
    
    fs.readFile('main.html', function(error, data) {
        if (error) {
            res.writeHead(404);
            res.write('Error: File Not Found');
        }
        else {
            res.write(data);
        }
        res.end();
    })
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    
});