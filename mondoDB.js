

var grabbedURL = 

function addDoc() {
    const doc = {"url": grabbedURL, "shortenedUrl": shortUrl};
    await client.connect();
    const result = await Collection.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
    await client.close();
}