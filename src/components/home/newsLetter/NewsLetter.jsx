export default function Newsletter() {
  return (
    <section className="py-8 sm:py-10 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            bg-[#111111]
            px-5
            py-12
            sm:rounded-[28px]
            sm:px-8
            sm:py-16
            md:rounded-[32px]
            md:py-20
            lg:px-12
          "
        >
          {/* Background Circles */}

          <div
            className="
              absolute
              -bottom-16
              -left-16
              h-40
              w-40
              rounded-full
              bg-emerald-900/40
              sm:-bottom-20
              sm:-left-20
              sm:h-56
              sm:w-56
            "
          />

          <div
            className="
              absolute
              -right-10
              -top-10
              h-32
              w-32
              rounded-full
              bg-emerald-900/40
              sm:-right-12
              sm:-top-12
              sm:h-48
              sm:w-48
            "
          />

          {/* Content */}

          <div
            className="
              relative
              z-10
              mx-auto
              max-w-3xl
              text-center
            "
          >
            <h2
              className="
                text-2xl
                font-bold
                text-white
                sm:text-3xl
                md:text-4xl
              "
            >
              Stay in the Loop
            </h2>

            <p
              className="
                mx-auto
                mt-3
                max-w-2xl
                text-xs
                leading-6
                text-gray-400
                sm:text-sm
                sm:leading-7
                md:text-base
              "
            >
              Subscribe to get exclusive deals, early access to new products,
              and 10% off your first order.
            </p>

            {/* Form */}

            <form
              className="
                mx-auto
                mt-6
                flex
                w-full
                max-w-xl
                flex-col
                gap-3
                sm:mt-8
                sm:flex-row
                sm:gap-3
              "
            >
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-gray-700
                  bg-[#2B2B2B]
                  px-4
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-gray-400
                  focus:border-emerald-500
                  sm:h-14
                  sm:flex-1
                  sm:rounded-2xl
                  sm:px-5
                  sm:text-base
                  md:px-6
                  md:text-lg
                "
              />

              <button
                type="submit"
                className="
                  h-12
                  w-full
                  rounded-xl
                  bg-emerald-600
                  px-6
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-emerald-700
                  sm:h-14
                  sm:w-auto
                  sm:rounded-2xl
                  sm:px-8
                  sm:text-base
                  md:px-10
                  md:text-lg
                "
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
