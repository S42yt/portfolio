import Hero from "@/components/hero";
import CardHome from "@/components/cardHome";

export default function Home() {
  return (
    <div className="min-h-screen py-20 noise-overlay">
      <Hero />
      <CardHome />
    </div>
  );
}
