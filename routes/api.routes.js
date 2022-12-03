const router = require('express').Router();

router.post('/project/:id', (req, res, next) => {
  res.json('All good in here');
});

module.exports = router;
