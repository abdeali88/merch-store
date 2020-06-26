import React, { Fragment, useState, useEffect } from 'react';
import NavPanel from './NavPanel';
import { Link, withRouter } from 'react-router-dom';
import Spinner from '../core/Spinner';
import { getCategory, updateCategory } from './helper/adminapicall';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { isAuthenticated, signout } from '../auth/helper';

const EditCategory = ({ history, match }) => {
  const { user, token } = isAuthenticated();

  const [formData, setFormData] = useState({
    name: '',
    loading: true,
    success: false,
  });

  const { name, loading, success } = formData;

  useEffect(() => {
    getCategory(match.params.categoryId)
      .then((category) => {
        setFormData({
          ...formData,
          name: category.name,
          loading: false,
        });
      })
      .catch((err) => {
        toast.error('Something went wrong. Please try again later!');
      });
  }, []);

  const onChange = (e) => setFormData({ ...formData, name: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormData({ ...formData, success: false, loading: true });
    try {
      const res = await updateCategory(user, token, match.params.categoryId, {
        name,
      });
      //res.data means ok response from backend
      //res.response means error from backend
      if (res.data) {
        setFormData({
          name: '',
          loading: false,
          success: true,
        });
        toast.success(`Category updated! `);
        setTimeout(() => {
          history.push('/admin/manage/category');
        }, 2000);
      } else {
        setFormData({
          ...formData,
          loading: false,
          success: false,
        });
        if (res.response && res.response.status === 401) {
          await signout();
          history.push('/');
        }
        if (res.response) {
          toast.error(res.response.data.msg);
        }
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again later!');
    }
  };

  return (
    <Fragment>
      <ToastContainer />
      {loading ? (
        <Spinner />
      ) : (
        <div className='container-fluid mt-5 pt-4 mb-5 pb-3'>
          <div className='row'>
            <NavPanel />
            <div className='col-lg-8 ml-lg-4 col-md-12 col-sm-12 col-12 ml-sm-4 ml-4'>
              <div className='bg-dark text-white mb-1 pb-1'>
                <p className='lead font-big pb-2 line-below'>
                  Update the category here !
                </p>
                <form onSubmit={(e) => onSubmit(e)}>
                  <div className='form-group'>
                    <label className='text-light'>
                      <i className='fa fa-star-of-life fa-xs text-danger'></i>
                      {'  '}Enter category name
                    </label>
                    <input
                      className='form-control col-md-4 col-9'
                      type='text'
                      name='name'
                      value={name}
                      autoFocus
                      onChange={(e) => onChange(e)}
                    />
                  </div>

                  <button
                    type='submit'
                    className='btn btn-success rounded mt-3 mr-4'
                  >
                    Submit
                  </button>

                  <Link
                    to='/admin/manage/category'
                    className='btn btn-info rounded mt-3'
                  >
                    Back
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default withRouter(EditCategory);
