import React, { Fragment, useEffect, useState } from 'react';
import Card from './Card';
import { getAllProducts } from './helper/coreapicalls';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Select from 'react-select';
import { Multiselect } from 'multiselect-react-dropdown';
import Spinner from './Spinner';
import { isAuthenticated, signout } from '../auth/helper';
import { getCartProducts } from '../user/helper/userapicalls';
import { withRouter } from 'react-router-dom';
import { getCategories } from '../admin/helper/adminapicall';
import { ConnectionStates } from 'mongoose';

const Home = ({ history }) => {
  const { user, token } = isAuthenticated();

  const [prods, setProds] = useState({
    products: [],
    loading: true,
  });

  const [allProducts, setAllProducts] = useState([]);

  const [cartProducts, setCartProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  const [catFilter, setCatFilter] = useState([]);

  const [sizeFilter, setSizeFilter] = useState([]);

  const [sort, setSort] = useState({
    sortBy: '_id',
    sortVal: 'asc',
  });

  const [buttonLoading, setbuttonLoading] = useState(true);

  const { products, loading } = prods;

  const { sortVal, sortBy } = sort;

  useEffect(() => {
    console.log('In');
    const productsPromise = getAllProducts([], [], '_id', 'asc');

    const categoriesPromise = getCategories();

    const cartProductsPromise = getCartProducts(user, token);

    Promise.all([productsPromise, categoriesPromise, cartProductsPromise])
      .then((data) => {
        const [products, categories, cartP] = data;
        const inStockProducts = products.filter((prod) => prod.stock > 0);
        setProds({
          products: inStockProducts,
          loading: false,
        });

        setAllProducts(products);

        setCategories(
          categories.map((category) => ({
            id: category._id,
            name: category.name,
          }))
        );

        if (cartP !== 0) {
          if (cartP.data) {
            setCartProducts(
              cartP.data.map((cartProd) => ({
                user: cartProd.user,
                product: cartProd.product,
              }))
            );
            setbuttonLoading(false);
          } else if (cartP.response && cartP.response.status === 401) {
            signout().then(() => {
              history.push('/signin');
            });
          }
        } else {
          setCartProducts([]);
          setbuttonLoading(false);
        }
      })
      .catch((err) => {
        toast.error('Something went wrong. Please try again later!');
      });
  }, [token]);

  //Change Cart Products
  function addCartProducts(productId) {
    setCartProducts([...cartProducts, { user: user._id, product: productId }]);
  }

  function removeCartProducts(productId) {
    setCartProducts(
      cartProducts.filter((cartProd) => cartProd.product !== productId)
    );
  }

  //Category Filter
  function catSelect(catList, cat, sizeList) {
    let newSizeList = [...sizeList];
    allProducts.forEach((product) => {
      if (product.category.name === cat.name) {
        newSizeList.push({ category: cat.name, size: product.size });
      }
    });

    setCatFilter(catList);
    setSizeFilter(newSizeList);

    getAllProducts(catList, newSizeList, sortBy, sortVal)
      .then((products) => {
        setProds({
          products: products,
          loading: false,
        });
      })
      .catch((err) => {
        toast.error('Something went wrong. Please try again later!');
      });
  }

  function catRemove(catList, cat, sizeList) {
    setCatFilter(catList);

    //Remove sizes of the corresponding removed category
    sizeList = sizeList.filter((size) => cat.name !== size.category);

    setSizeFilter(sizeList);
    getAllProducts(catList, sizeList, sortBy, sortVal)
      .then((products) => {
        setProds({
          products: products,
          loading: false,
        });
      })
      .catch((err) => {
        toast.error('Something went wrong. Please try again later!');
      });
  }

  //Size Filter
  function sizeSelect(catList, sizeList) {
    const sizeName = sizeList.map((size) => size.category);
    const newSizeList = [...sizeList];
    catList.forEach((cat) => {
      if (!sizeName.includes(cat.name)) {
        allProducts.forEach((prod) => {
          if (prod.category.name === cat.name)
            newSizeList.push({ category: cat.name, size: prod.size });
        });
      }
    });

    setCatFilter(catList);
    setSizeFilter(newSizeList);

    getAllProducts(catList, newSizeList, sortBy, sortVal)
      .then((products) => {
        setProds({
          products: products,
          loading: false,
        });
      })
      .catch((err) => {
        toast.error('Something went wrong. Please try again later!');
      });
  }

  function sizeRemove(catList, sizeList, remSize) {
    let newSizeList = [...sizeList];

    if (sizeList.length === 0) {
      newSizeList = [];
    } else if (
      sizeList.filter((size) => size.category === remSize.category).length === 0
    ) {
      allProducts.forEach((product) => {
        if (product.category.name === remSize.category) {
          newSizeList.push({ category: remSize.category, size: product.size });
        }
      });
    }

    setCatFilter(catList);
    setSizeFilter(newSizeList);

    getAllProducts(catList, newSizeList, sortBy, sortVal)
      .then((products) => {
        setProds({
          products: products,
          loading: false,
        });
      })
      .catch((err) => {
        toast.error('Something went wrong. Please try again later!');
      });
  }

  //Sort Filter
  function sortFilter(val) {
    setSort({
      sortBy: 'price',
      sortVal: val,
    });

    getAllProducts(catFilter, sizeFilter, 'price', val)
      .then((products) => {
        setProds({
          products: products,
          loading: false,
        });
      })
      .catch((err) => {
        toast.error('Something went wrong. Please try again later!');
      });
  }

  const cardList = [];
  products.forEach((product) => {
    const present =
      cartProducts.filter((cartProduct) => cartProduct.product === product._id)
        .length > 0
        ? true
        : false;
    cardList.push(
      <div
        key={product._id}
        className='col-lg-4 offset-lg-0 col-md-6 offset-md-0 col-sm-8 offset-sm-2 col-10 offset-1 mb-5'
      >
        <Card
          product={product}
          present={present}
          user={user}
          token={token}
          add={addCartProducts}
          remove={removeCartProducts}
          loading={buttonLoading}
          setLoading={setbuttonLoading}
        />
      </div>
    );
  });

  //Options in Size Filter
  const catSizes = [];
  allProducts
    .map((prod) => ({
      category: prod.category.name,
      size: prod.size,
    }))
    .forEach((prod) => {
      catFilter.forEach((cat) => {
        if (cat.name === prod.category) {
          catSizes.push(prod);
        }
      });
    });

  const filterStyle = {
    chips: {
      background: '#5cb85c',
    },
    searchBox: {
      backgroundColor: '#f7f7f7',
    },
    multiselectContainer: {
      backgroundColor: '#f7f7f7',
      border: 'none',
      borderBottom: '2px solid #18a2b8',
    },
  };

  return (
    <Fragment>
      <ToastContainer />
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className='container mt-4 mb-5'>
            <div className='row mb-5'>
              <div className='col-lg-4 col-md-4 offset-lg-0 offset-md-0 col-sm-8 offset-sm-2 offset-1 col-10 mb-md-0 mb-2'>
                <Multiselect
                  options={categories} // Options to display in the dropdown
                  onSelect={(catList, cat) =>
                    catSelect(catList, cat, sizeFilter)
                  }
                  onRemove={(catList, cat) =>
                    catRemove(catList, cat, sizeFilter)
                  }
                  displayValue='name'
                  // selectedValues={catFilter}
                  showCheckbox={true}
                  id='category'
                  placeholder='Category'
                  avoidHighlightFirstOption={true}
                  style={filterStyle}
                />
              </div>

              <div className='col-lg-4 col-md-4 offset-lg-0 offset-md-0 col-sm-8 offset-sm-2 offset-1 col-10 mb-md-0 mb-2'>
                <Multiselect
                  options={catSizes}
                  onSelect={(sizeList) => sizeSelect(catFilter, sizeList)}
                  onRemove={(sizeList, size) =>
                    sizeRemove(catFilter, sizeList, size)
                  }
                  groupBy='category'
                  id='size'
                  displayValue='size'
                  // selectedValues={sizeFilter}
                  showCheckbox={true}
                  placeholder='Size'
                  avoidHighlightFirstOption={true}
                  style={filterStyle}
                  disable={catFilter.length === 0 ? true : false}
                />
              </div>

              <div className='col-lg-4 col-md-4 offset-lg-0 offset-md-0 offset-1 col-sm-8 offset-sm-2 col-10 text-dark'>
                <Select
                  name='sort'
                  onChange={(option) => sortFilter(option.value)}
                  options={[
                    { value: 'asc', label: 'Price: Low to High' },
                    { value: 'desc', label: 'Price: High to Low' },
                  ]}
                  placeholder='Sort....'
                />
              </div>
            </div>
            <div className='row text-center'>{cardList}</div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default withRouter(Home);
