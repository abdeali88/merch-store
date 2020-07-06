import React, { Fragment, useState, useEffect } from 'react';
import NavPanel from './NavPanel';
import Spinner from '../core/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { isAuthenticated, signout } from '../auth/helper';
import { getProducts, deleteProduct } from './helper/adminapicall';
import { withRouter, Link } from 'react-router-dom';

const ManageProduct = ({ history }) => {
  const { user, token } = isAuthenticated();

  const [prods, setProds] = useState({
    products: [],
    loading: true,
  });

  const { products, loading } = prods;

  const handleDelete = async (productId) => {
    try {
      setProds({ ...prods, loading: true });

      const res = await deleteProduct(user, token, productId);
      if (res.data) {
        setProds({ ...prods, loading: false });
        toast.success('Product Removed!');
      } else {
        if (res.response && res.response.status === 401) {
          await signout();
          history.push('/');
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
    getProducts([], [], '_id', 'asc')
      .then((products) => {
        setProds({
          products: products,
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
                    Manage products here !
                  </p>
                </div>
                {products.length === 0 && (
                  <p className='lead font-big text-white '>
                    No products found.
                  </p>
                )}
                {products.length > 0 &&
                  products.map((product, index) => (
                    <div key={index} className='row line-below text-white mb-4'>
                      <div className='col-md-6 col-sm-12 col-12 mb-md-0 mb-sm-4 mb-4'>
                        {`${product.name} (${product.gender[0]})`}
                      </div>
                      <div className='col-md-2 col-sm-3 col-3 mb-md-0 mb-sm-4 mb-4'>
                        {product.color}
                      </div>
                      <div className='col-md-2 col-sm-3 col-3 mb-md-0 mb-sm-4 mb-4'>
                        {product.size}
                      </div>
                      <div className='hide-lg col-sm-6 col-6 text-dark'>-</div>

                      <div className='col-md-1 col-sm-3 col-3 mb-md-0'>
                        <Link
                          to={`/admin/update/product/${product._id}`}
                          className=' btn btn-success mr-4'
                        >
                          <i className='fa fa-pencil'></i>
                        </Link>
                      </div>
                      <div className='col-md-1 col-sm-3 col-3 mb-md-0'>
                        <button
                          className=' btn btn-danger'
                          onClick={() => handleDelete(product._id)}
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

export default withRouter(ManageProduct);
