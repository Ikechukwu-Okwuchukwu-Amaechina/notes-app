const express = require('express');
const auth = require('../middleware/auth');
const { list, create, getOne, updateOne, remove } = require('../controllers/notesController');

const router = express.Router();

// protect all routes
router.use(auth);

// list notes (supports ?tag=work or ?tags=work,urgent)
router.get('/', list);

// create note
router.post('/', create);

// get single note
router.get('/:id', getOne);

// update note
router.put('/:id', updateOne);

// delete note
router.delete('/:id', remove);

module.exports = router;
