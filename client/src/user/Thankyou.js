import React, { useEffect, useState, Fragment } from 'react';
import { getOrder } from './helper/userapicalls';
import { isAuthenticated, signout } from '../auth/helper';
import { withRouter } from 'react-router-dom';
import Spinner from '../core/Spinner';
import CartImage from './CartImage';

const Thankyou = ({ match, history }) => {
  const { user, token } = isAuthenticated();

  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(user, token, match.params.orderId)
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          setOrder(res.data);
          setLoading(false);
        } else {
          if (res.response && res.response === 401) {
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
          <div className='row text-white mt-5 '>
            <div className='col-12'>
              <h5 className='font-sm-head font-weight-light'>
                Order id : <span className=' ml-1'>#{order._id}</span>
              </h5>
            </div>
            <div className='col-12'>
              <h5 className='font-sm-head font-weight-light'>
                Amount : <span className=' ml-1'>{order.amount} ₹</span>
              </h5>
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
