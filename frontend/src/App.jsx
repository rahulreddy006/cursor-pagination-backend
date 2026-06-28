import { useState, useEffect } from 'react';
import { fetchProducts } from './services/api';
import ProductGrid from './components/ProductGrid';
import CategoryFilter from './components/CategoryFilter';
import Loader from './components/Loader';

function App() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [meta, setMeta] = useState({ hasNextPage: false, nextCursor: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async (isLoadMore = false) => {
    try {
      setLoading(true);
      const res = await fetchProducts({ 
        category, 
        cursor: isLoadMore ? meta.nextCursor : null 
      });
      
      setProducts(prev => isLoadMore ? [...prev, ...res.data] : res.data);
      setMeta(res.meta);
    } catch (e) {
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(false); }, [category]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <CategoryFilter onChange={setCategory} />
      {error && <p className="text-red-500">{error}</p>}
      <ProductGrid products={products} />
      {loading && <Loader />}
      {!loading && meta.hasNextPage && (
        <button onClick={() => loadData(true)} className="mt-4 p-2 bg-blue-500 text-white rounded">
          Load More
        </button>
      )}
    </div>
  );
}
export default App;
