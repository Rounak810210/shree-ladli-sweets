import bestSellers from "../data/product";

function BestSellers() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <p className="text-orange-500 uppercase tracking-[4px] font-semibold">
            Our Specials
          </p>

          <h2 className="text-5xl font-bold mt-3">
            Best Sellers
          </h2>

          <p className="text-gray-500 mt-5 max-w-2xl mx-auto">
            Taste our most loved sweets prepared fresh every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {bestSellers.map((item) => (

           <div
  key={item.id}
  className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group cursor-pointer"
>
<div className="absolute top-4 left-4 z-10 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
  ⭐ Best Seller
</div>
              <img
                src={item.image}
                alt={item.name}
               className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="p-6">

                <h3 className="text-3xl font-bold tracking-tight">
                  {item.name}
                </h3>

                <p className="text-orange-500 text-xl font-bold mt-2">
                  {item.price}
                </p>

 <div className="flex items-center mt-2">
    <span className="text-yellow-500 text-lg">
      {"⭐".repeat(item.rating)}
    </span>
  </div>



                <p className="text-gray-500 mt-3 text-sm">
                  {item.description}
                </p>
<button
  className="mt-6 w-full rounded-xl bg-orange-500 py-3 text-white font-semibold transition-all duration-300 hover:bg-orange-600 hover:scale-105"
>
  Order Now
</button>

                
              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default BestSellers;