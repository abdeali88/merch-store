import React, { useEffect, Fragment, useState } from 'react';
import { getCart } from './helper/userapicalls';
import { isAuthenticated } from '../auth/helper';
import Card from './Card';
import Spinner from '../core/Spinner';

const Cart = () => {
  const { user, token } = isAuthenticated();

  const [cartItems, setCartItems] = useState({ items: [], loading: true });

  const { items, loading } = cartItems;

  useEffect(() => {
    console.log('INN');

    getCart(user, token).then((cartItems) => {
      setCartItems({
        items: cartItems,
        loading: false,
      });
    });
  }, []);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <div className='container mt-3'>
          {' '}
          <div className='row '>
            <div className='col-8'>
              <div
                className='lead text-white mb-4 '
                style={{ fontSize: '22px' }}
              >
                <i className='fa fa-shopping-cart mr-1'></i> {' My Cart '}
              </div>
              {items.map((cartItem, index) => (
                <Card key={index} item={cartItem} />
              ))}
            </div>

            <div className='col-lg-4'>Checkout</div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Cart;
