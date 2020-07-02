import axios from 'axios';
import { api } from '../../utility/api';

export const addToCart = async (productId, user, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.put(
      `${api}/user/add/cart/${user._id}/${productId}`,
      null,
      config
    );
    return res;
  } catch (err) {
    return err;
  }
};

export const removeFromCart = async (productId, user, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.put(
      `${api}/user/remove/cart/${user._id}/${productId}`,
      null,
      config
    );
    return res;
  } catch (err) {
    return err;
  }
};

export const updateCart = async (productId, qty, user, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const body = JSON.stringify(qty);

    const res = await axios.put(
      `${api}/user/update/cart/${user._id}/${productId}`,
      body,
      config
    );
    return res;
  } catch (err) {
    return err;
  }
};

export const getCartProducts = async (user, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(
      `${api}/user/cart/products/${user._id}`,
      config
    );
    return res;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getCart = async (user, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`${api}/user/cart/${user._id}`, config);
    return res;
  } catch (err) {
    console.log(err);
    return err;
  }
};
