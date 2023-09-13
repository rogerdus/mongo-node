const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const Grid = require('gridfs-stream');
const path = require('path');
Grid.mongo = mongoose.mongo;

const app = express();

const mongoURI = 'mongodb://10.210.6.11/newdb';
const conn =  mongoose.createConnection(mongoURI);


//initialize GridFs

let gfs;

conn.once('open', () => {
    gfs = new Grid(conn.db);
   // gfs.collection('uploads');
});



// Middleware for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'upload.html'));
  });
  
///_API Endpoint 

app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file);
    var part = req.file;
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    var writeStream = gfs.createWriteStream({
        filename: part.filename,
        mode: 'w',
        content_type:part.mimetype
     });

    writeStream.write(req.file.buffer);

    writeStream.end(() => {
        return res.status(200).send('File uploaded successfully');
    });
});




const port = process.env.PORT || 3000;

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});


