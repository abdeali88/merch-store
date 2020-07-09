import React, { Fragment } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth/helper/index';
import { withRouter } from 'react-router';

const Navbar = ({ history }) => {
  return (
    <Fragment>
      <nav className='navbar bg-dark'>
        <h3 className='hide-sm'>
          <Link to='/'>
            <i className='fas fa-tshirt fa-sm mr-1'></i>
            {' Fashion Hub'}
          </Link>
        </h3>

        <ul>
          <li>
            <NavLink activeClassName='activeLink' exact to='/'>
              <i className='fa fa-home text-white mr-1 nav-icons'> </i>
              <span className='hide-sm'>{' Home'}</span>
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName='activeLink' to='/cart'>
              <i className='fa fa-shopping-cart text-white mr-1 nav-icons'> </i>
              <span className='hide-sm'>{' Cart'}</span>{' '}
            </NavLink>
          </li>
          {isAuthenticated() && isAuthenticated().user.role === 0 && (
            <li>
              <NavLink activeClassName='activeLink' to='/user/dashboard'>
                <i className='fa fa-user-circle text-white mr-1 nav-icons'> </i>
                <span className='hide-sm'>{' Account'}</span>
              </NavLink>
            </li>
          )}
          {isAuthenticated() && isAuthenticated().user.role === 1 && (
            <li>
              <NavLink activeClassName='activeLink' to='/admin/dashboard'>
                <i className='fa fa-user-shield text-white mr-1 nav-icons'></i>
                <span className='hide-sm'>{' Admin'}</span>
              </NavLink>
            </li>
          )}
          {!isAuthenticated() && (
            <li>
              <NavLink activeClassName='activeLink' to='/signup'>
                <i className='fas fa-user-plus text-white mr-1 nav-icons'></i>
                <span className='hide-sm'>{' Sign Up'}</span>
              </NavLink>
            </li>
          )}
          {!isAuthenticated() && (
            <li>
              <NavLink activeClassName='activeLink' to='/signin'>
                <i className='fa fa-sign-in text-white mr-1 nav-icons'></i>
                <span className='hide-sm'>{' Sign In'}</span>
              </NavLink>
            </li>
          )}
          {isAuthenticated() && (
            <li>
              <span
                className='text-white'
                style={{
                  cursor: 'pointer',
                  paddingRight: '0.7rem',
                  margin: '0 1rem',
                }}
                onClick={async () => {
                  await signout();
                  history.push('/');
                }}
              >
                <i className='fa fa-sign-out-alt text-white mr-1 nav-icons'></i>
                <span className='hide-sm'>{' Logout'}</span>
              </span>
            </li>
          )}
        </ul>
      </nav>
    </Fragment>
  );
};

export default withRouter(Navbar);

// <Fragment>
//   <NavLink to='/' activeStyle={activeLink}>
//     Home
//   </NavLink>
//   <NavLink to='/dashboard' activeClassName={activeLink}>
//     {' '}
//     Dashboard{' '}
//   </NavLink>
//   <NavLink to='/cart' activeClassName={activeLink}>
//     {' '}
//     Cart{' '}
//   </NavLink>
//   <NavLink to='/signin' activeClassName={activeLink}>
//     {' '}
//     Login{' '}
//   </NavLink>
// </Fragment>;
