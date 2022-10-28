import { Web3ReactProvider } from "@web3-react/core";
import type { AppProps } from "next/app";
import getLibrary from "../getLibrary";
import "../styles/globals.css";
import bookLibraryBackground from '../public/book-library-background.jpg';
import bookImg from '../public/books.jpg';

function NextWeb3App({ Component, pageProps }: AppProps) {
  return (
    <div style={{
      backgroundImage: `url(${bookLibraryBackground.src})`, height: '100vh', backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    }}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Component {...pageProps} />
      </Web3ReactProvider>
    </div >
  );
}

export default NextWeb3App;
