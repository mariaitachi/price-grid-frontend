import PriceGrid from '../components/PriceGrid';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 px-4">
      <h1 className="text-3xl font-bold text-center mt-6 mb-4">Price Grid Table</h1>
      <PriceGrid />
    </main>
  );
}
