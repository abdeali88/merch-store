import axios from 'axios';
import { api } from '../../utility/api';

//products
export const getAllProducts = async () => {
  try {
    const res = await axios.get(`${api}/products`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
