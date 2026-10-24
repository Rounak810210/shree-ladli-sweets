import categories from "../data/categories";
function Categories() {
  console.log(categories);
  return (
    <section
      id="categories"
      className="py-24 bg-gradient-to-b from-white via-orange-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-6">

        <p className="text-orange-500 font-semibold uppercase tracking-[6px] text-center">
          Explore Our Menu
        </p>

        <h2 className="text-5xl font-bold text-center mt-4 text-gray-900">
          Shop by Categories
        </h2>

        <p className="text-gray-500 text-center mt-5 max-w-2xl mx-auto leading-8">
          From authentic Indian sweets to crispy snacks, delicious fast food,
          and refreshing beverages, discover everything freshly prepared at
          Shree Ladli Sweets & Snacks.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
  {categories.map((category) => (
    <div
      key={category.id}
     className="
group
bg-white
rounded-3xl
overflow-hidden
shadow-lg
hover:shadow-2xl
hover:-translate-y-3
transition-all
duration-500
cursor-pointer
"
    >
      <img
  src={category.image}
  alt={category.title}
  className="
    w-full
    h-56
    object-cover
    group-hover:scale-110
    transition-transform
    duration-700
  "
/>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900">
          {category.title}
        </h3>

        <p className="text-gray-500 mt-3">
          {category.description}
        </p>
      </div>
    </div>
  ))}
</div>

      </div>
    </section>
  );
}

export default Categories;