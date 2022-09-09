require("dotenv").config();
import { ethers } from "ethers";
import abi from "../utils/todo.json"

const contractAddress = "0x4381cd503Cb6d3f6B692560BDaB3f9e0be606c10";
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
