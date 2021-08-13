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

//route to notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

//route to displat notes
app.get('/api/notes', (req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
        if(err) throw err;
        let notes = JSON.parse(data)
        res.json(notes)
    })
})

// Route to save a note
app.post('/api/notes', (req, res) => {
  let newNote = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text,
  };
  notes.push(newNote);
  const notesString = JSON.stringify(notes);
  res.json(notes);
  fs.writeFile("./db/db.json", notesString, (err) =>{
    if(err) throw err;
    else {
      console.log("Note Saved");
    }
  })
})

//delete route
app.delete("/api/notes/:id", (req, res) => {
  let noteID = req.params.id;
  fs.readFile("db/db.json", (err, data) => {
    let updatedNotes = JSON.parse(data).filter((note) => {
      return note.id !== noteID;
    });
    notes = updatedNotes;
    const noteString = JSON.stringify(updatedNotes);
    fs.writeFile("db/db.json", noteString, (err) => {
      if (err) console.log(err);
      else {
        console.log("Note deleted");
      }
    });
    res.json(noteString);
  });
});

//Catch all route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

//run it
app.listen(PORT, () => console.log("App listening on PORT http://localhost:" + PORT));