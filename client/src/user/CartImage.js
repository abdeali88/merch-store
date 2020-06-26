import React, { useState, useEffect } from 'react';
import { api } from '../utility/api';
import axios from 'axios';
// import Spinner from '../Spinner';
import spinner2 from '../core/spinner2.gif';

const CartImage = ({ item }) => {
  const [img, setImg] = useState({
    image: {},
    loading: true,
  });

  const { image, loading } = img;

  useEffect(() => {
    axios
      .get(`${api}/product/image/${item.product._id}`)
      .then((res) => {
        setImg({
          image: res.data,
          loading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return loading ? (
    <div className='rounded'>
      <img
        src={spinner2}
        alt='photo'
        style={{ maxHeight: '80%', maxWidth: '80%' }}
        className='rounded'
      />
    </div>
  ) : (
    <div className='rounded p-2'>
      <img
        src={`data:${image.contentType};base64,${Buffer.from(
          image.data.data
        ).toString('base64')}`}
        className='image-fluid cart-img'
      />
    </div>
  );
};

export default CartImage;
