export default function LoginBrandPanel() {
  return (
    <aside className="relative hidden lg:flex min-h-dvh overflow-hidden bg-[#2F5BDB] text-white p-12 xl:p-16 flex-col justify-center">
      <div className="pointer-events-none absolute -right-10 -top-16 size-[22rem] rounded-full bg-[#6B93FF]/50" />
      <div className="pointer-events-none absolute right-24 top-28 size-56 rounded-full bg-[#8BABFF]/40" />
      <div className="pointer-events-none absolute -right-20 bottom-[-4rem] size-[28rem] rounded-full bg-white/10" />
      <div className="pointer-events-none absolute left-[-5rem] bottom-24 size-48 rounded-full bg-[#4C7CFF]/40" />

      <div className="relative max-w-lg">
        <h2 className="text-[40px] xl:text-[44px] font-semibold leading-[1.15] tracking-tight">
          Every order, rider and vendor in one calm place.
        </h2>
        <p className="mt-5 text-[15px] leading-6 text-white/80">
          Plenti Admin v2 keeps your team on top of fulfilment, settlements and
          support without switching tools.
        </p>

        <div className="mt-10 grid grid-cols-3 gap-3">
          <Metric label="Orders today" value="1,284" />
          <Metric label="Riders online" value="86" />
          <Metric label="Ready to settle" value="₦4.2M" />
        </div>
      </div>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/12 px-4 py-3.5 backdrop-blur-[2px]">
      <p className="text-[12px] text-white/70">{label}</p>
      <p className="mt-1 text-[22px] font-semibold tracking-tight">{value}</p>
    </div>
  );
}
