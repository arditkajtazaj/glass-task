import express from 'express';
import Note from '../models/Note.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const router = express.Router();

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function encrypt(text) {
  const cipher = crypto.createCipher('aes-256-ctr', process.env.JWT_SECRET);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}
function decrypt(text) {
  const decipher = crypto.createDecipher('aes-256-ctr', process.env.JWT_SECRET);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

// Get notes
router.get('/', auth, async (req, res) => {
  const notes = await Note.find({ user: req.userId });
  const decrypted = notes.map(n => ({ ...n._doc, content: decrypt(n.content) }));
  res.json(decrypted);
});

// Create note
router.post('/', auth, async (req, res) => {
  const encryptedContent = encrypt(req.body.content);
  const note = new Note({ user: req.userId, content: encryptedContent });
  await note.save();
  res.status(201).json(note);
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });
  res.json({ message: 'Note deleted' });
});

export default router;
