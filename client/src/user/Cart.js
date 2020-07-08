import React, { useEffect, Fragment, useState } from 'react';
import { getCart, checkInStock } from './helper/userapicalls';
import { isAuthenticated, signout } from '../auth/helper';
import Card from './Card';
import Spinner from '../core/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { withRouter, Link } from 'react-router-dom';

const Cart = ({ history }) => {
  const { user, token } = isAuthenticated();

  const [cartItems, setCartItems] = useState({
    items: [],
    loading: true,
  });

  const [total, setTotal] = useState(0);

  const [totalLoad, setTotalLoad] = useState(false);

  const [reload, setReload] = useState(false);

  const { items, loading } = cartItems;

  useEffect(() => {
    getCart(user, token)
      .then((res) => {
        if (res.data) {
          console.log('INSIDE GETCART');

          setCartItems({
            items: res.data,
            loading: false,
          });

          setTotal(
            res.data
              .map((cartItem) => cartItem.product.price * cartItem.qty)
              .reduce((a, b) => a + b, 0)
          );

          setReload(false);
          setTotalLoad(false);
        } else if (res.response && res.response.status === 401) {
          signout().then(() => {
            history.push('/signin');
          });
        } else {
          history.push('/');
        }
      })
      .catch((err) => {
        toast.error('Something went wrong. Please try again later!');
      });
  }, [token, reload]);

  function updateTotal(op, price) {
    if (op === 'plus') {
      setTotal(total + price);
    } else if (op === 'minus' || op === 'remove') {
      setTotal(total - price);
    }
  }

  function checkStock() {
    setCartItems({
      ...cartItems,
      loading: true,
    });
    checkInStock(user, token)
      .then((res) => {
        if (res.data) {
          const { errors, cart } = res.data;
          if (errors.length > 0) {
            setReload(true);
            errors.forEach((err) => {
              toast.error(err);
            });
            return;
          } else {
            history.push('/checkout');
          }
        } else if (res.response && res.response.status === 401) {
          signout().then(() => {
            history.push('/signin');
          });
        }
      })
      .catch((err) => {
        toast.error('Something went wrong. Please try again later!');
      });
  }

  return (
    <Fragment>
      <ToastContainer />
      <Fragment>
        {loading || reload ? (
          <Spinner />
        ) : (
          <div className='container mt-3 mb-5'>
            {' '}
            <div className='row '>
              <div className='col-lg-8 col-md-12 col-sm-12 col-12'>
                <div className='lead text-white mb-4 font-big font-sm-head '>
                  <i className='fa fa-shopping-cart mr-1'></i> {' My Cart '}
                </div>
                {items.length === 0 ? (
                  <div className='lead text-white'>
                    <p>No items in your cart.</p>
                    <p>
                      <Link to='/' className='btn btn-info rounded'>
                        Shop Now !
                      </Link>
                    </p>
                  </div>
                ) : (
                  <Fragment />
                )}
                {items.map((cartItem, index) => (
                  <Card
                    key={index}
                    cartItem={cartItem}
                    user={user}
                    token={token}
                    updateTotal={updateTotal}
                    totalLoad={totalLoad}
                    setTotalLoad={setTotalLoad}
                  />
                ))}
              </div>

              {!items.length > 0 ? (
                <Fragment />
              ) : (
                <div className='col-lg-4 col-md-12 col-sm-12 col-12 text-white mt-5 pt-2'>
                  <div className='card text-white bg-dark cart-card pb-2 mb-4'>
                    <div className='card-body'>
                      <div className='row pt-3'>
                        <div className='col-12'>
                          <h3 className='lead font-weight-bold pb-1 font-sm-head'>
                            <span className='line-below pb-1'>
                              Total Amount
                            </span>
                          </h3>
                        </div>
                      </div>
                      <div className='row pt-3 font-sm-body'>
                        <div className='col-8'>Product amount</div>
                        <div className='col-lg-4 col-md-3 col-sm-3 col-4 text-right'>
                          {total} ₹
                        </div>
                      </div>
                      <div className='row pt-3 font-sm-body'>
                        <div className='col-8'>Shipping charges</div>
                        <div className='col-lg-4 col-md-3 col-sm-3 col-4 text-right'>
                          {!total ? `0 ₹` : `30 ₹`}
                        </div>
                      </div>
                      <div className='row pt-3 font-sm-body'>
                        <div className='col-8 '>Taxes</div>
                        <div className='col-lg-4 col-md-3 col-sm-3 col-4 text-right'>
                          0 ₹
                        </div>
                      </div>

                      <div className='row pt-1'>
                        <div className='col-12'>
                          <h3 className='lead font-weight-bold line-below pb-2'></h3>
                        </div>
                      </div>

                      <div className='row font-weight-bold pt-2 font-sm-body'>
                        <div className='col-8'>Total :</div>
                        <div className='col-lg-4 col-md-3 col-sm-3 col-4 text-right'>
                          {!total ? `0 ₹` : `${total + 30} ₹`}
                        </div>
                      </div>

                      <div className='row pt-4'>
                        <div className='col-12'>
                          <button
                            className='btn btn-block btn-info rounded'
                            onClick={checkStock}
                            disabled={totalLoad || reload ? true : false}
                          >
                            Proceed to Checkout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Fragment>
    </Fragment>
  );
};

export default withRouter(Cart);
