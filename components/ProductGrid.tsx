import ProductThumb from "./ProductThumb";

export default function ProductGrid({ products }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((product: any) => (
        <div
          key={product._id}
          className="transform transition duration-300 hover:scale-105"
        >
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <ProductThumb product={product} />
          </div>
        </div>
      ))}
    </div>
  );
}
