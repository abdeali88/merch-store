import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './styles.css';
import Home from './core/Home';
import Navbar from './core/Navbar';
import Footer from './core/Footer';
import Signup from './user/Signup';
import Signin from './user/Signin';
import UserDashBoard from './user/UserDashBoard';
import AdminDashBoard from './user/AdminDashBoard';
import PrivateRoute from './auth/helper/PrivateRoute';
import AdminRoute from './auth/helper/AdminRoute';
import AddCategory from './admin/AddCategory';
import AddProduct from './admin/AddProduct';
import ManageProduct from './admin/ManageProduct';
import ManageCategory from './admin/ManageCategory';
import EditProduct from './admin/EditProduct';
import EditCategory from './admin/EditCategory';
import Cart from './user/Cart';
import Checkout from './user/Checkout';
import Thankyou from './user/Thankyou';
import PageNotFound from './core/PageNotFound';
import Order from './user/Order';

function Routes() {
  return (
    <div className='App'>
      <Router>
        <header>
          <Navbar />
        </header>
        <main>
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/signup' exact component={Signup} />
            <Route path='/signin' exact component={Signin} />
            <PrivateRoute
              path='/user/dashboard'
              exact
              component={UserDashBoard}
            />
            <PrivateRoute path='/cart' exact component={Cart} />
            <PrivateRoute path='/checkout' exact component={Checkout} />
            <PrivateRoute
              path='/thankyou/:orderId'
              exact
              component={Thankyou}
            />
            <PrivateRoute path='/order/:orderId' exact component={Order} />

            <AdminRoute
              path='/admin/dashboard'
              exact
              component={AdminDashBoard}
            />
            <AdminRoute
              path='/admin/create/category'
              exact
              component={AddCategory}
            />
            <AdminRoute
              path='/admin/manage/category'
              exact
              component={ManageCategory}
            />
            <AdminRoute
              path='/admin/create/product'
              exact
              component={AddProduct}
            />
            <AdminRoute
              path='/admin/manage/product'
              exact
              component={ManageProduct}
            />
            <AdminRoute
              path='/admin/update/product/:productId'
              exact
              component={EditProduct}
            />
            <AdminRoute
              path='/admin/update/category/:categoryId'
              exact
              component={EditCategory}
            />
            <Route component={PageNotFound} />
          </Switch>
        </main>
        <footer>
          <Footer />
        </footer>
      </Router>
    </div>
  );
}

export default Routes;
