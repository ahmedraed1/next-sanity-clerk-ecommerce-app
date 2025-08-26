import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductsByCategory = async (category: string) => {
    const query = defineQuery(`*[_type == "product" && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(name asc)`);
    try {
        const products = await sanityFetch({ query, params: { categorySlug: category } });
        return products.data || []
    } catch (error) {
        console.error("Error fetching products:", error);
        return []
    }
};