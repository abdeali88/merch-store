const { Order } = require('../models/Order');

exports.getOrderById = async (req, res, next, id) => {
  try {
    const order = await Order.findById(id).populate('products.product', [
      'name',
      'price',
      'size',
      'images',
      'material',
      'color',
    ]);
    if (!order) {
      console.log('Nahi mila re baba');

      return res.status(400).json({ msg: 'Order not found!' });
    }
    req.order = order;
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Order not found!' });
    }
    console.error(err.message);
    res.status(500).send('Server error');
  }
  next();
};

exports.getOrder = async (req, res) => {
  return res.json(req.order);
};

exports.createOrder = async (req, res) => {
  try {
    req.body.order.user = req.profile._id;
    let order = new Order(req.body.order);
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.profile._id }).sort({
      createdAt: 'desc',
    });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: req.order._id },
      { $set: { status: req.body.status } },
      {
        new: true,
      }
    );
    res.json(updatedOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
