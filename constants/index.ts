
  export interface Networks {
    [key: number]: string;
  }
  export const walletConnectSupportedNetworks: Networks = {
    // Add your network rpc URL here
    1: "https://ethereumnode.defiterm.io",
    3: "https://ethereumnode.defiterm-dev.net"
  };

  // Network chain ids
  export const supportedMetamaskNetworks = [1, 3, 4, 5, 42];

  export const ALBT_TOKEN_ADDRESS = "0xc6869a93ef55e1d8ec8fdcda89c9d93616cf0a72";
  export const BOOK_LIBRARY_ADDRESS = "0x2e2E7368Ca9e1A7cCbE91b8b28d0C7D69ba40F9D";