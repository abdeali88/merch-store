import { Link } from 'react-router-dom';
import React from 'react';

const NavPanel = () => {
  return (
    <div className='col-lg-3 ml-lg-3 col-md-12 mb-md-5 col-sm-12 mb-sm-5 col-12 mb-5 mr-md-5 ml-1'>
      <div className='card'>
        <h4 className='card-header bg-dark text-white'>
          <i className='fa fa-user-shield mr-2'></i> Admin Navigation{' '}
        </h4>
        <ul className='list-group'>
          <li className='list-group-item card-item'>
            <Link
              to='/admin/create/category'
              className='nav-link text-dark font-weight-bold'
            >
              <i className='fa fa-plus-circle mr-2'></i>
              Create Category
            </Link>
          </li>
          <li className='list-group-item card-item'>
            <Link
              to='/admin/manage/category'
              className='nav-link text-dark font-weight-bold'
            >
              <i className='fa fa-tools mr-2'></i>
              Manage Categories
            </Link>
          </li>
          <li className='list-group-item card-item'>
            <Link
              to='/admin/create/product'
              className='nav-link text-dark font-weight-bold'
            >
              <i className='fa fa-plus-circle mr-2'></i>
              Create Product
            </Link>
          </li>
          <li className='list-group-item card-item'>
            <Link
              to='/admin/manage/product'
              className='nav-link text-dark font-weight-bold'
            >
              <i className='fa fa-tools mr-2'></i>
              Manage Products
            </Link>
          </li>
          <li className='list-group-item card-item'>
            <Link
              to='/admin/orders'
              className='nav-link text-dark font-weight-bold'
            >
              <i className='fa fa-tools mr-2'></i>
              Manage Orders
            </Link>
          </li>
        </ul>
        <div className='card-footer card-borders'></div>
      </div>
    </div>
  );
};

export default NavPanel;
