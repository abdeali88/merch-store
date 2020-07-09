import React, { useState, useEffect } from 'react';
import { api } from '../../utility/api';
import axios from 'axios';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const Image = ({ product }) => {
  const [imgs, setImgs] = useState({
    images: {},
    loading: true,
  });

  const { images, loading } = imgs;

  useEffect(() => {
    axios
      .get(`/api/product/images/${product._id}`)
      .then((res) => {
        setImgs({
          images: res.data,
          loading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [product._id]);

  return loading ? (
    <div className='rounded border border-secondary p-2'>
      <img
        src='/spinner2.gif'
        alt='Spinner'
        style={{ maxHeight: '80%', maxWidth: '80%' }}
        className='mb-3 rounded'
      />
    </div>
  ) : (
    <div className='rounded border border-secondary p-2'>
      <Carousel autoPlay={5000} infiniteLoop showThumbs={false}>
        {images.map((img, index) => (
          <div key={index}>
            <img
              src={`data:${img.contentType};base64,${Buffer.from(
                img.data.data
              ).toString('base64')}`}
              className='image-fluid card-img'
              alt='Product img'
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Image;
