"use client";

import {
  ClerkLoaded,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import Form from "next/form";
import { PackageIcon, TrolleyIcon } from "@sanity/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useBasketStore from "@/store/store";

export default function Header() {
  const { user } = useUser();

  const [query, setQuery] = useState("");
  const { getTotalItems } = useBasketStore();

  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-4 space-y-4 sm:space-y-0">
          {/* Logo */}
          <Link
            href="/"
            className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            Shopr
          </Link>

          {/* Search Bar */}
          <Form action={"/search"} className="w-full max-w-xl px-4">
            <div className="relative">
              <input
                type="text"
                name="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors duration-200 shadow-sm"
                placeholder="Search for products..."
              />
              <button
                type="submit"
                onClick={() => {
                  router.push(`/search?query=${query}`);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
              >
                🔍
              </button>
            </div>
          </Form>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            <Link
              href="/basket"
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-white  hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 relative"
            >
              <TrolleyIcon className="w-5 h-5" />
              <span className="hidden sm:inline">My Basket</span>

              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems() || 0}
              </span>
            </Link>

            <ClerkLoaded>
              {user && (
                <>
                  <Link
                    href="/orders"
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2 text-white  hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <PackageIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Orders</span>
                  </Link>
                </>
              )}

              {user ? (
                <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded-full">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        rootBox: "hover:scale-105 transition-transform",
                      },
                    }}
                  />
                  <div className="hidden sm:block">
                    <p className="text-xs text-gray-500">Welcome Back</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {user.fullName}
                    </p>
                  </div>
                </div>
              ) : (
                <SignInButton mode="modal" />
              )}
            </ClerkLoaded>
          </div>
        </div>
      </div>
    </header>
  );
}
