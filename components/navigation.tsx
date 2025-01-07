import Link from "next/link";

export function Navigation() {
  return (
    <div className="fixed z-20 text-[#ac6726] lilita-font font-bold bottom-0 left-0 right-0 bg-background">
      <div className="flex justify-around items-center max-w-md mx-auto py-2">
        <Link href="/sign-in" className="flex-1 flex flex-col items-center">
          <button
            className="flex flex-col items-center justify-center"
            style={{
              backgroundImage: "url('/button-yellow.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "70px",
              width: "100%",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span className="text-lg">Game</span>
          </button>
        </Link>

        <Link href="/jackpot" className="flex-1 flex flex-col items-center">
          <button
            className="flex flex-col items-center justify-center"
            style={{
              backgroundImage: "url('/button-yellow.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "70px",
              width: "100%",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span className="text-lg">Jackpot</span>
          </button>
        </Link>

        <Link href="/dashboard" className="flex-1 flex flex-col items-center">
          <button
            className="flex flex-col items-center justify-center"
            style={{
              backgroundImage: "url('/button-yellow.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "70px",
              width: "100%",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span className="text-lg">Dashboard</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
