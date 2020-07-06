import React, { useState, Fragment } from 'react';
import CartImage from './CartImage';
import { updateCart, removeFromCart } from './helper/userapicalls';
import { withRouter } from 'react-router-dom';
import { signout } from '../auth/helper';
import { toast } from 'react-toastify';

const Card = ({
  cartItem,
  user,
  token,
  history,
  updateTotal,
  totalLoad,
  setTotalLoad,
}) => {
  const [item, setItem] = useState(cartItem);

  const [loading, setLoading] = useState(false);

  const changeQty = async (e) => {
    const curr_qty = Number(e.target.value);
    let new_qty;
    const operation = e.target.getAttribute('name');
    console.log(operation);

    if (operation === 'plus') {
      new_qty = curr_qty + 1;
    } else if (operation === 'minus') {
      new_qty = curr_qty - 1;
    }

    if (new_qty < 1) {
      return;
    }

    try {
      setLoading(true);
      setTotalLoad(true);
      const res = await updateCart(
        item.product._id,
        { qty: new_qty },
        user,
        token
      );
      if (res.data) {
        setItem({
          ...item,
          qty: new_qty,
        });
        updateTotal(operation, item.product.price);
        setLoading(false);
        setTotalLoad(false);
      } else {
        if (res.response && res.response.status === 401) {
          await signout();
          history.push('/');
        } else if (res.response && res.response.status === 400) {
          toast.error('Product out of stock!');
          setTotalLoad(false);
          setLoading(false);
        }
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again later!');
      setTotalLoad(false);
      setLoading(false);
    }
  };

  const removeItem = async (e) => {
    try {
      setLoading(true);
      setTotalLoad(true);
      const res = await removeFromCart(item.product._id, user, token);
      if (res.data) {
        updateTotal('remove', item.product.price * item.qty);
        setItem(null);
        setLoading(false);
        setTotalLoad(false);
        toast.error(`"${item.product.name}" removed from cart!`);
      } else {
        if (res.response && res.response.status === 401) {
          await signout();
          history.push('/');
        }
      }
    } catch (err) {
      setLoading(false);
      setTotalLoad(false);
      toast.error('Something went wrong. Please try again later!');
    }
  };

  return (
    <Fragment>
      {item === null ? (
        <Fragment />
      ) : (
        <div className='card text-white bg-dark cart-card pb-2 mb-4'>
          <div className='card-body'>
            <div className='row'>
              <div className='col-lg-4 col-md-4 col-sm-5 col-5 img-container'>
                <CartImage image={item.product.images[0]} />
              </div>

              <div className='col-lg-5 col-md-5 col-sm-7 col-7'>
                <div className='row mt-1'>
                  <div className='col-12'>
                    <p className='lead font-sm-body font-weight-bold mb-0 pb-0'>
                      {item.product.name}
                    </p>
                    {/* <p className='font-sm-body'>{item.product.gender}</p> */}
                  </div>
                </div>

                <div className='row pt-2 font-sm-body'>
                  <div className='col-12'>
                    Size: <span className='ml-1'>{item.product.size}</span>
                  </div>
                </div>
                <div className='row pt-2 font-sm-body'>
                  <div className='col-12'>
                    Color: <span className='ml-1'>{item.product.color}</span>
                  </div>
                </div>
                <div className='row pt-2 font-sm-body'>
                  <div className='col-12'>
                    Material:{' '}
                    <span className='ml-1'>{item.product.material}</span>
                  </div>
                </div>
                <div className='row pt-2 font-sm-body hide-lg'>
                  <div className='col-12'>
                    Price: <span className='ml-1'> {item.product.price} ₹</span>
                  </div>
                </div>

                <div className='row pt-4 font-sm-body'>
                  <div className='col-3'>
                    <button
                      className='btn btn-danger rounded remove-cart'
                      name='remove'
                      onClick={(e) => removeItem(e)}
                      disabled={loading || totalLoad ? true : false}
                    >
                      <i className='fa fa-trash-alt '></i>
                      {/* <span className='hide-sm'>{' Remove'}</span> */}
                    </button>
                  </div>
                  <div className='col-9'>
                    <div className='qty mt-1'>
                      <button
                        className='minus bg-dark'
                        name='minus'
                        value={item.qty}
                        onClick={(e) => changeQty(e)}
                        disabled={loading || totalLoad ? true : false}
                      >
                        -
                      </button>

                      <input
                        type='number'
                        className='count rounded'
                        name='qty'
                        id='qty'
                        value={item.qty}
                        disabled
                      />

                      <button
                        className='plus bg-dark'
                        name='plus'
                        value={item.qty}
                        onClick={(e) => changeQty(e)}
                        disabled={loading || totalLoad ? true : false}
                      >
                        +
                      </button>
                    </div>
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
                      {item.product.price} ₹
                    </span>
                  </div>
                </div>
              </div>

              {/* <div className='col-lg-3 col-md-3 col-sm-3 col-2 mt-2 font-sm-body'>
          
                <div className='row pt-lg-5 mt-lg-5 pt-md-5 mt-md-5 pt-sm-3 mt-sm-3 pt-3 mt-3'>
                  {loading ? (
                    <div className='col-12 text-left'>
                      <img
                        src={spinner3}
                        style={{ width: '40px', height: '40px' }}
                      />
                    </div>
                  ) : (
                    <div className='col-12 text-left'>
                      <span className='hide-sm'>
                        <i className='fas fa-tag mr-1'></i>
                      </span>{' '}
                      <span className='lead font-sm-head'>
                        {item.product.price * item.qty} ₹
                      </span>
                    </div>
                  )}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default withRouter(Card);
