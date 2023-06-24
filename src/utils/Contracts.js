import { ethers } from "ethers";

const ALCHEMY_API_KEY = process.env.REACT_APP_ALCHEMY_API_KEY;

const forgerAddress = "0xb09FcCF88f129226eF71898dCfCDCc4D03FCDeb7";
const tokenAddress = "0xA46e6916a3D46F3E32cd6A9ABDB6E30Da0AB65fb";

const forgerABI = [
    
    "event Forge(address indexed _account, bytes32 indexed _forgeId, uint _multiplier)",

    "event Rule(bytes32 indexed _forgeId, uint[] forgeInIds, uint[] forgeInAmounts, uint[] forgeOutIds, uint[] forgeOutAmounts)",

    "function forge(uint[] memory forgeInIds, uint[] memory forgeInAmounts, uint[] memory forgeOutIds, uint[] memory forgeOutAmounts)",
    
    "function forge(uint[] memory forgeInIds, uint[] memory forgeInAmounts, uint[] memory forgeOutIds, uint[] memory forgeOutAmounts, uint multiplier)"
];

const tokenABI = [

    "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)",

    "event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)",

    "function balanceOf(address account, uint256 id) view returns (uint)",

    "function trade(uint inId, uint outId, uint amount)",

    "function mint(uint id, uint amount, bytes memory data)",

    "function burn(uint id, uint amount)",
    
    "function mintBatch(address to, uint[] memory ids, uint[] memory amounts, bytes memory data)",

    "function burnBatch(address from, uint[] memory ids, uint[] memory amounts)"
];

export const getContractWithRpcProvider = (name) => {

    const provider = new ethers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`);

    switch (name) {
        case "forger":
            return new ethers.Contract(forgerAddress, forgerABI, provider);
        case "token":
            return new ethers.Contract(tokenAddress, tokenABI, provider);
    }
}
