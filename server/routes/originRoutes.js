import express from 'express';
const router = express.Router();

// Example static data (can later come from DB)
const origins = ['Atlanta', 'Chicago', 'Denver', 'New York', 'Los Angeles'];

router.get('/', (req, res) => {
  res.json(origins);
});

export default router;
