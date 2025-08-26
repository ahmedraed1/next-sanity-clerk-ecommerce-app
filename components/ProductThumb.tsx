import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

export default function ProductThumb({
  product,
}: {
  product: {
    name: string;
    price: number;
    image: { url: string }[];
    slug: { current: string };
    stock: number;
  };
}) {
  return product.stock > 0 ? (
    <Link href={`/product/${product.slug.current}`}>
      <div className="group cursor-pointer">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <img
            src={urlFor(product.image).url()}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
          <p className="text-lg font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  ) : (
    <div className="group cursor-pointer relative">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <img
          src={urlFor(product.image).url()}
          alt={product.name}
          className="object-cover w-full h-full opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            Out of Stock
          </span>
        </div>
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-medium text-gray-500">{product.name}</h3>
        <p className="text-lg font-semibold text-gray-500">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
