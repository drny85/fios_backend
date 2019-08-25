const Note = require('../models/note');
const moment = require('moment');
moment().format();

// a=add a note
exports.addNote = (req, res, next) => {
    const note = req.body.note;
    const created = req.body.created

    if (note.length === 0) {
        return res.status(400).json(new Error('Note is required'))
    }

    const newNote = new Note({
        note: note,
        author: req.user._id,
        created: created
    })

    newNote.save()
        .then(note => {
            if (note) {
                res.json(note);
            }

        })
        .catch(err => next(err));
}

// get single note 
exports.getNote = (req, res, next) => {
    const id = req.params.id;
    if (id) {
        Note.findById(id)
            .then(note => {
                res.json(note)
            })
            .catch(err => next(err));
    }
}
// get all notes
exports.getNotes = (req, res, next) => {
    Note.find({
            author: req.user._id
        })
        .then(notes => {
            res.json(notes)
        })
        .catch(err => next(err));
}


exports.getNotesByDate = (req, res, next) => {
    const today = new Date().toLocaleDateString();
    const startDay = req.body.start;
    const endDay = req.body.end;
   
    let start = moment(startDay).startOf('day');
    // end today

    let end = moment(endDay).endOf('day');

    Note.find({
            created: {
                $gte: start,
                $lt: end
            },
            author: req.user._id
        })
        .then(notes => {
            res.json(notes)
        })
        .catch(err => next(err));
}

exports.getTodayNotes = (req, res, next) => {

    // start today
    let start = moment().startOf('day');
    // end today

    let end = moment().endOf('day');

    Note.find({
            created: {
                $gte: start,
                $lt: end
            },
            author: req.user._id

        })
        .sort('-created')
        .exec()
        .then(notes => {

            res.json(notes)
        })
        .catch(err => console.log(err));
}

exports.deleteNote = (req, res, next) => {
    const id = req.params.id;
    if (id) {
    
        Note.findOneAndDelete({_id: id})
            .then((err, notes) => {
                res.json({message: 'note deleted'});
            })
            .catch(err => next(err));
    }
}