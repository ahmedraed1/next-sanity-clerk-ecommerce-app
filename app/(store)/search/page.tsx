import { searchProductsByName } from "@/sanity/lib/products/searchProductsByName";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

type productType = {
  _id: string;
  name: string;
  price: number;
  image: { url: string }[];
  slug: { current: string };
  stock: number;
};

export default async function Page({
  searchParams,
}: {
  searchParams: {
    query: string;
  };
}) {
  const { query } = await searchParams;
  const products = await searchProductsByName(query);
  const productsLength = await products.length;
  console.log(products);
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600">{productsLength} items found</p>
        </div>

        {productsLength === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-600">No products found</h2>
            <p className="mt-2 text-gray-500">
              Try searching with different keywords
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product: productType) => (
              <Link
                href="/product/[slug]"
                as={`/product/${product.slug.current}`}
                key={product._id}
              >
                <div
                  className={`group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${product.stock === 0 ? "opacity-75" : ""}`}
                >
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg">
                    <img
                      src={urlFor(product.image).url()}
                      alt={product.name}
                      className="h-64 w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-medium text-gray-900 mb-2">
                      {product.name}
                    </h2>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </p>
                      <span
                        className={`px-2 py-1 text-sm rounded ${
                          product.stock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
