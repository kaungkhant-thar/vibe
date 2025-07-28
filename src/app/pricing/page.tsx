import { PricingTable } from "@clerk/nextjs";

export default function PricingPage() {
  return (
    <div className="flex h-[50vh] flex-col justify-center items-center max-w-5xl mx-auto">
      <PricingTable />
    </div>
  );
}
