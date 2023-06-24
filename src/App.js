import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";

import { EthersContext } from "./utils/EthersContext";
import { getContractWithRpcProvider } from "./utils/Contracts";
import { isWalletConnected, getNewBrowserProvider } from "./utils/Wallet";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Mint from "./pages/Mint";
import Burn from "./pages/Burn";
import Trade from "./pages/Trade";
import Forge from "./pages/Forge";
import Reactions from "./pages/Reactions";
import Profile from "./pages/Profile";

const App = () => {

  const [isConnected, setIsConnected] = useState(false);
  const [signer, setSigner] = useState();
  const [contracts, setContracts] = useState({ forger: "", token: "" });
  const [ruleEvents, setRuleEvents] = useState([]);

  const update = async (isConnected) => {  

    let provider;
    let forger = getContractWithRpcProvider("forger");
    let token = getContractWithRpcProvider("token");
    
    if (isConnected) {

      provider = getNewBrowserProvider();

      const signer = await provider.getSigner();

      setSigner(signer);

      forger = forger.connect(signer);
      token = token.connect(signer);
    }
    
    setIsConnected(isConnected);
    setContracts({forger, token});
    setRuleEvents(await fetchRuleEvents(forger));
  }

  const getBalances = async (ids) => {

    const balances = [];

    try {

      for (let i = 0; i < ids.length; i++) {
        
        balances[i] = await contracts.token.balanceOf(signer.address, ids[i]);
      }

    } catch (e) {
      console.log(e);
    }

    return balances;
  }

  const fetchRuleEvents = async (forger) => {   
    
    let ruleEvents = [];

    try {

      const ruleFilter = forger.filters.Rule(null, null, null, null, null);

      const results = await forger.queryFilter(ruleFilter);

      let ruleEvents_ = results.map((result, i) => {

        const [ id, inIds, inAmounts, outIds, outAmounts ] = result.args;

        return {
          id,
          inIds: arrayify(inIds),
          inAmounts: arrayify(inAmounts),
          outIds: arrayify(outIds),
          outAmounts: arrayify(outAmounts)
        };
      });

      ruleEvents = ruleEvents_;

    } catch (e) {
      console.log(e);
    }

    return ruleEvents;
  }

  const arrayify = (proxyResult) => {

    return Array(proxyResult.length).fill(null).map((value, i) => parseInt(proxyResult[i]));
  }

  useEffect(() => {  
    
    (async () => {
      update(await isWalletConnected());
    })();
  },[]);

  const contextValues = {
    update,
    isConnected, 
    signer,
    contracts,
    getBalances,
    ruleEvents
  }

  return (
    <div onClick={async () => {await fetchRuleEvents()}}>
      <EthersContext.Provider value={ contextValues }>
      <Navbar/>
      <Container>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route path="/mint" element={<Mint/>} />
          <Route path="/burn" element={<Burn/>} />
          <Route path="/trade" element={<Trade/>} />
          <Route path="/forge" element={<Forge/>} />
          <Route path="/reactions" element={<Reactions/>} />
          <Route path="/profile" element={<Profile/>} />
        </Routes>
      </Container>
      </EthersContext.Provider>
      <br/><br/><br/>
    </div>
  );
}

export default App;