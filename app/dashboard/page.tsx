"use client";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full bg-[url('/loading-tower.webp')] bg-cover bg-center bg-no-repeat text-white relative flex flex-col items-center justify-center">
      <section className="mt-[17vh] flex flex-col gap-[10em] items-center">
        <h2 className="text-6xl font-bold mb-2">Coming soon</h2>
      </section>

      <div className="flex flex-col justify-end items-center h-full mt-auto pb-10">
        <div className="flex space-x-10">
          <div className="relative">
            <Image
              src={"/button-blue.webp"}
              alt="Login Button"
              width={300}
              height={300}
            />
            <Link
              href="/game"
              className="absolute bottom-[33%] left-[50%] transform translate-x-[-50%] text-[40px] lilita-font cursor-pointer whitespace-nowrap"
            >
              Next time
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
