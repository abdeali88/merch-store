import axios from 'axios';
import { api } from '../../utility/api';

//category
export const addCategory = async (user, token, formData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const body = JSON.stringify(formData);
    const res = await axios.post(
      `${api}/category/create/${user._id}`,
      body,
      config
    );
    return res;
  } catch (err) {
    return err;
  }
};

export const getCategories = async () => {
  try {
    const res = await axios.get(`${api}/categories`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const deleteCategory = async (user, token, categoryId) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.delete(
      `${api}/category/${categoryId}/${user._id}`,
      config
    );
    return res;
  } catch (err) {
    return err;
  }
};

export const getCategory = async (categoryId) => {
  try {
    const res = await axios.get(`${api}/category/${categoryId}`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const updateCategory = async (user, token, categoryId, formData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const body = JSON.stringify(formData);

    const res = await axios.put(
      `${api}/category/${categoryId}/${user._id}`,
      body,
      config
    );
    return res;
  } catch (err) {
    return err;
  }
};

//products
export const addProduct = async (user, token, formData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'mutipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.post(
      `${api}/product/create/${user._id}`,
      formData,
      config
    );
    return res;
  } catch (err) {
    return err;
  }
};

export const getProducts = async () => {
  try {
    const res = await axios.get(`${api}/products`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const deleteProduct = async (user, token, productId) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.delete(
      `${api}/product/${productId}/${user._id}`,
      config
    );
    return res;
  } catch (err) {
    return err;
  }
};

export const getProduct = async (productId) => {
  try {
    const res = await axios.get(`${api}/product/${productId}`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const updateProduct = async (user, token, productId, formData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'mutipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.put(
      `${api}/product/${productId}/${user._id}`,
      formData,
      config
    );
    return res;
  } catch (err) {
    return err;
  }
};
