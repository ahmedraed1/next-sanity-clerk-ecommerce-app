import { CouponCode } from "./CouponCodes";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";



export async function getActiveSaleByCouponCode(couponCode: CouponCode) {
    const ACTIVE_SALE_BY_COUPON_CODE = `*[_type == "sales" && isActive == true && couponCode == $couponCode] | 
    order(validFrom desc)[0]`;

    const query = defineQuery(ACTIVE_SALE_BY_COUPON_CODE);
    try {
        const sale = await sanityFetch({ query, params: { couponCode } });
        return sale.data || null;
    } catch (error) {
        console.error("Error fetching sale:", error);
        return null;
    }
}