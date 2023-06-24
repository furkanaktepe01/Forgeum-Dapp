const ALCHEMY_API_KEY = process.env.REACT_APP_ALCHEMY_API_KEY;

export const PolygonMainnet = {
    chainId: "0x89",
    rpcUrls: ["https://polygon-rpc.com/"],
    chainName: "Matic Mainnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    blockExplorerUrls: ["https://polygonscan.com/"]
}

export const PolygonMumbai = {
    chainId: "0x13881",
    rpcUrls: [`https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`],
    chainName: "Mumbai Testnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    blockExplorerUrls: ["https://polygonscan.com/"]
}