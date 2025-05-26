import express from 'express';
const router = express.Router();

// Example static data (can later come from DB)
const origins = ['How', 'Is', 'This', 'Getting', 'called'];

router.get('/', (req, res) => {
  res.json(origins);
});

export default router;
