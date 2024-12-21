import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function POST() {
  // Eliminar la cookie `siwe` configurándola con una fecha de expiración pasada
  cookies().set("siwe", "", {
    secure: true,
    expires: new Date(0), // Fecha en el pasado
  });

  // Responder indicando que la sesión ha terminado
  return NextResponse.json({ message: "Logged out successfully" });
}
