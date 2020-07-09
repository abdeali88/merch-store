import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className='footer-copyright text-center text-white py-3'>
      <div>
        {' '}
        © 2020{' '}
        <Link
          to='/'
          className='text-white font-weight-bold text-decoration-none'
        >
          Fashion Hub
        </Link>
      </div>
      <hr className='social-line' />
      <div className='row'>
        <div className='col-xs-12 col-sm-12 col-md-12'>
          <ul className='list-unstyled list-inline social text-center'>
            <li className='list-inline-item mx-2'>
              <Link to='/'>
                <i className='fa fa-facebook-square social'></i>
              </Link>
            </li>
            <li className='list-inline-item mx-2'>
              <Link to='/'>
                <i className='fa fa-twitter social'></i>
              </Link>
            </li>
            <li className='list-inline-item mx-2'>
              <Link to='/'>
                <i className='fa fa-instagram social'></i>
              </Link>
            </li>
            <li className='list-inline-item mx-2'>
              <Link to='/'>
                <i className='fa fa-google-plus social'></i>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
