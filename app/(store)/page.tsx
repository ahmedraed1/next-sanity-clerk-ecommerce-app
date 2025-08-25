import ProductsView from "@/components/ProductsView";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import BlackFridayBanner from "@/components/BlackFridayBanner";

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();
  return (
    <div>
      <BlackFridayBanner />
      <div>
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  );
}
