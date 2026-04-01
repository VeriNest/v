import { Play, TrendingUp, Handshake } from "lucide-react";

const ValueProposition = () => {
  return (
    <section className="px-20 py-20 bg-[hsl(256,60%,10%)] text-white">
      {/* Top */}
      <div className="flex items-start justify-between mb-14">
        <h2 className="text-[32px] font-bold leading-tight max-w-md">
          We make it easy for{" "}
          <span className="italic font-serif text-primary">tenants</span> and{" "}
          <span className="italic font-serif">landowners</span>.
        </h2>
        <p className="text-sm text-white/50 max-w-sm leading-relaxed">
          Whether it's selling your current home, getting financing, or buying a new home, we make it easy and efficient. The best part? you'll save a bunch of money and time with our services.
        </p>
      </div>

      {/* Cards */}
      <div className="flex gap-5 mb-16 overflow-hidden">
        <div className="min-w-[340px] bg-primary rounded-2xl p-7">
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center mb-8">
            <Play className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Virtual home tour</h3>
          <p className="text-sm text-white/70 leading-relaxed">You can communicate directly with landowners and we provide you with virtual tour before you buy or rent the property.</p>
        </div>
        <div className="min-w-[340px] bg-[hsl(256,40%,16%)] rounded-2xl p-7 border border-white/10">
          <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center mb-8">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Find the best deal</h3>
          <p className="text-sm text-white/40 leading-relaxed">Browse thousands of properties, save your favorites and set up search alerts so you don't miss the best home deal!</p>
        </div>
        <div className="min-w-[340px] bg-[hsl(256,40%,16%)] rounded-2xl p-7 border border-white/10 opacity-60">
          <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center mb-8">
            <Handshake className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Get ready to apply</h3>
          <p className="text-sm text-white/40 leading-relaxed">Find your dream house? You just need to do a few steps.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center">
        <div className="flex-1 text-center">
          <p className="text-4xl font-bold text-white mb-1">7.4%</p>
          <p className="text-sm text-white/40">Property Return Rate</p>
        </div>
        <div className="w-px h-16 bg-white/15" />
        <div className="flex-1 text-center">
          <p className="text-4xl font-bold text-white mb-1">3,856</p>
          <p className="text-sm text-white/40">Property in Sell & Rent</p>
        </div>
        <div className="w-px h-16 bg-white/15" />
        <div className="flex-1 text-center">
          <p className="text-4xl font-bold text-white mb-1">2,540</p>
          <p className="text-sm text-white/40">Daily Completed Transactions</p>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
