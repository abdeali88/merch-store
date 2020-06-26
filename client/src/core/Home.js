import React, { Fragment, useEffect, useState } from 'react';
import Card from './Card';
import { getAllProducts } from './helper/coreapicalls';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Spinner from './Spinner';
import { isAuthenticated } from '../auth/helper';
import { getCartProducts } from '../user/helper/userapicalls';

const Home = () => {
  const { user, token } = isAuthenticated();

  const [prods, setProds] = useState({
    products: [],
    loading: true,
  });

  const [cartProducts, setCartProducts] = useState([]);

  const [buttonLoading, setbuttonLoading] = useState(true);

  const { products, loading } = prods;

  useEffect(() => {
    console.log('In');
    getAllProducts()
      .then((products) => {
        setProds({
          products: products,
          loading: false,
        });

        if (isAuthenticated()) {
          getCartProducts(user, token).then((cartProds) => {
            setCartProducts(
              cartProds.map((cartProd) => ({
                user: cartProd.user,
                product: cartProd.product,
              }))
            );
            setbuttonLoading(false);
          });
        } else {
          setCartProducts([]);
          setbuttonLoading(false);
        }
      })
      .catch((err) => {
        toast.error('Something went wrong. Please try again later!');
      });
  }, [token]);

  function addCartProducts(productId) {
    setCartProducts([...cartProducts, { user: user._id, product: productId }]);
  }

  function removeCartProducts(productId) {
    setCartProducts(
      cartProducts.filter((cartProd) => cartProd.product !== productId)
    );
  }

  const cardList = [];
  products.forEach((product) => {
    const present =
      cartProducts.filter((cartProduct) => cartProduct.product === product._id)
        .length > 0
        ? true
        : false;
    cardList.push(
      <div
        key={product._id}
        className='col-lg-4 offset-lg-0 col-md-6 offset-md-0 col-sm-8 offset-sm-2 col-10 offset-1 mb-5'
      >
        <Card
          product={product}
          present={present}
          user={user}
          token={token}
          add={addCartProducts}
          remove={removeCartProducts}
          loading={buttonLoading}
          setLoading={setbuttonLoading}
        />
      </div>
    );
  });

  return (
    <Fragment>
      <ToastContainer />
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className='container mt-4'>
            <div className='row text-center'>{cardList}</div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
