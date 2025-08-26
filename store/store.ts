import { create } from "zustand"
import { persist } from "zustand/middleware"

type productType = {
    _id: string;
    name: string;
    price: number;
    image: { url: string }[];
    slug: { current: string };
    stock: number;
};

export interface BasketItem {
    product: productType;
    quantity: number;
}

// Import the GroupedBasketItem type from the actions file
import { GroupedBasketItem } from "@/actions/createCheckoutSession";

interface BasketState {
    basket: BasketItem[];
    addProduct: (product: productType) => void;
    removeProduct: (product: productType) => void;
    incrementProduct: (product: productType) => void;
    decrementProduct: (product: productType) => void;
    getTotalPrice: () => number;
    getItemCount: (productId?: string) => number;
    clearBasket: () => void;
    getGroupedItems: () => GroupedBasketItem[];
    getTotalItems: () => number;
}


const useBasketStore = create<BasketState>()(
    persist(
        (set, get) => ({
            basket: [],
            addProduct: (product: productType) => {
                const basket = get().basket;
                const existingItem = basket.find((item) => item.product._id === product._id);
                if (existingItem) {
                    set({
                        basket: basket.map((item) =>
                            item.product._id === product._id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({
                        basket: [...basket, { product, quantity: 1 }],
                    });
                }
            },
            removeProduct: (product: productType) => {
                const basket = get().basket;
                set({
                    basket: basket.filter((item) => item.product._id !== product._id),
                });
            },
            getTotalPrice: () => {
                const basket = get().basket;
                return basket.reduce((total, item) => total + item.product.price * item.quantity, 0);
            },
            getItemCount: (productId?: string) => {
                const basket = get().basket;
                if (productId) {
                    const item = basket.find(item => item.product._id === productId);
                    return item ? item.quantity : 0;
                }
                return basket.reduce((total, item) => total + item.quantity, 0);
            },
            clearBasket: () => {
                set({
                    basket: [],
                });
            },
            incrementProduct: (product: productType) => {
                const basket = get().basket;
                set({
                    basket: basket.map((item) =>
                        item.product._id === product._id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                });
            },
            decrementProduct: (product: productType) => {
                const basket = get().basket;
                const updatedBasket = basket.map((item) =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                ).filter(item => item.quantity > 0);

                set({ basket: updatedBasket });
            },
            getGroupedItems: () => {
                const basket = get().basket;
                // First group by product ID
                const groupedByProductId = basket.reduce((grouped, item) => {
                    const { product, quantity } = item;
                    grouped[product._id] = grouped[product._id] || [];
                    grouped[product._id].push({ product, quantity });
                    return grouped;
                }, {} as Record<string, BasketItem[]>);
                
                // Then convert to array format expected by createCheckoutSession
                return Object.values(groupedByProductId).flatMap(items => {
                    // For each group, we only need one item since they all have the same product
                    if (items.length > 0) {
                        return [{
                            product: items[0].product,
                            quantity: items.reduce((total, item) => total + item.quantity, 0)
                        }];
                    }
                    return [];
                });
            },
            getTotalItems: () => {
                const basket = get().basket;
                return basket.reduce((total, item) => total + item.quantity, 0);
            },
        }),
        { name: "basket-storage" }
    )
);

export default useBasketStore