import { ethers } from "ethers";
require("dotenv").config();
import abi from "../utils/todo.json"

const contractAddress = "0x057c50505c000805e2F7dcAD0E5deabC2Fd977Cc";
const contractABI = abi.abi;

export default function getTodoContract(isSigner = false) {
  // @ts-ignore
  const { ethereum } = window;
  if(ethereum) {
    const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_RPC_URL);
    // @ts-ignore
    const providerSigner = new ethers.providers.Web3Provider(ethereum);
    const signer = providerSigner.getSigner();
    const newProvider = isSigner ? signer : provider;
    return new ethers.Contract(contractAddress, contractABI, newProvider);
  } else {
    return undefined;
  }
}
