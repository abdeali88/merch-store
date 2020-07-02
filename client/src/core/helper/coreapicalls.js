import axios from 'axios';
import { api } from '../../utility/api';

//products
export const getAllProducts = async (catList, sizeList, sortBy, sortVal) => {
  const body = JSON.stringify({
    categories: catList,
    sizes: sizeList,
    sortBy,
    sortVal,
  });
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axios.post(`${api}/products`, body, config);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
