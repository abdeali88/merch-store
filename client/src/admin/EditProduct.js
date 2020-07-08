import React, { useState, useEffect, Fragment } from 'react';
import NavPanel from './NavPanel';
import { Link, withRouter } from 'react-router-dom';
import {
  getCategories,
  getProduct,
  updateProduct,
} from './helper/adminapicall';
import Spinner from '../core/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { isAuthenticated, signout } from '../auth/helper';
import Select from 'react-select';

const EditProduct = ({ history, match }) => {
  const { user, token } = isAuthenticated();

  const [values, setvalues] = useState({
    name: '',
    material: '',
    color: '',
    size: '',
    gender: { label: '', value: '' },
    price: '',
    stock: '',
    category: { label: '', value: '' },
    categories: [],
    formData: '',
    loading: true,
    success: false,
  });

  const {
    name,
    material,
    color,
    size,
    gender,
    price,
    stock,
    categories,
    category,
    formData,
    loading,
    success,
  } = values;

  useEffect(() => {
    getProduct(match.params.productId)
      .then((product) => {
        getCategories().then((categories) => {
          setvalues({
            name: product.name,
            material: product.material,
            color: product.color,
            size: product.size,
            gender: {
              label: product.gender ? product.gender : '',
              value: product.gender ? product.gender : 0,
            },
            price: product.price,
            stock: product.stock,
            category: {
              label: product.category ? product.category.name : '',
              value: product.category ? product.category._id : 0,
            },
            categories: categories.map((category) => ({
              label: category.name,
              value: category._id,
            })),
            formData: new FormData(),
            success: false,
            loading: false,
          });
        });
      })
      .catch((err) => {
        toast.error('Something went wrong. Please try again later!');
      });
  }, [token]);

  const onChange = (e) => {
    if (e.target.name === 'images') {
      let len = e.target.files.length;
      for (var i = 0; i < len; i++) {
        formData.append('images', e.target.files[i]);
      }
    } else {
      const value = e.target.value;
      setvalues({ ...values, [e.target.name]: value });
    }
  };

  const onSelectCategory = (option) => {
    setvalues({ ...values, category: option });
  };

  const onSelectGender = (option) => {
    setvalues({ ...values, gender: option });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    formData.set('name', name);
    formData.set('material', material);
    formData.set('color', color);
    formData.set('category', category.value);
    formData.set('size', size);
    formData.set('price', price);
    formData.set('stock', stock);
    formData.set('gender', gender.value);

    setvalues({ ...values, success: false, loading: true });
    try {
      const res = await updateProduct(
        user,
        token,
        match.params.productId,
        formData
      );
      if (res.data) {
        setvalues({
          name: '',
          material: '',
          color: '',
          size: '',
          gender: {},
          price: '',
          stock: '',
          category: {},
          categories: [],
          formData: '',
          loading: false,
          success: true,
        });
        toast.success('Product Updated!');
        setTimeout(() => {
          history.push('/admin/manage/product');
        }, 2000);
      } else {
        setvalues({
          ...values,
          loading: false,
          success: false,
        });
      }
      if (res.response && res.response.status === 401) {
        await signout();
        history.push('/');
      }
      if (res.response) {
        toast.error(res.response.data.msg);
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again later!');
    }
  };

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
                    Update the product here !
                  </p>
                  <form
                    onSubmit={(e) => onSubmit(e)}
                    encType='multipart/form-data'
                  >
                    <div className='row'>
                      <div className='col-lg-5 col-md-9 col-sm-9 col-9'>
                        <div className='form-group'>
                          <label className='text-light'>
                            <i className='fa fa-star-of-life fa-xs text-danger'></i>
                            {'  '}Name
                          </label>
                          <input
                            type='text'
                            name='name'
                            className='form-control'
                            value={name}
                            onChange={(e) => onChange(e)}
                          />
                        </div>
                        <div className='form-group'>
                          <label className='text-light'>
                            <i className='fa fa-star-of-life fa-xs text-danger'></i>
                            {'  '}Color
                          </label>
                          <input
                            type='text'
                            name='color'
                            className='form-control'
                            value={color}
                            onChange={(e) => onChange(e)}
                          />
                        </div>
                        <div className='form-group'>
                          <label className='text-light'>
                            <i className='fa fa-star-of-life fa-xs text-danger'></i>
                            {'  '}Category
                          </label>
                          <Select
                            name='category'
                            onChange={(option) => onSelectCategory(option)}
                            options={values.categories}
                            className='text-dark'
                            defaultValue={values.category}
                          />
                        </div>
                        <div className='form-group'>
                          <label className='text-light'>
                            <i className='fa fa-star-of-life fa-xs text-danger'></i>
                            {'  '}Stock
                          </label>
                          <input
                            type='text'
                            name='stock'
                            className='form-control'
                            value={stock}
                            onChange={(e) => onChange(e)}
                          />
                        </div>
                        <div className='form-group'>
                          <label className='text-light'>
                            <i className='fa fa-star-of-life fa-xs text-danger'></i>
                            {'  '}Gender
                          </label>
                          <Select
                            name='gender'
                            onChange={(option) => onSelectGender(option)}
                            options={[
                              { label: 'Male', value: 'Male' },
                              { label: 'Female', value: 'Female' },
                            ]}
                            className='text-dark'
                            defaultValue={values.gender}
                          />
                        </div>
                      </div>

                      <div className='col-lg-5 offset-lg-1 col-md-9 col-sm-9 col-9'>
                        <div className='form-group'>
                          <label className='text-light'>
                            <i className='fa fa-star-of-life fa-xs text-danger'></i>
                            {'  '}Material
                          </label>
                          <input
                            type='text'
                            name='material'
                            className='form-control'
                            value={material}
                            onChange={(e) => onChange(e)}
                          />
                        </div>
                        <div className='form-group'>
                          <label className='text-light'>
                            <i className='fa fa-star-of-life fa-xs text-danger'></i>
                            {'  '}Size
                          </label>
                          <input
                            type='text'
                            name='size'
                            className='form-control'
                            value={size}
                            onChange={(e) => onChange(e)}
                          />
                        </div>
                        <div className='form-group'>
                          <label className='text-light'>
                            <i className='fa fa-star-of-life fa-xs text-danger'></i>
                            {'  '}Price
                          </label>
                          <input
                            type='text'
                            name='price'
                            className='form-control'
                            value={price}
                            onChange={(e) => onChange(e)}
                          />
                        </div>
                        <div className='form-group'>
                          <label className='text-light'>
                            <i className='fa fa-star-of-life fa-xs text-danger'></i>
                            {'  '}Images
                          </label>
                          <input
                            type='file'
                            name='images'
                            className='form-control-file'
                            accept='image/*'
                            multiple
                            onChange={(e) => onChange(e)}
                          />
                        </div>
                        <div className='form-group mt-5'>
                          <button
                            type='submit'
                            className='btn btn-success rounded mr-4'
                          >
                            Submit
                          </button>
                          <Link
                            to='/admin/dashboard'
                            className='btn btn-info rounded'
                          >
                            Back
                          </Link>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default withRouter(EditProduct);
