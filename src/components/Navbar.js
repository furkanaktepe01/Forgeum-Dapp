import { Container, Navbar, Nav, Button, Badge } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';

import { connectWallet, isWalletConnected, isWalletInstalled } from "../utils/Wallet";
import { EthersContext } from "../utils/EthersContext";

const NavBar = () => {

  const { isConnected, update, signer } = useContext(EthersContext);

  const [walletStatus, setWalletStatus] = useState("");

  useEffect(() => {  

    if(!isWalletInstalled()) {
      setWalletStatus("uninstalled");
      return;
    }

    (async () => {
      if(! await isWalletConnected()) {
        setWalletStatus("unconnected");
      }
    })()

  }, []);

  const installButton = (
    <Button 
      variant="secondary"
      href="https://metamask.io/download/"
      target="_blank"
    > 
      Install Metamask
    </Button>
  );

  const connectButton = (
    <Button 
      variant="secondary"
      onClick={async () => {
        update(await connectWallet());
        window.location.reload();
      }}
    > 
      Connect with Metamask
    </Button>
  );

  const addressBadge = (
    <Badge bg="dark">Signed in as: <i>{signer ? signer.address : ""}</i></Badge>
  )

  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark" fixed="top">
        <Container>
          <Navbar.Brand href="/"><h1>Forgeum</h1></Navbar.Brand>
          <Nav className="me-auto">
              <Nav.Link href="mint">Mint</Nav.Link>
              <Nav.Link href="burn">Burn</Nav.Link>
              <Nav.Link href="trade">Trade</Nav.Link>
              <Nav.Link href="forge">Forge</Nav.Link>
              <Nav.Link href="reactions">Reactions</Nav.Link>
              <Nav.Link href="profile">Profile</Nav.Link>
          </Nav>
          { 
            isConnected ?
              addressBadge :
              walletStatus == "uninstalled" ?
              installButton :
              connectButton
          }
        </Container>
      </Navbar>
      <br/><br/><br/><br/><br/><br/>
    </div>
  );
}

export default NavBar;