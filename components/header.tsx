"use client";

import Image from "next/image";
import { useGame } from "@/app/Context/GameContext";
import { useState, useEffect } from "react";

export function Header() {
  const { totalGems, setTotalGems, accumulatedGems, setAccumulatedGems } =
    useGame();
  const [isCollecting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(9);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [frozenGems, setFrozenGems] = useState(0);

  // Cargar estado desde sessionStorage
  useEffect(() => {
    const storedTotalGems = sessionStorage.getItem("totalGems");
    const storedAccumulatedGems = sessionStorage.getItem("accumulatedGems");
    const storedFrozenGems = sessionStorage.getItem("frozenGems");
    const storedTimeLeft = sessionStorage.getItem("timeLeft");
    const storedIsTimerRunning = sessionStorage.getItem("isTimerRunning");

    if (storedTotalGems) {
      setTotalGems(parseInt(storedTotalGems));
    }

    if (storedAccumulatedGems) {
      setAccumulatedGems(parseInt(storedAccumulatedGems));
    }

    if (storedFrozenGems) {
      setFrozenGems(parseInt(storedFrozenGems));
    }

    if (storedTimeLeft) {
      setTimeLeft(parseInt(storedTimeLeft));
    }

    if (storedIsTimerRunning === "false") {
      setIsTimerRunning(false);
    }
  }, []);

  // Manejar la recolección de gemas
  const handleCollect = () => {
    if (frozenGems > 0) {
      setTotalGems((prevTotal) => prevTotal + frozenGems);
      setAccumulatedGems(0);
      setFrozenGems(0);
      setTimeLeft(9); // Reiniciar tiempo restante
      sessionStorage.setItem("timeLeft", "9"); // Reiniciar tiempo restante en sessionStorage
      sessionStorage.setItem("isTimerRunning", "true"); // Reiniciar estado del temporizador
      setIsTimerRunning(true); // Reiniciar temporizador
    }
  };

  // Lógica del temporizador
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((prevTime) => prevTime - 1);
        sessionStorage.setItem("timeLeft", (timeLeft - 1).toString()); // Actualizar tiempo restante en sessionStorage
      } else {
        clearInterval(interval);
        setIsTimerRunning(false);
        sessionStorage.setItem("isTimerRunning", "false"); // Actualizar estado del temporizador
        setFrozenGems(accumulatedGems);
        sessionStorage.setItem("frozenGems", accumulatedGems.toString()); // Guardar frozen gems
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Acumular gemas mientras el temporizador está en marcha
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const interval = setInterval(() => {
        setAccumulatedGems((prevGems) => Math.min(prevGems + 1));
        sessionStorage.setItem(
          "accumulatedGems",
          (accumulatedGems + 1).toString()
        ); // Guardar acumulación en sessionStorage
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isTimerRunning, timeLeft]);

  // Calcular el porcentaje de tiempo restante
  const percentage = ((9 - timeLeft) / 9) * 100;

  // Interpolar color según el porcentaje
  const interpolateColor = (percentage: number) => {
    const startColor = { r: 255, g: 20, b: 147 };
    const middleColor = { r: 0, g: 255, b: 255 };
    const endColor = { r: 0, g: 255, b: 0 };

    let r, g, b;

    if (percentage <= 50) {
      r = Math.round(
        startColor.r + (middleColor.r - startColor.r) * (percentage / 50)
      );
      g = Math.round(
        startColor.g + (middleColor.g - startColor.g) * (percentage / 50)
      );
      b = Math.round(
        startColor.b + (middleColor.b - startColor.b) * (percentage / 50)
      );
    } else {
      const adjustedPercentage = (percentage - 50) / 50;
      r = Math.round(
        middleColor.r + (endColor.r - middleColor.r) * adjustedPercentage
      );
      g = Math.round(
        middleColor.g + (endColor.g - middleColor.g) * adjustedPercentage
      );
      b = Math.round(
        middleColor.b + (endColor.b - middleColor.b) * adjustedPercentage
      );
    }

    return `rgb(${r}, ${g}, ${b})`;
  };

  const progressColor = interpolateColor(percentage);

  // Función para formatear números grandes
  const formatNumber = (value: number) => {
    if (value >= 1e6) {
      return (value / 1e6).toFixed(1) + "M";
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(1) + "k";
    } else {
      return value.toString();
    }
  };

  // Guardar el porcentaje en sessionStorage cada vez que cambia
  useEffect(() => {
    sessionStorage.setItem("percentage", percentage.toString());
  }, [percentage]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-2">
      <div className="relative max-w-md mx-auto">
        <Image
          src={"/gem.webp"}
          alt="logo"
          width={150}
          height={150}
          className="absolute top-[-15px] left-[-35px] z-10"
        />
        <div className="flex justify-end items-center rounded-lg p-2 relative bg-white bg-opacity-30 backdrop-blur-md shadow-lg">
          <div className="relative">
            <Image
              src={"/button-purple.webp"}
              alt="logo"
              width={100}
              height={100}
            />
            <div className="absolute top-[15px] left-1/2 transform -translate-x-1/2 text-sm">
              {formatNumber(Number(totalGems.toFixed(0)))}
            </div>
          </div>
        </div>

        <div className="flex items-center mt-2 px-20">
          <div className="relative w-full h-4 bg-[#62a766] overflow-hidden">
            <div
              className="absolute h-full"
              style={{
                width: `${percentage}%`,
                backgroundColor: progressColor,
                transition: "width 1s ease-out, background-color 1s ease-out",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-xs text-black">
              {isTimerRunning ? (
                <></>
              ) : (
                <span className="text-[#110705]">Complete</span>
              )}
            </div>
          </div>
          <span className="absolute left-[20px] text-sm">{`00:${
            timeLeft < 10 ? `0${timeLeft}` : timeLeft
          }`}</span>
          <div className="absolute top-[43%] right-[15px] h-8 px-2 py-1 rounded flex items-center text-sm text-white">
            {isCollecting
              ? `Collecting...`
              : `${
                  isTimerRunning
                    ? formatNumber(Number(accumulatedGems.toFixed(0)))
                    : formatNumber(Number(frozenGems.toFixed(0)))
                }`}
          </div>
        </div>

        <div className="relative mt-2">
          <Image
            src={"/button-blue.webp"}
            alt="logo"
            className="flex m-auto cursor-pointer"
            width={120}
            height={120}
            onClick={handleCollect}
          />
          <div
            onClick={handleCollect}
            className="absolute cursor-pointer top-[47%] left-1/2 transform -translate-x-1/2 -translate-y-[50%] text-sm text-white select-none"
          >
            Collect
          </div>
        </div>
      </div>
    </div>
  );
}
