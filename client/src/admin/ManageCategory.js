import React, { Fragment, useState, useEffect } from 'react';
import NavPanel from './NavPanel';
import Spinner from '../core/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { isAuthenticated, signout } from '../auth/helper';
import { getCategories, deleteCategory } from './helper/adminapicall';
import { withRouter, Link } from 'react-router-dom';

const ManageCategory = ({ history }) => {
  const { user, token } = isAuthenticated();

  const [cats, setCats] = useState({
    categories: [],
    loading: true,
  });

  const { categories, loading } = cats;

  const handleDelete = async (categoryId) => {
    try {
      setCats({ ...cats, loading: true });

      const res = await deleteCategory(user, token, categoryId);
      if (res.data) {
        setCats({ ...cats, loading: false });
        toast.success('Category Removed!');
      } else {
        if (res.response && res.response.status === 401) {
          await signout();
          history.push('/signin');
        }
        if (res.response) {
          toast.error('Something went wrong. Please try again later!');
        }
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again later!');
    }
  };

  useEffect(() => {
    getCategories()
      .then((categories) => {
        setCats({
          categories: categories,
          loading: false,
        });
      })
      .catch((err) => {
        toast.error('Something went wrong. Please try again later!');
      });
  }, [handleDelete]);

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
                    Manage categories here !
                  </p>
                </div>
                {categories.length === 0 && (
                  <p className='lead font-big text-white '>
                    No Category found.
                  </p>
                )}
                {categories.length > 0 &&
                  categories.map((category, index) => (
                    <div key={index} className='row line-below text-white mb-4'>
                      <div className='col-md-3 col-sm-6 col-6'>
                        {category.name}
                      </div>
                      <div className='col-1 mr-md-0 mr-sm-5 mr-5'>
                        <Link
                          to={`/admin/update/category/${category._id}`}
                          className=' btn btn-success'
                        >
                          <i className='fa fa-pencil'></i>
                        </Link>
                      </div>
                      <div className='col-1'>
                        <button
                          className=' btn btn-danger'
                          onClick={() => handleDelete(category._id)}
                        >
                          <i className='fas fa-trash'></i>
                        </button>
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

export default withRouter(ManageCategory);
