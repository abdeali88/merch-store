import React from 'react';

const CartImage = ({ image }) => (
  <img
    src={`data:${image.contentType};base64,${Buffer.from(
      image.data.data
    ).toString('base64')}`}
    className='image-fluid cart-img'
  />
);

export default CartImage;
