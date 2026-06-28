export default function CategoryFilter({ onChange }) {
  const categories = ['All', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Toys', 'Automotive', 'Books'];
  return (
    <select 
      className="border p-2 rounded mb-4 w-full md:w-64"
      onChange={(e) => onChange(e.target.value)}
    >
      {categories.map(c => <option key={c} value={c}>{c}</option>)}
    </select>
  );
}