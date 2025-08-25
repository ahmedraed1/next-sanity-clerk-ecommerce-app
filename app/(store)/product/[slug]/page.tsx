import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "next-sanity";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const description = await product.description;
  console.log(product);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square relative">
          {product.image && (
            <img
              src={urlFor(product.image).url()}
              alt={product.name}
              className="object-cover rounded-lg"
            />
          )}
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="prose max-w-none mb-6">
            {Array.isArray(description) && <PortableText value={description} />}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-semibold">${product.price}</span>
            <span className="text-sm text-gray-500">
              Stock: {product.stock} units
            </span>
          </div>
          <button
            disabled={product.stock === 0}
            className="bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
