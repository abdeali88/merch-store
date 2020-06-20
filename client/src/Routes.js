import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './core/Home';
import Navbar from './core/Navbar';
import Footer from './core/Footer';
import Signup from './user/Signup';
import Signin from './user/Signin';
import UserDashBoard from './user/UserDashBoard';
import AdminDashBoard from './user/AdminDashBoard';
import PrivateRoute from './auth/helper/PrivateRoute';
import AdminRoute from './auth/helper/AdminRoute';

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
            <AdminRoute
              path='/admin/dashboard'
              exact
              component={AdminDashBoard}
            />
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
