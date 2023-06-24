import { ethers } from "ethers";

import { PolygonMumbai } from "./Networks";

const { ethereum } = window;
const network = PolygonMumbai;

export const isWalletInstalled = () => {

    return (typeof ethereum !== 'undefined' && ethereum.isMetaMask);
}

export const isWalletConnected = async () => {

    try {     
        
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        
        return accounts.length !== 0;    
    
    } catch (e) {
        console.log(e);
    }
}

export const connectWallet = async () => {

    try {

        await getNewBrowserProvider().send("eth_requestAccounts", []);    
    
    } catch (e) {
        console.log(e);
    }

    return await isWalletConnected();
}

export const changeNetwork = async () => {

    try {
        
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: network.chainId }],
        });
      
    } catch (switchError) {

        if (switchError.code === 4902) {
            
            await addNetwork();
        }
    }
}

const addNetwork = async () => {

    try {

        await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [network]
        });

        return true;

    } catch (e) {
        console.log(e);
        return false;
    }
}

export const checkNetwork = async () => {

    const currentNetworkId = parseInt((await getNewBrowserProvider().getNetwork()).chainId);

    const expectedNetworkId = parseInt(network.chainId);

    return currentNetworkId === expectedNetworkId;
}

export const checkWalletNetwork = async () => {

    if (! await checkNetwork()) {

        await changeNetwork();
    }

    return await checkNetwork();
}

export const getNewBrowserProvider = () => {

    try {
    
        return new ethers.BrowserProvider(ethereum);    
    
    } catch (e) {
        console.log(e);
    }
}
