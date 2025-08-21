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

export default function Header() {
  const { user } = useUser();
  return (
    <header className="flex flex-wrap justify-between items-center px-4 py-2">
      <div>
        <Link
          href="/"
          className="text-2xl font-bold text-blue-500 hover:opacity-50 cursor-pointer mx-auto sm:mx-0"
        >
          Shopr
        </Link>

        <Form
          action={"/search"}
          className="w-full sm:w-auto sm:flex-1 sm:mx-4 mt-2 sm:mt-0"
        >
          <input
            type="text"
            name="query"
            className="border border-gray-300 rounded-md px-2 py-1"
            placeholder="Search for products"
          />
        </Form>
        <div>
          <Link
            href="/basket"
            className="inline-flex items-center text-lg font-semibold bg-blue-500 px-4 py-2 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
          >
            <TrolleyIcon className="w-6 h-6" />
            <span>My Basket</span>
          </Link>

          <ClerkLoaded>
            {user && (
              <Link
                href="/orders"
                className="inline-flex items-center text-lg font-semibold bg-blue-500 px-4 py-2 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
              >
                <PackageIcon className="w-6 h-6" />
                My Orders
              </Link>
            )}
            {user ? (
              <div className="flex items-center space-x-2">
                <UserButton afterSignOutUrl="/" />

                <div className="hidden sm:block text-xs">
                  <p className="text-gray-400">Welcome Back</p>
                  <p className="font-semibold">{user.fullName}</p>
                </div>
              </div>
            ) : (
              <SignInButton mode="modal" />
            )}
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
}
