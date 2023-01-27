const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuid } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
})

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', { 'encoding': 'utf-8' }, (err, data) => {
    if (err) {
      throw err;
    } else {
      res.json(JSON.parse(data));
    }});
})

app.post('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', { 'encoding': 'utf-8' }, (err, data) => {
    if (err) {
      throw err;
    } else {
      let newEntry = req.body;
      newEntry.id = uuid();
      data = [...JSON.parse(data), req.body]
      fs.writeFile('./db/db.json', JSON.stringify(data, null, '\t'), (err) => {
        if (err) {
          throw err;
        } else {
          console.log("Note Created Successfully")
        }
      });
    }
  });
})

app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('./db/db.json', { 'encoding': 'utf-8' }, (err, data) => {
    if (err) {
      throw err;
    } else {
      let deleteID = req.params.id;
      let notesToKeep = [];
      JSON.parse(data).forEach((note) => {
        if (note.id !== deleteID) notesToKeep.push(note);
      })
      fs.writeFile('./db/db.json', JSON.stringify(notesToKeep, null, '\t'), (err) => {
        if (err) {
          throw err;
        } else {
          console.log("Deleted Note Successfully")
        }
      });
    }
  });
})

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
})

// reload page / get notes again when saved