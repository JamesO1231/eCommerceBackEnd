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
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
