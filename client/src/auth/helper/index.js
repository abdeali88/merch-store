import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { api } from '../../utility/api';

export const signup = async (formData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify(formData);
    const res = await axios.post(`${api}/signup`, body, config);
    setUser(res.data);
    toast.success('Registered Successfully');
    return true;
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.msg);
    }
    return false;
  }
};

export const signin = async (formData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify(formData);
    const res = await axios.post(`${api}/signin`, body, config);
    setUser(res.data);
    return true;
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.msg);
    }
    return false;
  }
};

export const setUser = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt', JSON.stringify(data));
  }
};

export const signout = async () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt');
    try {
      await axios.get(`${api}/signout`);
    } catch (err) {
      console.log(err);
    }
  }
};

export const isAuthenticated = () => {
  if (typeof window == 'undefined') {
    return false;
  }
  if (localStorage.getItem('jwt')) {
    return JSON.parse(localStorage.getItem('jwt'));
  } else {
    return false;
  }
};
