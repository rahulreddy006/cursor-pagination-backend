import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'});

export const fetchProducts = async ({ category, cursor }) => {
  const params = { limit: 40 };
  if (category && category !== 'All') params.category = category;
  if (cursor) {
    params.cursor_updated_at = cursor.updated_at;
    params.cursor_id = cursor.id;
  }
  
  const { data } = await api.get('/products', { params });
  return data; // Returns { success, data, meta }
};