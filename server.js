const express = require('express');
const path = require('path');
const fs = require('fs');

//express stuff
let app = express();
let PORT = process.env.PORT || 3001;
const { v4: uuidv4 } = require('uuid');

//middleware
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));
let notes = require("./db/db.json");

//routing
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get('/api/notes', (req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
        if(err) throw err;
        let notes = JSON.parse(data)
        res.json(notes)
    })
})

app.post('/api/notes', (req, res) => {
  let newNote = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text,
  };
  console.log("this is newNote "+newNote);
  notes.push(newNote);
  console.log("this is notes "+notes)
  const notesString = JSON.stringify(notes);
  console.log("this is notesString "+notesString)
  res.json(notes);
  fs.writeFile("./db/db.json", notesString, (err) =>{
    if(err) throw err;
    else {
      console.log("ya did it");
    }
  })
})

//run it
app.listen(PORT, () => console.log("App listening on PORT http://localhost:" + PORT));