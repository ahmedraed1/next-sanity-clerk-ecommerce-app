import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const searchProductsByName = async (searchParam: string) => {
    const searchQuery = defineQuery(`*[_type == "product" && name match $searchParam] | order(name asc)`);
    try {
        const products = await sanityFetch({
            query: searchQuery, params: {
                searchParam:
                    `*${searchParam}*`
            }
        });
        return products.data || [];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}
