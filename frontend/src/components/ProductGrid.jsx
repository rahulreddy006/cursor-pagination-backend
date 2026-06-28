import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  if (products.length === 0) return <p className="text-gray-500 italic">No products found.</p>;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}