import { Play, TrendingUp, Handshake } from "lucide-react";

const ValueProposition = () => {
  return (
    <section className="px-20 py-20 bg-[hsl(256,60%,10%)] text-white">
      {/* Top */}
      <div className="flex items-start justify-between mb-12">
        <h2 className="text-3xl font-bold leading-tight max-w-md">
          We make it easy for{" "}
          <span className="italic text-primary">tenants</span> and{" "}
          <span className="italic text-primary">landowners</span>.
        </h2>
        <p className="text-sm text-white/60 max-w-sm leading-relaxed">
          Whether it's selling your current home, getting financing, or buying a new home, we make it easy and efficient. The best part? you'll save a bunch of money and time with our services.
        </p>
      </div>

      {/* Cards */}
      <div className="flex gap-6 mb-16">
        <div className="flex-1 bg-primary rounded-2xl p-8 flex flex-col justify-between min-h-[200px]">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-6">
            <Play className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Virtual home tour</h3>
            <p className="text-sm text-white/70">You can communicate directly with landowners and we provide you with virtual tour before buying.</p>
          </div>
        </div>
        <div className="flex-1 bg-[hsl(256,40%,16%)] rounded-2xl p-8 flex flex-col justify-between min-h-[200px]">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Find the best deal</h3>
            <p className="text-sm text-white/50">Browse thousands of properties, save your favorites and set up search alerts so you don't miss the best home deal!</p>
          </div>
        </div>
        <div className="flex-1 bg-[hsl(256,40%,16%)] rounded-2xl p-8 flex flex-col justify-between min-h-[200px]">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
            <Handshake className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Get ready to apply</h3>
            <p className="text-sm text-white/50">Find your dream house? You just need to do a few steps. We will help you through the process.</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-0">
        <div className="flex-1 text-center">
          <p className="text-4xl font-bold text-primary mb-1">7.4%</p>
          <p className="text-sm text-white/50">Property Return Rate</p>
        </div>
        <div className="w-px h-16 bg-white/20" />
        <div className="flex-1 text-center">
          <p className="text-4xl font-bold text-primary mb-1">3,856</p>
          <p className="text-sm text-white/50">Property in Sell & Rent</p>
        </div>
        <div className="w-px h-16 bg-white/20" />
        <div className="flex-1 text-center">
          <p className="text-4xl font-bold text-primary mb-1">2,540</p>
          <p className="text-sm text-white/50">Daily Completed Transactions</p>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
