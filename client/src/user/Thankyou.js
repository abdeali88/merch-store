import React, { useEffect, useState, Fragment } from 'react';
import { getOrder } from './helper/userapicalls';
import { isAuthenticated, signout } from '../auth/helper';
import { withRouter } from 'react-router-dom';
import Spinner from '../core/Spinner';
import Moment from 'react-moment';

const Thankyou = ({ match, history }) => {
  const { user, token } = isAuthenticated();

  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(user, token, match.params.orderId)
      .then((res) => {
        if (res.data) {
          setOrder(res.data);
          setLoading(false);
        } else {
          if (res.response && res.response.status === 401) {
            signout().then(() => {
              history.push('/signin');
            });
          } else {
            history.push('/');
          }
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [token]);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <div className='container mt-5 mb-5'>
          <div className='row text-white' style={{ letterSpacing: '0.019em' }}>
            <div className='col-12'>
              <p className='lead font-big font-sm-head'>
                <i className='fas fa-handshake mr-1'></i> Thankyou for shopping
                with Fashion Hub.
              </p>
            </div>
            <div className='col-12'>
              <p className='lead font-big font-sm-head'>
                <span className='line-below pb-3'>
                  <i className='fa fa-box-open mr-1'></i> Your order is
                  confirmed. Sit back, and relax!
                </span>
              </p>
            </div>
          </div>
          <div className='row mt-5'>
            <div className='col-lg-8 col-md-10 col-12'>
              <div className='card mb-4 '>
                <h4 className='card-header card-borders font-sm-head'>
                  <i className='fa fa-box-open fa-sm mr-1 '></i> Order
                  Information
                </h4>
                <ul className='list-group font-sm-body'>
                  <li className='list-group-item card-item'>
                    <div className='row'>
                      <div className='col-lg-2 col-md-2 col-sm-2 col-3'>
                        <span className='badge badge-success mr-2 p-1'>
                          Order id:
                        </span>
                      </div>
                      <div className='col-md-10 col-sm-10 col-9'>
                        {' '}
                        {order._id}
                      </div>
                    </div>
                  </li>
                  <li className='list-group-item card-item'>
                    <div className='row'>
                      <div className='col-lg-2 col-md-2 col-sm-2 col-3'>
                        <span className='badge badge-success mr-2 p-1'>
                          Amount:
                        </span>
                      </div>
                      <div className='col-md-10 col-sm-10 col-9'>
                        {' '}
                        {order.amount} ₹
                      </div>
                    </div>
                  </li>
                  <li className='list-group-item card-item'>
                    <div className='row'>
                      <div className='col-lg-2 col-md-2 col-sm-2 col-3'>
                        <span className='badge badge-success mr-2 p-1'>
                          Date&nbsp;&nbsp;:
                        </span>
                      </div>
                      <div className='col-md-10 col-sm-10 col-9'>
                        {' '}
                        <Moment format='DD/MM/YYYY'>{order.createdAt}</Moment>
                      </div>
                    </div>
                  </li>
                  <li className='list-group-item card-item'>
                    <div className='row'>
                      <div className='col-lg-2 col-md-2 col-sm-2 col-3'>
                        <span className='badge badge-success mr-2 p-1'>
                          Address:
                        </span>
                      </div>
                      <div className='col-md-10 col-sm-10 col-9'>
                        {order.address.name}
                        <br />
                        {order.address.address1}
                        <br />
                        {order.address.address2}
                      </div>
                    </div>
                  </li>
                  <li className='list-group-item card-item'>
                    <div className='row'>
                      <div className='col-lg-2 col-md-2 col-sm-2 col-3'>
                        <span className='badge badge-success mr-2 p-1'>
                          Status:
                        </span>
                      </div>
                      <div className='col-md-10 col-sm-10 col-9'>
                        {order.status}
                      </div>
                    </div>
                  </li>
                  <li className='card-footer card-borders'></li>
                </ul>
              </div>
            </div>
          </div>
          <div className='row mt-3'>
            {order.products.map((product, index) => (
              <div className='col-lg-8 col-md-10 col-12' key={index}>
                <div className='card text-white bg-dark cart-card pb-2 mb-4'>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='col-lg-4 col-md-4 col-sm-5 col-5'>
                        <img
                          src={`data:${
                            product.product.images[0].contentType
                          };base64,${Buffer.from(
                            product.product.images[0].data.data
                          ).toString('base64')}`}
                          className='image-fluid order-img'
                          alt='Product img'
                        />
                      </div>

                      <div className='col-lg-5 col-md-5 col-sm-7 col-7 mt-lg-3 mt-md-2 mt-sm-2'>
                        <div className='row mt-1'>
                          <div className='col-12'>
                            <p className='lead font-sm-body font-weight-bold mb-0 pb-0'>
                              {product.product.name}
                            </p>
                          </div>
                        </div>

                        <div className='row pt-2 font-sm-body'>
                          <div className='col-12'>
                            Size:{' '}
                            <span className='ml-1'>{product.product.size}</span>
                          </div>
                        </div>
                        <div className='row pt-2 font-sm-body'>
                          <div className='col-12'>
                            Color:{' '}
                            <span className='ml-1'>
                              {product.product.color}
                            </span>
                          </div>
                        </div>
                        <div className='row pt-2 font-sm-body'>
                          <div className='col-12'>
                            Material:{' '}
                            <span className='ml-1'>
                              {product.product.material}
                            </span>
                          </div>
                        </div>
                        <div className='row pt-2 font-sm-body hide-lg'>
                          <div className='col-12'>
                            Price:{' '}
                            <span className='ml-1'>
                              {' '}
                              {product.product.price} ₹
                            </span>
                          </div>
                        </div>
                        <div className='row pt-2 font-sm-body'>
                          <div className='col-12'>
                            Qty: <span className='ml-1'> {product.qty}</span>
                          </div>
                        </div>
                      </div>

                      <div className='col-lg-3 col-md-3 mt-5 pt-5 hide-small'>
                        <div className='row'>
                          <div className='col-10 text-right'>
                            <span>
                              <i className='fas fa-tag mr-1'></i>
                            </span>{' '}
                            <span className='lead font-sm-head'>
                              {product.product.price} ₹
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default withRouter(Thankyou);
