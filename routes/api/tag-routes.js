const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  Tag.findAll({
    include: [
      {
        model: Product,
        attribute: ['id', 'productName', 'price', 'stock', 'categoryId'],
      },
    ]
  })
  .then(dbTagData => res.json(dbTagData))
  .catch(err => {
    res.status(500).json(err);
  });
});

router.get('/:id', (req, res) => {
  Tag.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Product,
        attribute: ['id', 'productName', 'price', 'stock', 'categoryId'],
      },
    ]
  })
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({ message: 'No tag found under this ID'});
      return;
    }
    res.json(dbTagData);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

router.post('/', (req, res) => {
  Tag.create({
    tagName: req.body.tagName,
  })
  .then(dbTagData => res.json(dbTagData))
  .catch(err => {
    res.status(500).json(err);
  });
});

router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: { 
      id: req.params.id,
    },
  })
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({ message: 'No tag found under this ID'});
      return;
    }
    res.json(dbTagData);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: { 
      id: req.params.id,
    },
  })
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({ message: 'No tag found under this ID'});
      return;
    }
    res.json(dbTagData);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

module.exports = router;
