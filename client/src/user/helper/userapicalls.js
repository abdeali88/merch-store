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
  if (
    user === undefined ||
    token === undefined ||
    user === null ||
    token === null
  ) {
    return 0;
  }

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

export const checkInStock = async (user, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(
      `${api}/user/check/cart/stock/${user._id}`,
      config
    );
    return res;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getCartWithTotal = async (user, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`${api}/user/cart/total/${user._id}`, config);
    return res;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getOrder = async (user, token, orderId) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`${api}/order/${user._id}/${orderId}`, config);
    return res;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getOrders = async (user, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`${api}/user/orders/${user._id}`, config);
    return res;
  } catch (err) {
    console.log(err);
    return err;
  }
};
