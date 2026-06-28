export default function ProductCard({ product }) {
  return (
    <div className="border p-4 rounded shadow-sm">
      <h2 className="font-bold text-lg">{product.name}</h2>
      <p className="text-sm text-gray-500">{product.category}</p>
      <p className="text-green-600 font-semibold">${product.price}</p>
      <p className="text-xs text-gray-400">Updated: {new Date(product.updated_at).toLocaleDateString()}</p>
    </div>
  );
}