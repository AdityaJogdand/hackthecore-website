import * as React from "react";

const ULogo = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.667 31.69" {...props}>
    <path d="M12.827,1.628A1.561,1.561,0,0,1,14.31,0h2.964a1.561,1.561,0,0,1,1.483,1.628v11.9a9.252,9.252,0,0,1-2.432,6.852q-2.432,2.409-6.963,2.409T2.4,20.452Q0,18.094,0,13.669V1.628A1.561,1.561,0,0,1,1.483,0h2.98A1.561,1.561,0,0,1,5.947,1.628V13.191a5.635,5.635,0,0,0,.85,3.451,3.153,3.153,0,0,0,2.632,1.094,3.032,3.032,0,0,0,2.582-1.076,5.836,5.836,0,0,0,.816-3.486Z" />
    <path d="M75.207,20.857a1.561,1.561,0,0,1-1.483,1.628h-2.98a1.561,1.561,0,0,1-1.483-1.628V1.628A1.561,1.561,0,0,1,70.743,0h2.98a1.561,1.561,0,0,1,1.483,1.628Z" transform="translate(-45.91 0)" />
    <path d="M0,80.018A1.561,1.561,0,0,1,1.483,78.39h26.7a1.561,1.561,0,0,1,1.483,1.628v2.006a1.561,1.561,0,0,1-1.483,1.628H1.483A1.561,1.561,0,0,1,0,82.025Z" transform="translate(0 -51.963)" />
  </svg>
);

const GlassCard = React.forwardRef(({
  className = "",
  style = {},
  title = "Monochrome",
  subtitle = "Create, share, and use beautiful custom elements made with CSS.",
  tags = [],
  amount = "",
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`group [perspective:1000px] ${className}`}
      style={{
        height: 300,
        width: 290,
        overflow: "visible",
        ...style,
      }}
      {...props}
    >
      <div
        className="relative h-full rounded-[50px] bg-gradient-to-br from-zinc-900 to-black shadow-2xl transition-all duration-500 ease-in-out [transform-style:preserve-3d] group-hover:[box-shadow:rgba(0,0,0,0.3)_30px_50px_25px_-40px,rgba(0,0,0,0.1)_0px_25px_30px_0px] group-hover:[transform:rotate3d(1,1,0,30deg)]"
        style={{ overflow: "visible" }}
      >
        <div className="absolute inset-2 rounded-[55px] border-b border-l border-white/20 bg-gradient-to-b from-white/30 to-white/10 backdrop-blur-sm [transform-style:preserve-3d] [transform:translate3d(0,0,25px)]"></div>
        <div className="absolute [transform:translate3d(0,0,26px)]">
          <div className="px-7 pt-[100px] pb-0">
            <span className="block text-xl font-black text-white">{title}</span>
            <span className="mt-5 block text-[15px] text-zinc-300">{subtitle}</span>
          </div>
        </div>
        {(tags && tags.length) || amount ? (
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between [transform-style:preserve-3d] [transform:translate3d(0,0,26px)]">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {tags && tags.map((t, idx) => (
                <div key={idx} style={{ fontFamily: "Inter, Manrope, SF Pro Display, sans-serif", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.03)", padding: "6px 10px", borderRadius: 8 }}>{t}</div>
              ))}
            </div>
            {amount ? (
              <div style={{ fontFamily: "Inter, Manrope, SF Pro Display, sans-serif", fontSize: 18, fontWeight: 900, color: "#FFFF00" }}>{amount}</div>
            ) : null}
          </div>
        ) : (
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between [transform-style:preserve-3d] [transform:translate3d(0,0,26px)]">
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ width: 30, height: 30, borderRadius: 9999, background: "#fff", display: "grid", placeContent: "center", fontSize: 11, fontWeight: 700, color: "#000" }}>IG</button>
              <button style={{ width: 30, height: 30, borderRadius: 9999, background: "#fff", display: "grid", placeContent: "center", fontSize: 11, fontWeight: 700, color: "#000" }}>TW</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button className="border-none bg-none text-xs font-bold text-white">View more</button>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        )}
        <div className="absolute top-0 right-0 [transform-style:preserve-3d]" style={{ overflow: "visible" }}>
          {[
            { size: "170px", pos: "8px", z: "20px", delay: "0s" },
            { size: "140px", pos: "10px", z: "40px", delay: "0.4s" },
            { size: "110px", pos: "17px", z: "60px", delay: "0.8s" },
            { size: "80px", pos: "23px", z: "80px", delay: "1.2s" },
          ].map((circle, index) => (
            <div
              key={index}
              className="absolute aspect-square rounded-full bg-white/10 shadow-[rgba(100,100,111,0.2)_-10px_10px_20px_0px] transition-all duration-500 ease-in-out"
              style={{
                width: circle.size,
                top: circle.pos,
                right: circle.pos,
                transform: `translate3d(0, 0, ${circle.z})`,
                transitionDelay: circle.delay,
              }}
            />
          ))}
          <div
            className="absolute grid aspect-square w-[50px] place-content-center rounded-full bg-white shadow-[rgba(100,100,111,0.2)_-10px_10px_20px_0px] transition-all duration-500 ease-in-out [transform:translate3d(0,0,100px)] [transition-delay:1.6s] group-hover:[transform:translate3d(0,0,120px)]"
            style={{ top: "30px", right: "30px" }}
          >
            <ULogo className="w-5 fill-black" />
          </div>
        </div>
      </div>
    </div>
  );
});

GlassCard.displayName = "GlassCard";

export default GlassCard;