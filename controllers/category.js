const Category = require('../models/Category');

exports.getCategoryById = async (req, res, next, id) => {
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(400).json({ msg: 'No category found!' });
    }
    req.category = category;
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'No category found!' });
    }
  }
  next();
};

exports.createCategory = async (req, res) => {
  if (req.body.name === '') {
    return res.status(422).json({ msg: 'Category name is required!' });
  }
  try {
    let category;
    category = await Category.findOne({ name: req.body.name });
    if (category) {
      return res.status(400).json({ msg: 'Category already exists!!' });
    }

    category = new Category(req.body);

    await category.save();
    res.json({ category });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    // if (categories.length === 0) {
    //   return res.json({ msg: 'No categories found!' });
    // }
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
};

exports.updateCategory = async (req, res) => {
  if (req.body.name === '') {
    return res.status(422).json({ msg: 'Category name is required!' });
  }
  try {
    const category = req.category;
    category.name = req.body.name;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
};

exports.removeCategory = async (req, res) => {
  try {
    await Category.deleteOne(req.category);
    res.json({ msg: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
};
