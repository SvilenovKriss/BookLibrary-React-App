import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useEffect, useState } from "react";
import { injected, walletConnect } from "../connectors";
import useENSName from "../hooks/useENSName";
import useMetaMaskOnboarding from "../hooks/useMetaMaskOnboarding";
import { formatEtherscanLink, shortenHex } from "../util";
import Button from '@mui/material/Button';

type AccountProps = {
  triedToEagerConnect: boolean;
};

const Account = ({ triedToEagerConnect }: AccountProps) => {
  const { active, error, activate, deactivate, chainId, account, setError } =
    useWeb3React();

  const {
    isMetaMaskInstalled,
    isWeb3Available,
    startOnboarding,
    stopOnboarding,
  } = useMetaMaskOnboarding();

  // manage connecting state for injected connector
  const [connecting, setConnecting] = useState(false);
  useEffect(() => {
    if (active || error) {
      setConnecting(false);
      stopOnboarding();
    }
  }, [active, error, stopOnboarding]);

  const ENSName = useENSName(account);

  if (error) {
    return null;
  }

  if (!triedToEagerConnect) {
    return null;
  }

  if (typeof account !== "string") {
    return (
      <div style={{ marginTop: '5px' }}>
        {isWeb3Available ? (
          <Button
            style={{ margin: '1px' }}
            size="small"
            variant="outlined"
            disabled={connecting}
            onClick={() => {
              setConnecting(true);

              activate(injected, undefined, true).catch((error) => {
                // ignore the error if it's a user rejected request
                if (error instanceof UserRejectedRequestError) {
                  setConnecting(false);
                } else {
                  setError(error);
                }
              });
            }}
          >
            {isMetaMaskInstalled ? "Connect to MetaMask" : "Connect to Wallet"}
          </Button>
        ) : (
          <Button
            style={{ margin: '5px' }}
            size="small"
            variant="outlined"
            onClick={startOnboarding}
          >
            Install Metamask
          </Button>
        )
        }
        {
          (<Button
            style={{ margin: '5px' }}
            size="small"
            variant="outlined"
            disabled={connecting}
            onClick={async () => {
              try {
                await activate(walletConnect(), undefined, true)
              } catch (e) {
                if (error instanceof UserRejectedRequestError) {
                  setConnecting(false);
                } else {
                  setError(error);
                }
              }
            }}>
            Wallet Connect
          </Button>)
        }
      </div >
    );
  }

  return (
    <>
      <div style={{ marginTop: '5px' }}>
        <a
          style={{ color: 'white' }}
          {...{
            href: formatEtherscanLink("Account", [chainId, account]),
            target: "_blank",
            rel: "noopener noreferrer",
          }}
        >
          {ENSName || `${shortenHex(account, 4)}`}
        </a>
        <Button
          style={{ margin: '5px' }}
          size="small"
          variant="outlined"
          onClick={async () => {
            try {
              await deactivate()
            } catch (e) {
              setError(error);
            }
          }}>
          Disconnect
        </Button>
      </div>
    </>
  );
};

export default Account;