import { defineField, defineType, defineArrayMember } from "sanity";


export const salesType = defineType({
    name: "sales",
    title: "Sales",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
        }),
        defineField({
            name: "products",
            title: "Products",
            type: "array",
            of: [defineArrayMember({ type: 'reference', to: { type: 'product' } })],
        }),
        defineField({
            name: "total",
            title: "Total",
            type: "number",
        }),
        defineField({
            name: "discountedAmount",
            title: "Discounted Amount",
            type: "number",
            description: "Discounted Amount",
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
        }),
        defineField({
            name: "couponCode",
            title: "Coupon Code",
            type: "string",
            description: "Coupon Code used for discount",
            validation: (Rule) => Rule.required().min(4).max(10),
        }),
        defineField({
            name: "validFrom",
            title: "Valid From",
            type: "datetime",
            description: "Date from which coupon is valid",
            options: {
                dateFormat: "YYYY-MM-DD",
            },
        }),
        defineField({
            name: "validUntil",
            title: "Valid Until",
            type: "datetime",
            description: "Date until which coupon is valid",
            options: {
                dateFormat: "YYYY-MM-DD",
            },
        }),
        defineField({
            name: "isActive",
            title: "Is Active",
            type: "boolean",
            description: "Is the coupon active or not",
            initialValue: true
        }),

    ],
    preview: {
        select: {
            title: "title",
            discountAmount: "discountedAmount",
            couponCode: "couponCode",
            isActive: "isActive"
        },
        prepare(selection) {
            const { title, discountAmount, couponCode, isActive } = selection;
            return {
                title: title,
                subtitle: `${discountAmount}% off | ${couponCode} | ${isActive ? "Active" : "Inactive"}`,

            };
        }
    },
});