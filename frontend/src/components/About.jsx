import shopImage from "../assets/images/hero.jpg";

function About() {
  return (
    <section
      id="about"
      className="py-20 bg-orange-50"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        <div>
          <img
            src={shopImage}
            alt="Shree Ladli"
            className="rounded-3xl shadow-xl"
          />
        </div>

        <div>

          <p className="text-orange-600 font-semibold uppercase">
            About Us
          </p>

          <h2 className="text-5xl font-bold mt-4">
            Welcome to
            <span className="text-orange-600">
              {" "}Shree Ladli
            </span>
          </h2>

          <p className="mt-6 text-gray-600 leading-8">
            Shree Ladli Sweets & Snacks is dedicated to serving fresh,
            authentic Indian sweets, namkeen, snacks, and fast food.
            Every item is prepared with premium ingredients, traditional
            recipes, and hygienic practices to bring you the true taste
            of happiness.
          </p>

          <div className="grid grid-cols-2 gap-6 mt-8">

            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="text-3xl font-bold text-orange-600">
                50+
              </h3>

              <p>Delicious Items</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="text-3xl font-bold text-orange-600">
                Fresh
              </h3>

              <p>Made Daily</p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default About;