const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const ObjectId = require('mongodb').ObjectId;

const password = 'pJQp3zwuB2P8AqZF';
const { MongoClient, Collection } = require('mongodb');
const uri = "mongodb+srv://sujonali8276:pJQp3zwuB2P8AqZF@cluster0.ifk56.mongodb.net/mydb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


client.connect(err => {
    const collection = client.db("mydb").collection("products");
    console.log("Database Connected");

    // insert data in database.........
    app.post('/addProduct', (req, res) => {
        const product = req.body;
        collection.insertOne(product)
            .then(result => {
                res.redirect('/');
            })

    })


    // read data from database......
    app.get('/products', (req, res) => {
        collection.find({})
            .toArray((err, document) => {
                res.send(document);
            })
    })


    // update products from database......
    app.get('/updateProduct/:id', (req, res) => {
        collection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, document) => {
                res.send(document[0]);
            })
    })

    app.patch('/update/:id', (req, res) => {
        collection.updateOne({ _id: ObjectId(req.params.id) }, {
            $set: { price: req.body.price, quantity: req.body.quantity }
        })
            .then(result => res.send(result.modifiedCount > 0));
    })


    // delete data from database......
    app.delete('/delete/:id', (req, res) => {
        collection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0)
            })
    })


});

app.listen(3000);