import Link from "next/link";

type CategoryType = {
  description: string;
  slug: {
    _type: string;
    current: string;
  };
  title: string;
  _createdAt: string;
  _id: string;
};

export default function CategoriesSelectorComponent({
  categories,
}: {
  categories: CategoryType[];
}) {
  return (
    <div className="inline-flex rounded-md shadow-xs" role="group">
      <button
        type="button"
        className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 first:rounded-s-lg last:rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
      >
        All
      </button>
      {categories.map((category) => (
        <Link href={`/categories/${category.slug.current}`} key={category._id}>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 first:rounded-s-lg last:rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
          >
            {category.title}
          </button>
        </Link>
      ))}
    </div>
  );
}
