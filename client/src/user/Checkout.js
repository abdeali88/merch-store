import React, { Fragment, useState, useEffect } from 'react';
import { getCartWithTotal } from './helper/userapicalls';
import { signout, isAuthenticated } from '../auth/helper';
import { withRouter, Link } from 'react-router-dom';
import Spinner from '../core/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Select from 'react-select';
import { stateList } from '../utility/states';
import axios from 'axios';
import { api } from '../utility/api';

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const Checkout = ({ history }) => {
  const { user, token } = isAuthenticated();

  const [cart, setCart] = useState({
    items: [],
    total: 0,
    loading: true,
  });

  const [address, setAddress] = useState({
    name: '',
    address1: '',
    address2: '',
    zip: '',
    city: '',
    state: '',
    contact: '',
  });

  const { items, total, loading } = cart;

  const { name, address1, address2, zip, city, state, contact } = address;

  useEffect(() => {
    getCartWithTotal(user, token).then((res) => {
      if (res.data) {
        console.log('INSIDE Checkout');

        setCart({
          items: res.data.cartItems,
          total: res.data.total + 30,
          loading: false,
        });
      } else if (res.response && res.response.status === 401) {
        signout().then(() => {
          history.push('/signin');
        });
      }
    });
  }, [token]);

  const onChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  const onStateSelect = (option) => {
    setAddress({ ...address, state: option.value });
  };

  const addressVerification = () => {
    if (
      name === '' ||
      address1 === '' ||
      address2 === '' ||
      city === '' ||
      zip === '' ||
      state === '' ||
      contact === ''
    ) {
      toast.error('Please fill out all required fields.');
      return false;
    }

    if (zip.length !== 6) {
      toast.error('Please enter a valid zip code!');
      return false;
    }
    if (contact.length !== 10) {
      toast.error('Please enter a valid phone number!');
      return false;
    }
    return true;
  };

  const verifyPayment = async (
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    amount
  ) => {
    setCart({ ...cart, loading: true });

    try {
      await axios.post(`${api}/payment/verification`, {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      });

      console.log('Payment Verified');

      await axios.post(
        `${api}/order/create/${user._id}`,
        {
          order: {
            products: items,
            payment: {
              razorpay_payment_id,
              razorpay_order_id,
            },
            amount: amount,
            address: address,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Payment Successful');

      setCart({ ...cart, loading: false });
    } catch (err) {
      toast.error('Payment Failed!');
      setCart({ ...cart, loading: false });
      if (err.response && err.response.status === 401) {
        signout().then(() => {
          history.push('/signin');
        });
      }
    }
  };

  async function displayRazorpay() {
    if (addressVerification()) {
      const res = await loadScript(
        'https://checkout.razorpay.com/v1/checkout.js'
      );

      if (!res) {
        toast.error('Something went wrong. Please try again later!');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${isAuthenticated().token}`,
        },
      };
      try {
        const res = await axios.post(
          `${api}/payment/razorpay`,
          {
            amount: total,
          },
          config
        );

        const options = {
          key: process.env.REACT_APP_RAZORPAY_TEST,
          currency: res.data.currency,
          amount: Number(res.data.amount),
          order_id: res.data.id,
          name: 'Fashion Hub',
          image: '/logo.png',
          theme: {
            color: '#18a2b8',
          },
          handler: (response) =>
            verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature,
              res.data.amount
            ),
          prefill: {
            name: `${user.firstname} ${user.lastname}`,
            email: user.email,
            contact: contact,
          },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (err) {
        if (err.response && err.response.status === 401) {
          signout().then(() => {
            history.push('/signin');
          });
        }
        toast.error('Something went wrong. Please try again later!');
      }
    }
  }

  return (
    <Fragment>
      <ToastContainer />
      <Fragment>
        {loading ? (
          <Spinner />
        ) : (
          <div className='container mt-3 mb-5'>
            {' '}
            <div className='row text-white'>
              <div className='col-lg-6 offset-lg-0 col-md-6 offset-md-0 col-sm-10 offset-sm-1 col-10 offset-1'>
                <p className='lead mb-4 font-big font-sm-head'>
                  <i className='fas fa-shipping-fast mr-1'></i> Shipping Address
                </p>
                <div className='form-group'>
                  <label className='text-light'>
                    <i className='fa fa-star-of-life fa-xs text-danger'></i>
                    {'  '}Name
                  </label>
                  <input
                    className='form-control'
                    type='text'
                    name='name'
                    value={name}
                    onChange={(e) => onChange(e)}
                    placeholder='Full name'
                  />
                </div>

                <div className='form-group'>
                  <label className='text-light'>
                    <i className='fa fa-star-of-life fa-xs text-danger'></i>
                    {'  '}Address Line 1
                  </label>
                  <input
                    className='form-control'
                    type='text'
                    name='address1'
                    value={address1}
                    onChange={(e) => onChange(e)}
                    placeholder='Street / Building'
                  />
                </div>

                <div className='form-group'>
                  <label className='text-light'>
                    <i className='fa fa-star-of-life fa-xs text-danger'></i>
                    {'  '}Address Line 2
                  </label>
                  <input
                    className='form-control'
                    type='text'
                    name='address2'
                    value={address2}
                    onChange={(e) => onChange(e)}
                    placeholder='Floor / Apartment no.'
                  />
                </div>

                <div className='form-group'>
                  <label className='text-light'>
                    <i className='fa fa-star-of-life fa-xs text-danger'></i>
                    {'  '}Zip Code
                  </label>
                  <input
                    className='form-control'
                    type='text'
                    name='zip'
                    value={zip}
                    onChange={(e) => onChange(e)}
                    placeholder='Zip code (6-digit)'
                  />
                </div>

                <div className='form-group'>
                  <label className='text-light'>
                    <i className='fa fa-star-of-life fa-xs text-danger'></i>
                    {'  '}City
                  </label>
                  <input
                    className='form-control'
                    type='text'
                    name='city'
                    value={city}
                    onChange={(e) => onChange(e)}
                    placeholder='City'
                  />
                </div>

                <div className='form-group'>
                  <label className='text-light'>
                    <i className='fa fa-star-of-life fa-xs text-danger'></i>
                    {'  '}State
                  </label>
                  <Select
                    className='text-dark'
                    name='state'
                    options={stateList}
                    onChange={(option) => onStateSelect(option)}
                    placeholder='State'
                  />
                </div>

                <div className='form-group'>
                  <label className='text-light'>
                    <i className='fa fa-star-of-life fa-xs text-danger'></i>
                    {'  '}Contact
                  </label>
                  <input
                    className='form-control'
                    type='text'
                    name='contact'
                    value={contact}
                    onChange={(e) => onChange(e)}
                    placeholder='Phone number (10-digit)'
                  />
                </div>
              </div>

              <div className='col-lg-4 offset-lg-2 col-md-6 col-sm-12 col-12 text-white mt-5 pt-md-5 pt-0'>
                <div className='card text-white bg-dark cart-card pb-2 mb-4'>
                  <div className='card-body'>
                    <div className='row pt-3'>
                      <div className='col-12'>
                        <h3 className='lead font-weight-bold pb-1 font-sm-head'>
                          <span className='line-below pb-1'>Total Amount</span>
                        </h3>
                      </div>
                    </div>
                    <div className='row pt-3 font-sm-body'>
                      <div className='col-8'>Product amount</div>
                      <div className='col-lg-4 col-md-4 col-sm-3 col-4 text-right'>
                        {total - 30} ₹
                      </div>
                    </div>
                    <div className='row pt-3 font-sm-body'>
                      <div className='col-8'>Shipping charges</div>
                      <div className='col-lg-4 col-md-4 col-sm-3 col-4 text-right'>
                        30 ₹
                      </div>
                    </div>
                    <div className='row pt-3 font-sm-body'>
                      <div className='col-8 '>Taxes</div>
                      <div className='col-lg-4 col-md-4 col-sm-3 col-4 text-right'>
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
                      <div className='col-lg-4 col-md-4 col-sm-3 col-4 text-right'>
                        {total} ₹
                      </div>
                    </div>

                    <div className='row pt-4'>
                      <div className='col-12'>
                        <button
                          className='btn btn-block btn-info rounded'
                          onClick={displayRazorpay}
                        >
                          Pay with Razorpay
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Fragment>
    </Fragment>
  );
};

export default withRouter(Checkout);
