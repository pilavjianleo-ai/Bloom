export default function Pricing() {
  const plans = [
    {
      id: "free",
      name: "Starter",
      price: "$0",
      features: ["Profile", "Post videos", "Basic analytics"],
    },
    {
      id: "pro",
      name: "Premium",
      price: "$29",
      features: ["Verified badge", "Boost content", "Leads inbox"],
    },
    {
      id: "biz",
      name: "Business",
      price: "$79",
      features: ["Sponsored slots", "Advanced analytics", "Team access"],
    },
  ];
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-semibold">Pricing</h1>
        <p className="text-sm text-white/70">
          Choose a plan to grow your service business.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div key={p.id} className="rounded-2xl bg-slate-900 p-4">
              <div className="text-lg font-semibold">{p.name}</div>
              <div className="text-2xl mt-1">{p.price}/mo</div>
              <ul className="mt-3 text-sm space-y-1">
                {p.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <button className="mt-4 w-full rounded-xl bg-white text-black py-2">
                Choose {p.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

