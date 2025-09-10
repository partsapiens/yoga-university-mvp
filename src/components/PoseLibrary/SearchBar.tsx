export default function SearchBar({ value, onChange }) {
  return (
    <input
      className="w-full p-2 border rounded"
      type="text"
      placeholder="Search poses (English, Sanskrit, family)..."
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}