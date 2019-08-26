const Note = require('../models/note');
const moment = require('moment');
moment().format();


exports.addNote = (req, res) => {
    const note = req.body.note;

    if (note.length < 3) {
        return res.status(400).json({ msg: 'a note is required' })
    }

    const newNote = new Note({
        note: note,
        author: req.user._id
    });

    newNote.save()
        .then(note => {
            if (note) {
                res.json(note);
            }
        })
        .catch(err => {
            return res.status(500).json({ msg: 'server error' });
        });
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

        Note.findOneAndDelete({ _id: id })
            .then((err, notes) => {
                res.json({ message: 'note deleted' });
            })
            .catch(err => next(err));
    }
}


exports.allNotes = async (req, res) => {
    try {
        const response = await Note.find({ author: req.user._id });
        if (!response) return res.status(400).json({ msg: 'no notes found' });

        return res.json(response);
    } catch (error) {
        return res.status(500).json({ msg: 'server error' });
    }
}