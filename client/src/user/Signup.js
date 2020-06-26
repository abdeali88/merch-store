import React, { Fragment, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { signup, isAuthenticated } from '../auth/helper/index';
import { withRouter, Redirect } from 'react-router';
import Spinner from '../core/Spinner';

const Signup = ({ history }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    loading: false,
    success: false,
  });

  const { firstname, lastname, email, password, loading, success } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormData({ ...formData, success: false, loading: true });
    const successful = await signup({ firstname, lastname, email, password });
    if (successful === true) {
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        loading: false,
        success: true,
      });
    } else {
      setFormData({
        ...formData,
        loading: false,
        success: false,
      });
    }
  };

  if (isAuthenticated()) {
    return <Redirect to='/' />;
  }

  return (
    <Fragment>
      <ToastContainer autoClose={3000} />
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className='jumbotron bg-dark text-white text-center mb-1 pb-1'>
            <h2 className='display-4'>Sign Up!</h2>
            <p className='lead'>Create your account now.</p>
          </div>
          <div className='row mb-5 pb-5'>
            <div className='col-md-6 col-sm-8 col-10 offset-md-3 offset-sm-2 offset-1 text-left'>
              <form onSubmit={(e) => onSubmit(e)}>
                <div className='form-group'>
                  <label className='text-light'>
                    <i className='fa fa-user'></i> First name
                  </label>
                  <input
                    className='form-control'
                    type='text'
                    name='firstname'
                    value={formData.firstname}
                    onChange={(e) => onChange(e)}
                  />
                </div>
                <div className='form-group'>
                  <label className='text-light'>
                    <i className='fa fa-user'></i>
                    {'  '}Last name
                  </label>
                  <input
                    className='form-control'
                    type='text'
                    name='lastname'
                    value={formData.lastname}
                    onChange={(e) => onChange(e)}
                  />
                </div>
                <div className='form-group'>
                  <label className='text-light'>
                    <i className='fa fa-envelope'></i>
                    {'  '}Email
                  </label>
                  <input
                    className='form-control'
                    type='email'
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
                <button type='submit' className='btn btn-success rounded mt-3'>
                  Submit
                </button>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default withRouter(Signup);
