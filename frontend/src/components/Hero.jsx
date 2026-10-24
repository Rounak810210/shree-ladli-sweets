
import heroVideo from "../assets/videos/hero.mp4";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden"
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/70" />

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-28 sm:px-6">
        <div className="w-full max-w-5xl rounded-3xl border border-white/20 bg-black/25 px-5 py-10 text-center shadow-2xl backdrop-blur-md sm:px-10 sm:py-14 md:rounded-[40px] md:px-16 md:py-20">

          {/* Welcome Label */}
          <div className="mb-5 flex items-center justify-center gap-3 sm:mb-7">
            <div className="h-px w-8 bg-amber-400 sm:w-12" />

            <p className="text-xs font-bold uppercase tracking-[3px] text-amber-300 sm:text-sm sm:tracking-[5px]">
              Welcome To
            </p>

            <div className="h-px w-8 bg-amber-400 sm:w-12" />
          </div>

          {/* Brand Name */}
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Shree Ladli
            <span className="mt-1 block text-amber-300">
              Sweets & Snacks
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/85 sm:mt-8 sm:text-lg sm:leading-8 md:text-xl">
            Fresh sweets, delicious snacks and authentic Indian
            taste, prepared every day with love.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row sm:gap-5">
            <Link
              to="/menu"
              className="w-full rounded-xl bg-amber-500 px-8 py-4 font-bold text-white shadow-lg shadow-amber-900/30 transition duration-300 hover:-translate-y-1 hover:bg-amber-600 sm:w-auto"
            >
              Explore Menu <span aria-hidden="true">→</span>
            </Link>

            <Link
              to="/menu"
              className="w-full rounded-xl border border-white/50 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:bg-white/20 sm:w-auto"
            >
              Order Online
            </Link>
          </div>

          {/* Decorative Bottom Label */}
          <div className="mt-9 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[2px] text-amber-200/90 sm:mt-12">
            <span aria-hidden="true">✦</span>
            Made with love, served with tradition
            <span aria-hidden="true">✦</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
