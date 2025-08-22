import ProductGrid from "./ProductGrid";
import CategoriesSelectorComponent from "./CategoriesSelectorComponent";

export default function ProductsView({ products, categories }: any) {
  return (
    <div>
      <div>
        <CategoriesSelectorComponent categories={categories} />
      </div>

      <div>
        <div>
          <ProductGrid products={products} />
          {/* {products.map((product: any) => (
            <div key={product._id}>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>{product.price}</p>
            </div>
          ))} */}
          <hr />
        </div>
      </div>
    </div>
  );
}
