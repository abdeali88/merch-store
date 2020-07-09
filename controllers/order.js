const { Order } = require('../models/Order');
const config = require('config');

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
      return res.status(400).json({ msg: 'Order not found!' });
    }
    req.order = order;
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Order not found!' });
    }
    console.error(err.message);
    res.status(500).json({ msg: 'Issue with server. Please try again later!' });
  }
  next();
};

exports.getOrder = async (req, res) => {
  if (req.profile._id.toString() === req.order.user.toString()) {
    return res.json(req.order);
  } else {
    return res.status(401).json({ msg: 'Access Denied!' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    req.body.order.user = req.profile._id;
    let order = new Order(req.body.order);
    order = await order.save();

    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(config.get('mailKey'));
    const msg = {
      to: req.profile.email,
      from: config.get('from'),
      subject: 'Fashion Hub Order Confirmation',
      html: `<!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width">
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <title>Simple Transactional Email</title>
          <style>
          /* -------------------------------------
              INLINED WITH htmlemail.io/inline
          ------------------------------------- */
          /* -------------------------------------
              RESPONSIVE AND MOBILE FRIENDLY STYLES
          ------------------------------------- */
          @media only screen and (max-width: 620px) {
            table[class=body] h1 {
              font-size: 28px !important;
              margin-bottom: 10px !important;
            }
            table[class=body] p,
                  table[class=body] ul,
                  table[class=body] ol,
                  table[class=body] td,
                  table[class=body] span,
                  table[class=body] a {
              font-size: 16px !important;
            }
            table[class=body] .wrapper,
                  table[class=body] .article {
              padding: 10px !important;
            }
            table[class=body] .content {
              padding: 0 !important;
            }
            table[class=body] .container {
              padding: 0 !important;
              width: 100% !important;
            }
            table[class=body] .main {
              border-left-width: 0 !important;
              border-radius: 0 !important;
              border-right-width: 0 !important;
            }
            table[class=body] .btn table {
              width: 100% !important;
            }
            table[class=body] .btn a {
              width: 100% !important;
            }
            table[class=body] .img-responsive {
              height: auto !important;
              max-width: 100% !important;
              width: auto !important;
            }
          }
      
          /* -------------------------------------
              PRESERVE THESE STYLES IN THE HEAD
          ------------------------------------- */
          @media all {
            .ExternalClass {
              width: 100%;
            }
            .ExternalClass,
                  .ExternalClass p,
                  .ExternalClass span,
                  .ExternalClass font,
                  .ExternalClass td,
                  .ExternalClass div {
              line-height: 100%;
            }
            .apple-link a {
              color: inherit !important;
              font-family: inherit !important;
              font-size: inherit !important;
              font-weight: inherit !important;
              line-height: inherit !important;
              text-decoration: none !important;
            }
            #MessageViewBody a {
              color: inherit;
              text-decoration: none;
              font-size: inherit;
              font-family: inherit;
              font-weight: inherit;
              line-height: inherit;
            }
            .btn-primary table td:hover {
              background-color: #34495e !important;
            }
            .btn-primary a:hover {
              background-color: #34495e !important;
              border-color: #34495e !important;
            }
          }
          </style>
        </head>
        <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
          <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
            <tr>
              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
              <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
                <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
      
                  <!-- START CENTERED WHITE CONTAINER -->
                  <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">Thankyou for shopping at Fashion Hub.</span>
                  <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">
      
                    <!-- START MAIN CONTENT AREA -->
                    <tr>
                      <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                          <tr>
                            <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                              <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello ${
                                req.profile.firstname
                              }</p>
                              <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Your order at Fashion Hub has been confirmed. Just sit back and relax!</p>
                              <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
                                <tbody>
                                  <tr>
                                    <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
                                      <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                        <tbody>
                                          <tr>
                                            <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href="${config.get(
                                              'clientURL'
                                            )}/user/dashboard" target="_blank" style="display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #3498db;">Check Order Details</a> </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Your order id is <b>${
                                order._id
                              }</b></p>
                              <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Your payment id is <b>${
                                order.payment.razorpay_payment_id
                              } </b>.</p>
                              <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Order amount is <b> ${
                                order.amount
                              } ₹<b>.</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
      
                  <!-- END MAIN CONTENT AREA -->
                  </table>

      
                <!-- END CENTERED WHITE CONTAINER -->
                </div>
              </td>
              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
            </tr>
          </table>
        </body>
      </html>`,
    };

    sgMail.send(msg).then(
      () => {
        return res
          .status(200)
          .json({ msg: `Email has been sent to ${req.profile.email}`, order });
      },
      (error) => {
        if (error.response) {
          return res.status(200).json({ msg: error.response.body, order });
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Issue with server. Please try again later!' });
  }
};

//admin call
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: 'desc',
    });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Issue with server. Please try again later!' });
  }
};

//admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: req.order._id },
      { status: req.body.status },
      {
        new: true,
      }
    );
    res.json(updatedOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Issue with server. Please try again later!' });
  }
};
