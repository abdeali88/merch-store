import React, { Fragment, useState, useEffect } from 'react';
import NavPanel from './NavPanel';
import Spinner from '../core/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { isAuthenticated, signout } from '../auth/helper';
import { getAllOrders, updateOrderStatus } from './helper/adminapicall';
import { withRouter, Link } from 'react-router-dom';
import Select from 'react-select';

const ManageOrder = ({ history }) => {
  const { user, token } = isAuthenticated();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    getAllOrders(user, token)
      .then((res) => {
        if (res.data) {
          setOrders(res.data);
          setLoading(false);
          setReload(false);
        } else {
          if (res.response && res.response.status === 401) {
            signout().then(() => {
              history.push('/');
            });
          }
          if (res.response) {
            toast.error('Something went wrong. Please try again later!');
          }
        }
      })
      .catch((err) => {
        toast.error('Something went wrong. Please try again later!');
      });
  }, [token, reload]);

  function onSelectStatus(option, orderId) {
    updateOrderStatus(user, token, orderId, { status: option.value })
      .then((res) => {
        if (res.data) {
          setReload(true);
        } else {
          if (res.response && res.response.status === 401) {
            signout().then(() => {
              history.push('/');
            });
          }
          if (res.response) {
            toast.error('Something went wrong. Please try again later!');
          }
        }
      })
      .catch(() => {
        toast.error('Something went wrong. Please try again later!');
      });
  }

  return (
    <Fragment>
      <ToastContainer />
      <div className='container-fluid mt-5 pt-4 mb-5 pb-3'>
        <div className='row'>
          <NavPanel />
          <div className='col-lg-8 ml-lg-4 col-md-12 col-sm-12 col-12 ml-sm-4 ml-4'>
            {loading ? (
              <Spinner />
            ) : (
              <Fragment>
                <div className='bg-dark text-white mb-1 pb-1'>
                  <p className='lead font-big pb-2 line-below'>
                    Manage Orders here !
                  </p>
                </div>
                {orders.length === 0 && (
                  <p className='lead font-big text-white '>No Orders found.</p>
                )}
                {orders.length > 0 &&
                  orders.map((order, index) => (
                    <div key={index} className='row line-below text-white mb-4'>
                      <div className='col-md-4 col-sm-12 col-12 mb-md-0 mb-sm-4 mb-4'>
                        {order._id}
                      </div>
                      <div className='col-md-2 col-sm-3 col-3 mb-md-0 mb-sm-4 mb-4'>
                        {order.amount} ₹
                      </div>
                      <div className='col-md-2 col-sm-3 col-3 mb-md-0 mb-sm-4 mb-4'>
                        {order.products.length} Items
                      </div>
                      <div className='hide-lg col-sm-6 col-6 text-dark'>-</div>

                      <div className='col-md-3 col-sm-5 col-6 mb-md-0 pb-3'>
                        <Select
                          name='category'
                          onChange={(option) =>
                            onSelectStatus(option, order._id)
                          }
                          options={[
                            { value: 'Recieved', label: 'Recieved' },
                            { value: 'Processing', label: 'Processing' },
                            { value: 'Shipped', label: 'Shipped' },
                            { value: 'Delivered', label: 'Delivered' },
                            { value: 'Cancelled', label: 'Cancelled' },
                          ]}
                          className='text-dark'
                          defaultValue={{
                            value: order.status,
                            label: order.status,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default withRouter(ManageOrder);
