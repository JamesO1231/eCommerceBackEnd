const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  Category.findAll({
    include: [
      {
        model: Product,
        attribute: ['id', 'productName', 'price', 'stock', 'categoryId'],
      },
    ]
  })
  .then(dbCategoryData => res.json(dbCategoryData))
  .catch(err => {
    res.status(500).json(err);
  });
});

router.get('/:id', (req, res) => {
  Category.findOne({
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
  .then(dbCategoryData => {
    if (!dbCategoryData) {
      res.status(404).json({ message: 'No category found under this ID'});
      return;
    }
    res.json(dbCategoryData);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

router.post('/', (req, res) => {
  Category.create({
    categoryName: req.body.categoryName,
  })
  .then(dbCategoryData => res.json(dbCategoryData))
  .catch(err => {
    res.status(500).json(err);
  });
});

router.put('/:id', (req, res) => {
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  .then(dbCategoryData => {
    if (!dbCategoryData[0]) {
      res.status(404).json({ message: 'No category found under this ID'});
      return;
    }
    res.json(dbCategoryData);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

router.delete('/:id', (req, res) => {
  Category.destroy({
    where: {
      id: req.params.id,
    },
  })
  .then(dbCategoryData => {
    if (!dbCategoryData) {
      res.status(404).json({ message: 'No category found under this ID'});
      return;
    }
    res.json(dbCategoryData);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

module.exports = router;
