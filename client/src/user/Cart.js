import React, { useEffect, Fragment, useState } from 'react';
import { getCart } from './helper/userapicalls';
import { isAuthenticated, signout } from '../auth/helper';
import Card from './Card';
import Spinner from '../core/Spinner';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { withRouter } from 'react-router-dom';

const Cart = ({ history }) => {
  const { user, token } = isAuthenticated();

  const [cartItems, setCartItems] = useState({
    items: [],
    loading: true,
  });

  const [total, setTotal] = useState(0);

  const [totalLoad, setTotalLoad] = useState(false);

  // const [qtyLoad, setqtyLoad] = useState(false);

  // const [removeLoading, setRemoveLoading] = useState(false);

  const { items, loading } = cartItems;

  useEffect(() => {
    getCart(user, token).then((res) => {
      console.log(res.data);
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

        setTotalLoad(false);
      } else if (res.response && res.response.status === 401) {
        signout().then(() => {
          history.push('/signin');
        });
      }
    });
  }, []);

  // useEffect(() => {}, [total]);

  function updateTotal(op, price) {
    if (op === 'plus') {
      setTotal(total + price);
    } else if (op === 'minus' || op === 'remove') {
      setTotal(total - price);
    }
  }

  // function updateCartItems(qty, itemId) {
  //   setCartItems({
  //     ...cartItems,
  //     items: items.map((cartItem) =>
  //       cartItem._id === itemId ? { ...cartItem, qty: qty } : cartItem
  //     ),
  //   });

  //   setqtyLoad(false);
  // }

  // function removeCartItem(itemId) {
  //   setCartItems({
  //     ...cartItems,
  //     items: items.filter((cartItem) => cartItem._id !== itemId),
  //   });
  //   setRemoveLoading(false);
  // }

  return (
    <Fragment>
      <ToastContainer />
      <Fragment>
        {loading ? (
          <Spinner />
        ) : (
          <div className='container mt-3'>
            {' '}
            <div className='row '>
              <div className='col-lg-8 col-md-12 col-sm-12 col-12'>
                <div
                  className='lead text-white mb-4 '
                  style={{ fontSize: '22px' }}
                >
                  <i className='fa fa-shopping-cart mr-1'></i> {' My Cart '}
                </div>
                {items.map((cartItem, index) => (
                  <Card
                    key={index}
                    cartItem={cartItem}
                    user={user}
                    token={token}
                    updateTotal={updateTotal}
                    totalLoad={totalLoad}
                    setTotalLoad={setTotalLoad}
                    // updateCartItems={updateCartItems}
                    // qtyLoad={qtyLoad}
                    // setqtyLoad={setqtyLoad}
                    // removeCartItem={removeCartItem}
                    // removeLoading={removeLoading}
                    // setRemoveLoading={setRemoveLoading}
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
                          <h3 className='lead font-weight-bold pb-1'>
                            <span className='line-below pb-1'>
                              Total Amount
                            </span>
                          </h3>
                        </div>
                      </div>
                      <div className='row pt-3'>
                        <div className='col-8'>Product amount</div>
                        <div className='col-lg-4 col-md-3 col-3 text-right'>
                          {total} ₹
                        </div>
                      </div>
                      <div className='row pt-3'>
                        <div className='col-8'>Shipping charges</div>
                        <div className='col-lg-4 col-md-3 col-3 text-right'>
                          {!total ? `0 ₹` : `30 ₹`}
                        </div>
                      </div>
                      <div className='row pt-3'>
                        <div className='col-8 '>Taxes</div>
                        <div className='col-lg-4 col-md-3 col-3 text-right'>
                          0 ₹
                        </div>
                      </div>

                      <div className='row pt-1'>
                        <div className='col-12'>
                          <h3 className='lead font-weight-bold line-below pb-2'></h3>
                        </div>
                      </div>

                      <div className='row font-weight-bold pt-2'>
                        <div className='col-8'>Total :</div>
                        <div className='col-lg-4 col-md-3 col-3 text-right'>
                          {!total ? `0 ₹` : `${total + 30} ₹`}
                        </div>
                      </div>

                      <div className='row pt-4'>
                        <div className='col-12'>
                          <button
                            className='btn btn-block btn-info rounded'
                            disabled={totalLoad ? true : false}
                          >
                            Proceed to checkout
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
