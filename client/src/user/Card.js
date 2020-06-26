import React from 'react';
import CartImage from './CartImage';

const Card = ({ item }) => {
  return (
    <div className='card text-white bg-dark cart-card pb-2 mb-4'>
      <div className='card-body'>
        <div className='row'>
          <div className='col-4'>
            <CartImage item={item} />
          </div>

          <div className='col-5 '>
            <p className='lead font-weight-bold mt-3'>{item.product.name}</p>

            <div className='row pt-2'>
              <div className='col-12'>
                Size: <span className='ml-1'>{item.product.size}</span>
              </div>
            </div>
            <div className='row pt-2'>
              <div className='col-12'>
                Color: <span className='ml-1'>{item.product.color}</span>
              </div>
            </div>
            <div className='row pt-2'>
              <div className='col-12'>
                Material: <span className='ml-1'>{item.product.material}</span>
              </div>
            </div>
            <div className='row pt-4'>
              <div className='col-12'>
                <button className='btn btn-danger rounded' onClick={() => {}}>
                  <i className='fa fa-trash-alt mr-1'></i>
                  {' Remove'}
                </button>
              </div>
            </div>
          </div>
          <div className='form group col-3 mt-3'>
            <input type='number' min='1' className='form-control' />
            <div className='row pt-5 mt-5'>
              <div className='col-10 text-right'>
                <i className='fas fa-tag mr-1'></i>{' '}
                <span className='lead'>{item.product.price} ₹</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
