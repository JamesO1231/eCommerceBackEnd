const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', (req, res) => {
  Product.findAll({
    include: [
      {
        model: Category,
        attribute: ['id', 'categoryName'],
      },
      {
        model: Tag,
        attribute: ['id', 'tagName'],
      },
    ]
  })
  .then(dbProductData => res.json(dbProductData))
  .catch(err => {
    res.status(500).json(err);
  });
});

// get one product
router.get('/:id', (req, res) => {
  Product.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Category,
        attribute: ['id', 'categoryName']
      },
      {
        model: Tag,
        attribute: ['id', 'tagName']
      },
    ]
  })
  .then(dbProductData => {
    if (!dbProductData) {
      res.status(404).json({ message: 'No product found under this ID'});
      return;
    }
    res.json(dbProductData);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

// create new product
router.post('/', (req, res) => {
  Product.create({
    product_name: req.body.productName,
    price: req.body.price,
    stock: req.body.stock,
    categoryId: req.body.categoryId,
    tag_ids: req.body.tagId,
  })
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tag_ids.length) {
        const productTagIdArr = req.body.tag_ids.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((product_tags) => {
      // get list of current tag_ids
      const productTagIds = product_tags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tag_ids
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = product_tags
        .filter(({ tag_id }) => !req.body.tag_ids.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  Product.destroy({
    where: { 
      id: req.params.id,
    },
  })
  .then(dbProductData => {
    if (!dbProductData) {
      res.status(404).json({ message: 'No product found under this ID'});
      return;
    }
    res.json(dbProductData);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

module.exports = router;
