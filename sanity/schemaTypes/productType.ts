import { TrolleyIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from 'sanity'

type PreviewType = {
    title: string;
    media: string;
    price: string;
    subtitle?: string;
    category?: string;
}

export const productType = defineType({
    name: "product",
    title: "Product",
    type: "document",
    icon: TrolleyIcon,
    fields: [
        defineField({
            name: "name",
            title: "Name",
            type: "string",
        }),
        defineField({
            name: "price",
            title: "Price",
            type: "number",
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
        }),
        defineField({
            name: "image",
            title: "Image",
            type: "image",
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: "categories",
            title: "Categories",
            type: "array",
            of: [defineArrayMember({ type: 'reference', to: { type: 'category' } })],
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "name",
                maxLength: 96,
            },
        }),
        defineField({
            name: "stock",
            title: "Stock",
            type: "number"
        })
    ],
    preview: {
        select: {
            title: "name",
            media: "image",
            price: "price",
            subtitle: "slug",
            category: "category"
        },
        prepare(selection: PreviewType) {
            const { title, media, price } = selection;

            return {
                title,
                media,
                subtitle: `Price: $${price}`,
            };
        },
    },
});
