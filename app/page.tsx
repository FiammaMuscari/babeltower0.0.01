import PixelBabelTowerIdle from "@/components/PixelBabelTowerIdle";
import { SignIn } from "@/components/SignIn";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-y-3">
      <SignIn />
      <PixelBabelTowerIdle />
    </main>
  );
}
