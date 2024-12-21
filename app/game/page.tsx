"use client";
import PixelBabelTowerIdle from "@/components/PixelBabelTowerIdle";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import WLDABI from "@/public/WLD.json";
import { MiniKit } from "@worldcoin/minikit-js";
function game() {
  const [balanceWld, setBalanceWld] = useState("1");

  const etherProvider = new ethers.JsonRpcProvider(
    "https://worldchain-mainnet.g.alchemy.com/public"
  );

  const wldContract = "0x2cFc85d8E48F8EAB294be644d9E25C3030863003";
  const wldContractInstance = new ethers.Contract(
    wldContract,
    WLDABI,
    etherProvider
  );
  const getBalanceWld = async () => {
    const getBalanceWldContract = await wldContractInstance.balanceOf(
      MiniKit.walletAddress
    );
    const formatbalanceWld = ethers.formatEther(getBalanceWldContract);
    console.log("BalanceWLD:", formatbalanceWld);

    setBalanceWld(formatbalanceWld.toString());
  };

  useEffect(() => {
    getBalanceWld();
  }, []);

  return (
    <div>
      <PixelBabelTowerIdle />
      <h2>Balance WLD: {balanceWld}</h2>
    </div>
  );
}

export default game;
