const Product = require('../models/Product');
const formidable = require('formidable');
const fs = require('fs');

exports.getProductById = async (req, res, next, id) => {
  try {
    const product = await Product.findById(id).populate('category', 'name');
    if (!product) {
      return res.status(400).json({ msg: 'No Product found!' });
    }
    req.product = product;
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'No Product found!' });
    }
    console.error(err.message);
    res.status(500).json({ msg: 'Issue with server! Please try again later.' });
  }
  next();
};

//Removing images from the product for faster response
exports.getProduct = (req, res) => {
  req.product.images = undefined;
  return res.json(req.product);
};

//separate middleware for getting images, so it can load after other content
exports.getSingleImage = (req, res, next) => {
  return res.send(req.product.images[0]);
  next();
};

exports.getAllImages = (req, res, next) => {
  return res.send(req.product.images);
  next();
};

exports.removeProduct = async (req, res) => {
  try {
    await Product.deleteOne({ _id: req.product._id });
    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server! Please try again later.' });
  }
};

//create or update product
exports.createProduct = (req, res) => {
  // console.log(req);
  const form = formidable({
    multiples: true,
    keepExtensions: true,
  });
  form.parse(req, async (err, fields, files) => {
    // console.log(fields);
    // console.log(files);
    const { name, size, color, material, price, stock, category } = fields;

    if (
      !name ||
      !size ||
      !color ||
      !material ||
      !price ||
      !category ||
      !stock
    ) {
      return res
        .status(400)
        .json({ msg: 'Please fill all the required fields!' });
    }

    if (!Number.isInteger(Number(price))) {
      return res.status(400).json({ msg: 'Price must be a valid number!' });
    }

    if (!Number.isInteger(Number(stock))) {
      return res.status(400).json({ msg: 'Stock must be a valid number!' });
    }

    // console.log(files);

    if (Object.keys(files).length === 0) {
      return res.status(400).json({ msg: 'Please upload an image!' });
    }

    //files.images returns an array for multiple images or a single object for single image
    //converting files.images into array in case of single object/image
    files.images = Array.isArray(files.images)
      ? [...files.images]
      : [files.images];

    files.images.forEach((file) => {
      if (file.size > 300000) {
        return res.status(400).json({ msg: 'Max file size is 300KB!' });
      }
    });

    // return res.json(files.images);

    let product = { ...fields };
    product.images = [];

    files.images.forEach((image) => {
      product.images.push({
        data: fs.readFileSync(image.path),
        contentType: image.type,
      });
    });

    let createdproduct;
    try {
      if (req.product !== undefined) {
        createdproduct = await Product.findOneAndUpdate(
          { _id: req.product },
          { $set: product },
          { new: true }
        );
      } else {
        createdproduct = new Product(product);
        createdproduct.save();
      }
      res.json(createdproduct);
    } catch (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ msg: 'Issue with server! Please try again later.' });
    }
  });
};

//product listing for user
exports.getAllProducts = async (req, res) => {
  let catId = req.body.categories.map((cat) => cat.id);
  let catName = req.body.categories.map((cat) => cat.name);
  let sizes = req.body.sizes.map((size) => size.size);
  let sizeCatName = req.body.sizes.map((size) => size.category);
  let sortBy = req.body.sortBy;
  let sortVal = req.body.sortVal;

  try {
    if (catId.length === 0 && sizes.length === 0) {
      const products = await Product.find()
        .select('-images')
        .populate('category', ['_id', 'name'])
        .sort([[sortBy, sortVal]]);
      return res.json(products);
    } else if (catId.length > 0 && sizes.length === 0) {
      const filteredProducts = await Product.find({
        category: { $in: catId },
      })
        .select('-images')
        .populate('category', ['_id', 'name'])
        .sort([[sortBy, sortVal]]);
      return res.json(filteredProducts);
    } else {
      const filteredProducts = await Product.find({
        category: { $in: catId },
        size: { $in: sizes },
      })
        .select('-images')
        .populate('category', ['_id', 'name'])
        .sort([[sortBy, sortVal]]);
      return res.json(filteredProducts);
    }
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server! Please try again later.' });
  }
};

//get all distinct categories present in the products
exports.getAllUniqueCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    if (categories.length === 0) {
      return res.status(404).json({ msg: 'No categories found!' });
    }
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server! Please try again later.' });
  }
};

//update stock and sold upon order
exports.updateStocks = async (req, res, next) => {
  let operations = [];
  req.body.order.products.forEach((product) => {
    operations.push({
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { sold: +product.qty, stock: -product.qty } },
      },
    });
  });
  try {
    await Product.bulkWrite(operations);
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server! Please try again later.' });
  }
  next();
};

//CREATE PRODUCT
// exports.createProduct = (req, res) => {
//   const form = formidable({ multiples: true, maxFileSize: 300000 });
//   form.parse(req, async (err, fields, files) => {
//     const { name, size, color, material, price, stock, category } = fields;

//     if (
//       !name ||
//       !size ||
//       !color ||
//       !material ||
//       !price ||
//       !category ||
//       !stock
//     ) {
//       return res.status(400).json({ error: 'Please fill all the fields!' });
//     }

//     if (!files.images) {
//       return res.status(400).json({ error: 'Please upload an image!' });
//     }

//     if (err) {
//       return res.status(400).json({ error: 'Maximum File Size is 300KB!' });
//     }

//     let product = new Product(fields);

//     files.images.forEach((image) => {
//       product.images.push({
//         data: fs.readFileSync(image.path),
//         contentType: image.type,
//       });
//     });

//     try {
//       await product.save();
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Issue with server! Please try again later.');
//     }

//     return res.json(product);
//   });
// };
