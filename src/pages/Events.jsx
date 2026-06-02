import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const Events = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const FONT = "clamp(5rem, 14vw, 11rem)";
  const ease = [0.22, 1, 0.36, 1];

  return (
    <>
     <Navbar />
      {/* HERO SECTION */}
      <section className="w-full bg-[#035b5a] p-6">
        <div className="relative h-[100vh] w-full overflow-hidden rounded-[36px] bg-[#035b5a] mt-5">
          {/* IMAGE */}
          <motion.div
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={
              phase === 1
                ? { width: 500, height: 380, opacity: 1 }
                : phase === 2
                ? { width: "99%", height: "85%", opacity: 1 }
                : {}
            }
            transition={{ duration: 1.2, ease }}
            className="absolute left-1/2 top-1/2 z-10 overflow-hidden rounded-[28px]"
            style={{ x: "-50%", y: "-50%" }}
          >
            <img
              src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2000"
              alt=""
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* OVERLAY */}
         

          {/* TEXT */}
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">
            <motion.h1
              initial={{ y: 0 }}
              animate={
                phase === 1
                  ? { y: -120 }
                  : phase === 2
                  ? { y: 0 }
                  : { y: 0 }
              }
              transition={{ duration: 1, ease }}
              className="font-black uppercase text-[#D7FF3F]"
              style={{
                fontSize: FONT,
                lineHeight: 0.88,
                letterSpacing: "-0.02em",
              }}
            >
              SHOW UP
            </motion.h1>

            <motion.h1
              initial={{ y: 0 }}
              animate={
                phase === 1
                  ? { y: 120 }
                  : phase === 2
                  ? { y: 0 }
                  : { y: 0 }
              }
              transition={{ duration: 1, ease }}
              className="font-black uppercase text-[#D7FF3F]"
              style={{
                fontSize: FONT,
                lineHeight: 0.88,
                letterSpacing: "-0.02em",
              }}
            >
              STAND OUT
            </motion.h1>
          </div>
        </div>
      </section>

      {/* BENTO SECTION */}
      <section className="bg-[#035b5a] px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-7xl"
        >
          <h2 className="mb-10 text-6xl font-black uppercase text-[#D7FF3F]">
            Tech Events
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Main */}
            <motion.div
              whileHover={{ y: -8 }}
              className="col-span-2 row-span-2 rounded-[32px] bg-[#D7FF3F] p-8 text-[#035b5a]"
            >
              <p className="text-sm font-semibold uppercase tracking-widest">
                Featured Event
              </p>

              <h3 className="mt-4 text-6xl font-black leading-none">
                TECH
                <br />
                SUMMIT
                <br />
                2026
              </h3>

              <p className="mt-6 text-lg">
                Meet founders, developers and recruiters from top companies.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -8 }}
              className="rounded-[32px] bg-white/10 p-6 text-white backdrop-blur-xl"
            >
              <h3 className="text-3xl font-bold">AI</h3>
              <p className="mt-2 text-white/70">
                GenAI Workshops
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -8 }}
              className="rounded-[32px] bg-white/10 p-6 text-white backdrop-blur-xl"
            >
              <h3 className="text-3xl font-bold">48H</h3>
              <p className="mt-2 text-white/70">
                Hackathon
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -8 }}
              className="col-span-2 rounded-[32px] bg-white/10 p-6 text-white backdrop-blur-xl"
            >
              <h3 className="text-4xl font-bold">
                Networking Lounge
              </h3>

              <p className="mt-3 text-white/70">
                Connect with recruiters, startups and founders.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -8 }}
              className="rounded-[32px] bg-white/10 p-6 text-white backdrop-blur-xl"
            >
              <h3 className="text-5xl font-black">20+</h3>
              <p className="mt-2 text-white/70">
                Speakers
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -8 }}
              className="rounded-[32px] bg-white/10 p-6 text-white backdrop-blur-xl"
            >
              <h3 className="text-5xl font-black">500+</h3>
              <p className="mt-2 text-white/70">
                Opportunities
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Events;