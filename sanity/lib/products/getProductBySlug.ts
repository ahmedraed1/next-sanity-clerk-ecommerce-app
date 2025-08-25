import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductBySlug = async (slug: string) => {
    const query = defineQuery(`*[_type == "product" && slug.current == $slug][0]`);
    try {
        const product = await sanityFetch({
            query: query, params: {
                slug:
                    slug
            }
        });
        return product.data || [];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}