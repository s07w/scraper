const mongoose = require("mongoose");

// saves a reference to Schema constructor
const Schema = mongoose.Schema;

//Using schema constructor, creates new NoteSchema object
const NoteSchema = new Schema({
    // headline associated with note
    article: {
        type: Schema.Types.ObjectId,
        ref:"Headline"
    },
    date: {
        type: Date,
        default: Date.now
    },
    noteText: String
});

// creates our model from above schema, using mongoose model method
const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;