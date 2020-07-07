import React from 'react';
import { isAuthenticated } from '../auth/helper/index';
import NavPanel from '../admin/NavPanel';

const AdminDashBoard = () => {
  const { user } = isAuthenticated();

  const adminInfo = (
    <div className='col-lg-8 ml-lg-4 col-md-12 col-sm-12 col-12'>
      <div className='card mb-4'>
        <h4 className='card-header card-borders'>Admin Information</h4>
        <ul className='list-group'>
          <li className='list-group-item card-item'>
            <span className='badge badge-success mr-2'>Name:</span>{' '}
            {user.firstname} {user.lastname}
          </li>
          <li className='list-group-item card-item'>
            <span className='badge badge-success mr-2'>Email:</span>{' '}
            {user.email}
          </li>
          <li className='card-footer card-borders'></li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className='container-fluid mt-5 pt-4 mb-5 pb-3'>
      <div className='row'>
        <NavPanel />
        {adminInfo}
      </div>
    </div>
  );
};

export default AdminDashBoard;
