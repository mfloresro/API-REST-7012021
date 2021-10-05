// imports
const express = require('express');
const logger = require('morgan');
const mongodb = require('mongodb');
const mongo = mongodb.MongoClient;
const bodyParser = require('body-parser');
const uri = 'mongodb://localhost:27017';
const app = express();

// middlewares
app.use(logger('dev'));
app.use(bodyParser.json());

// conectar a la base de datos
mongo.connect(uri, (err, con) => {

    // collection
    const estudiantesCollection = con.db('701nosql').collection('estudiantes');

    // en caso de error finalizar
    if(err){
        console.log(`No se puede conectar con la uri ${uri}`);
        process.exit(1);
    }

    app.get('/estudiantes',(req, res) => {
        estudiantesCollection.find({}).toArray((err, estudiantes) => {
            if(err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.send(JSON.stringify(estudiantes));
        });
    });

    app.post('/estudiantes',(req, res) => {
        estudiantesCollection.insert(req.body, (err, respuesta) => {
            if(err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.send(JSON.stringify(respuesta));
        });
    });

    app.put('/estudiantes/:id', (req, res) => {
        estudiantesCollection.update({ _id: req.params.id }, { $set: req.body }, (err, respuesta) => {
            if(err){
                return res.sendStatus(500);
            }
            res.send(JSON.stringify(respuesta, null, 2));
        });
    });

    app.delete('/estudiantes/:id', (req, res) => {
        const _id = req.params.id;
        estudiantesCollection.deleteOne({ _id }, (err, respuesta) => {
            if(err){
                return res.sendStatus(500);
            }
            res.send(JSON.stringify(respuesta));
        });
    });

    app.listen(3000);

    console.log('Listening on http://localhost:3000');

});