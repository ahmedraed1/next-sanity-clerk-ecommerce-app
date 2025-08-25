export const COUPON_CODES = {
    BFRIDAY: "BFRIDAY",
    XMAS2026: "XMAS2026",
    NY2026: "NY2026"
} as const

export type CouponCode = keyof typeof COUPON_CODES