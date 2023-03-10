const fs = require('fs/promises');
const path = require('path');
const chalk = require('chalk');

const notesPath = path.join(__dirname, 'db.json');

async function addNote(newTitle) {
  const notes = await getNotes();
  const title = newTitle.trim();
  const note = {
    title,
    id: Date.now().toString(),
  };

  notes.push(note);

  await saveNotes(notes);
  console.log(chalk.bgGreen('Note was added!'));
}

async function getNotes() {
  const notes = await fs.readFile(notesPath, { encoding: 'utf8' });

  return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
}

async function saveNotes(notes) {
  await fs.writeFile(notesPath, JSON.stringify(notes));
}

async function printNotes() {
  const notes = await getNotes();

  console.log(chalk.bgBlue('Here is the list of notes:'));
  notes.forEach(note => console.log(chalk.blue(note.id, note.title)));
}

async function removeNote(id) {
  const notes = await getNotes();

  const remoteNote = notes.filter((note => note.id === id));
  const filtered = notes.filter(note => note.id !== id);
  await saveNotes(filtered);
  console.log(chalk.bgRed(`Note with title: "${remoteNote[0].title}" and id: "${id}" has been removed.`));
}

async function updateNote(id, title) {
  const notes = await getNotes();

  const updatedNotes = notes.map(note => {
    if (note.id === id) {
      return { ...note, title };
    }
    return note;
  });
  await saveNotes(updatedNotes);
  console.log(chalk.bgYellow(`Note with id: "${id}" has been edited.`));
}

module.exports = {
  addNote, getNotes, removeNote, updateNote,
};
