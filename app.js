const http = require('http');
const fs = require('fs');
const { MongoClient, Collection } = require("mongodb");
const CONNECTION_STRING = "mongodb+srv://BMIUser:Xu8E+$*)kT%5B)fH!T@cluster0.um0g5.mongodb.net/test";
const client = new MongoClient(CONNECTION_STRING);
const hostname = '127.0.0.1';
const port = 3000;


const server = http.createServer((req, res) => {
    let body = [];
    let exclude = [ "styles.css", "favicon.ico" ];
    let urlRequest = req.url.replace("/","");
    
    if (urlRequest !== null && ExistInSavedDb(urlRequest)) {
        console.log("Server Request: " + urlRequest);
        RedirectToNewPage(urlRequest);
    }

    req.on('error', (err) => {
        console.error(err);
    })
    .on('data', (dataRecieved) => {
        body.push(dataRecieved);
        body.push(converter("http://127.0.0.1:3000/"))
        console.log(`new data recieved!: ${body}`);
        var doc = CreateObj(body[0].toString(), body[1]);
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
    
    function CreateObj(regularURL, modifiedURL){
        var obj = { id: guid,
        url: regularURL,
        modurl: modifiedURL}

        return obj;
    }

    function converter(url) {
        redirect = url + guid()
        return redirect

    }

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4();
    }

    function RedirectToNewPage(inputRequest) {
        // todo: Perform the following
        // 1. Find MongoDB record
        // 2. Redirect to New URL Path
    }

    function ExistInSavedDb(inputRequest) {
        // todo : perform the following
        // 1. return true / false if a record exists
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

//converts url
  /*  const grabbedURL = document.getElementsByName("normal_link").values;
    console.log(`URL Grabbed: ${grabbedURL}`);
}

    


main().catch(console.dir);*/