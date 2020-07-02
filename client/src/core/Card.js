import React, { Fragment, useState, useEffect } from 'react';
import Image from './helper/Image';
import { addToCart, removeFromCart } from '../user/helper/userapicalls';
import { isAuthenticated, signout } from '../auth/helper';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import spinner3 from './spinner3.gif';

const Card = ({
  product,
  history,
  user,
  token,
  present,
  add,
  remove,
  loading,
  setLoading,
}) => {
  // const [loading, setLoading] = useState(false);

  const addCart = async () => {
    try {
      setLoading(true);
      const res = await addToCart(product._id, user, token);
      if (res.data) {
        add(product._id);
        setLoading(false);
        toast.success(`"${product.name}" added to cart !`);
      } else {
        if (res.response && res.response.status === 401) {
          await signout();
          history.push('/');
        }
        if (res.response && res.response.data.msg === 'Product out of stock!') {
          toast.error('Sorry. Product is out of stock!');
          setLoading(false);
        }
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again later!');
      setLoading(false);
    }
  };

  const removeCart = async () => {
    try {
      setLoading(true);
      const res = await removeFromCart(product._id, user, token);
      if (res.data) {
        remove(product._id);
        setLoading(false);
        toast.info(`"${product.name}" removed from cart !`);
      } else {
        if (res.response && res.response.status === 401) {
          await signout();
          history.push('/');
        } else if (res.response) {
          toast.error('Something went wrong. Please try again later!');
        }
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again later!');
    }
  };

  return (
    <Fragment>
      <div className='card text-white bg-dark product-card'>
        <div className='card-body'>
          <Image product={product} />
          <p className='lead bg-secondary text-wrap'>{product.name}</p>

          <div className='row pt-2'>
            <div className='col-5'>
              Size:{' '}
              <span className='ml-1 font-weight-bold'>{product.size}</span>
            </div>
            <div className='col-7'>
              {' '}
              Color: <strong>{product.color}</strong>
              <span
                className='dot ml-2'
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: `${product.color}`,
                  borderRadius: '50%',
                  display: 'inline-block',
                }}
              ></span>
            </div>
          </div>
          <div className='row pt-4'>
            <div className='col-md-6 col-sm-8 col-6'>
              <span className='price-tag'>
                <i className='fas fa-tag mr-1'></i>{' '}
                <span className='lead font-weight-bold'>{product.price} ₹</span>{' '}
              </span>
            </div>
            <div className='col-md-6 col-sm-4 col-6'>
              {loading ? (
                <img src={spinner3} style={{ width: '45px', height: '45px' }} />
              ) : (
                <Fragment>
                  {!present ? (
                    <button
                      className='btn btn-success rounded'
                      onClick={() => {
                        isAuthenticated() ? addCart() : history.push('/signin');
                      }}
                    >
                      <i className='fas fa-cart-plus fa-lg'></i>{' '}
                    </button>
                  ) : (
                    <button
                      className='btn btn-danger rounded'
                      onClick={() => {
                        isAuthenticated()
                          ? removeCart()
                          : history.push('/signin');
                      }}
                    >
                      <i className='fas fa-minus-circle fa-lg'></i>{' '}
                    </button>
                  )}
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default withRouter(Card);
