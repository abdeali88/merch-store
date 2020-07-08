import React, { useEffect, useState, Fragment } from 'react';
import { getOrders } from './helper/userapicalls';
import { isAuthenticated, signout } from '../auth/helper/index';
import { withRouter, Link } from 'react-router-dom';
import Spinner from '../core/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Moment from 'react-moment';

const UserDashBoard = ({ history }) => {
  const { user, token } = isAuthenticated();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders(user, token)
      .then((res) => {
        if (res.data) {
          setOrders(res.data);
          setLoading(false);
        } else {
          if (res.response && res.response.status === 401) {
            signout().then(() => {
              history.push('/signin');
            });
          } else {
            history.push('/');
          }
        }
      })
      .catch((err) => {
        console.log(err);
        token.error('Something went wrong. Please try again later!');
      });
  }, [token]);

  return (
    <Fragment>
      <ToastContainer />
      <Fragment>
        {loading ? (
          <Spinner />
        ) : (
          <div className='container my-5'>
            <div className='row'>
              <div className='col-lg-8 ml-lg-4 col-md-12 col-sm-12 col-12'>
                <div className='card mb-4 '>
                  <h4 className='card-header card-borders font-sm-head'>
                    <i className='fa fa-user fa-sm mr-1 '></i> Personal
                    Information
                  </h4>
                  <ul className='list-group font-sm-body'>
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
            </div>

            <div className='row mt-4'>
              <div className='col-lg-8 ml-lg-4 col-md-12 col-sm-12 col-12'>
                <div className='card mb-4 '>
                  <h4 className='card-header card-borders font-sm-head'>
                    <i className='fa fa-box-open mr-2 fa-sm'></i>Order History
                  </h4>
                  {orders.length > 0 ? (
                    <ul className='list-group'>
                      {orders.map((order, index) => (
                        <li
                          className='list-group-item card-item py-3'
                          key={index}
                        >
                          <div className='row font-sm-body'>
                            <div className='col-lg-8 col-md-8 col-sm-12 col-12'>
                              <div className='row'>
                                <div className='col-lg-3 col-md-3 col-sm-3 col-4'>
                                  <h6 className='font-sm-body'> Order id </h6>
                                </div>
                                <div className='col-lg-9 col-md-9 col-sm-9 col-8'>{`${order._id}`}</div>
                              </div>

                              <div className='row mt-1'>
                                <div className='col-lg-3 col-md-3 col-sm-3 col-4'>
                                  <h6 className='font-sm-body'>Date</h6>
                                </div>
                                <div className='col-lg-9 col-md-9 col-sm-9 col-8'>
                                  <Moment format='MM/DD/YYYY'>
                                    {order.createdAt}
                                  </Moment>
                                </div>
                              </div>

                              <div className='row mt-1'>
                                <div className='col-lg-3 col-md-3 col-sm-3 col-4'>
                                  <h6 className='font-sm-body'> Amount </h6>
                                </div>
                                <div className='col-lg-9 col-md-9 col-sm-9 col-8'>
                                  {order.amount} ₹
                                </div>
                              </div>

                              <div className='row mt-1'>
                                <div className='col-lg-3 col-md-3 col-sm-3 col-4'>
                                  <h6 className='font-sm-body'>Items </h6>
                                </div>
                                <div className='col-lg-9 col-md-9 col-sm-9 col-8'>
                                  {order.products.length}
                                </div>
                              </div>

                              <div className='row mt-3 mb-2 hide-lg'>
                                <div className='col-6 '>
                                  <Link
                                    to={`/order/${order._id}`}
                                    className='btn btn-secondary rounded  btn-sm'
                                  >
                                    <i className='fa fa-eye mr-1'></i>
                                    View Order
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className='col-4 pt-4 hide-small'>
                              <Link
                                to={`/order/${order._id}`}
                                className='btn btn-secondary rounded'
                              >
                                <i className='fa fa-eye mr-1'></i>
                                View Order
                              </Link>
                            </div>
                          </div>
                        </li>
                      ))}

                      <li className='card-footer card-borders'></li>
                    </ul>
                  ) : (
                    <ul className='list-group'>
                      <li className='list-group-item card-item py-3'>
                        <div className='row'>
                          <div className='col-12'>
                            <h6 className='font-sm-body'>No orders yet!</h6>
                          </div>
                        </div>
                        <div className='row mt-2'>
                          <div className='col-12 hide-small'>
                            {' '}
                            <Link className='btn btn-secondary rounded ' to='/'>
                              Order Now !
                            </Link>
                          </div>
                          <div className='col-12 hide-lg'>
                            {' '}
                            <Link
                              className='btn btn-secondary rounded btn-sm '
                              to='/'
                            >
                              Order Now !
                            </Link>
                          </div>
                        </div>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Fragment>
    </Fragment>
  );
};

export default withRouter(UserDashBoard);
