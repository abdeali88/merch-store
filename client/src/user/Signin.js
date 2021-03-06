import React, { Fragment, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { signin, isAuthenticated, setUser } from '../auth/helper/index';
import { Redirect } from 'react-router';
import Spinner from '../core/Spinner';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { api } from '../utility/api';
import axios from 'axios';

const Signin = ({ history }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    loading: false,
  });

  const { email, password, loading } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormData({ ...formData, loading: true });
    const res = await signin({ email, password });
    if (res.data) {
      setFormData({
        email: '',
        password: '',
        loading: false,
      });
    } else {
      setFormData({
        ...formData,
        loading: false,
      });
    }
  };

  if (isAuthenticated()) {
    return <Redirect to='/' />;
  }

  const sendGoogleToken = (tokenId) => {
    axios
      .post(`/api/signin/google`, {
        idToken: tokenId,
      })
      .then((res) => {
        console.log(res.data);

        if (res.data) {
          setUser(res.data);
          if (isAuthenticated()) {
            history.push('/');
          }
        }

        if (res.response && res.response.status === 400) {
          toast.error(res.response.error.msg);
        }
      })
      .catch((error) => {
        console.log('GOOGLE SIGNIN ERROR', error);
        toast.error('Google Signin failed!');
      });
  };

  const sendFacebookToken = (userID, accessToken) => {
    axios
      .post(`/api/signin/facebook`, {
        userID,
        accessToken,
      })
      .then((res) => {
        console.log(res.data);

        if (res.data) {
          setUser(res.data);
          if (isAuthenticated()) {
            history.push('/');
          }
        }

        if (res.response && res.response.status === 400) {
          toast.error(res.response.error.msg);
        }
      })
      .catch((error) => {
        console.log('FACEBOOK SIGNIN ERROR', error);
        toast.error('Facebook Signin failed!');
      });
  };

  const responseGoogle = (response) => {
    console.log(response);
    sendGoogleToken(response.tokenId);
  };

  const responseFacebook = (response) => {
    console.log(response);
    sendFacebookToken(response.userID, response.accessToken);
  };

  return (
    <Fragment>
      <ToastContainer autoClose={3000} />
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          {' '}
          <div className='jumbotron bg-dark text-white text-center mb-1 pb-1'>
            <h2 className='display-4 font-sm-big'>Sign In!</h2>
            <p className='lead font-sm-head'>Login to order now !</p>
          </div>
          <div className='row mb-4'>
            <div className='col-md-4 col-sm-6 col-8 offset-md-4 offset-sm-3 offset-2 text-left'>
              <form onSubmit={(e) => onSubmit(e)}>
                <div className='form-group'>
                  <label className='text-light'>
                    <i className='fa fa-envelope'></i>
                    {'  '}Email
                  </label>
                  <input
                    className='form-control'
                    type='text'
                    name='email'
                    value={formData.email}
                    onChange={(e) => onChange(e)}
                  />
                </div>

                <div className='form-group'>
                  <label className='text-light'>
                    <i className='fa fa-unlock-alt'></i>
                    {'  '}Password
                  </label>
                  <input
                    className='form-control'
                    type='password'
                    name='password'
                    value={formData.password}
                    onChange={(e) => onChange(e)}
                  />
                </div>
                <div className='text-center mt-3 pt-1'>
                  <button
                    type='submit'
                    className='btn btn-block btn-success rounded mt-3'
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className='row pt-3 mb-4'>
            <div className='col-md-4 col-sm-6 col-8 offset-md-4 offset-sm-3 offset-2 text-white lead line-below'></div>
          </div>
          <div className='row mb-5 pb-5 pt-2'>
            <div className='col-lg-2 offset-lg-4 col-md-4 offset-md-4 mb-md-4 col-sm-6 offset-sm-3 mb-sm-4 col-8 offset-2 mb-4 text-center'>
              <GoogleLogin
                clientId={`${process.env.REACT_APP_GOOGLE_CLIENT}`}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className='btn btn-block btn-google rounded py-2'
                  >
                    <i className='fab fa-google text-light' />
                    <span className='ml-2 text-light'>
                      Sign In with <b>Google</b>
                    </span>
                  </button>
                )}
              />
            </div>
            <div className='col-lg-2 offset-lg-0 col-md-4 offset-md-4 col-sm-6 offset-sm-3 col-8 offset-2 text-center'>
              <FacebookLogin
                appId={`${process.env.REACT_APP_FACEBOOK_CLIENT}`}
                autoLoad={false}
                callback={responseFacebook}
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    className='btn btn-block btn-facebook rounded py-2'
                  >
                    <i className='fab fa-facebook-f text-light' />
                    <span className='ml-2 text-light'>
                      Sign In with <b>Facebook</b>
                    </span>
                  </button>
                )}
              />
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Signin;
