import { COUPON_CODES } from "@/sanity/lib/sals/CouponCodes";
import { getActiveSaleByCouponCode } from "@/sanity/lib/sals/getActiveSaleByCouponCode";
export default async function BlackFridayBanner() {
  const sale = await getActiveSaleByCouponCode(COUPON_CODES.BFRIDAY);

  return (
    <div className="bg-black text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">{sale.title}</h2>
            <p className="text-gray-300">{sale.description}</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xl font-semibold mb-2">
              Save ${sale.discountedAmount} OFF
            </p>
            <p className="bg-white text-black px-4 py-2 rounded font-bold">
              Use code: {sale.couponCode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
