const mongoose = require("mongoose");

// saves a reference to Schema constructor
const Schema = mongoose.Schema;

const HeadlineSchema = new Schema ({
    title: {
        type: String,
        unique: {index: { unique: true} },
        required: true
    },
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    //sets headline default to unsaved
    saved: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

const Headline = mongoose.model("Headline", HeadlineSchema);

module.exports = Headline;