import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Account from "../components/Account";
import NativeCurrencyBalance from "../components/NativeCurrencyBalance";
import BookLibrary from "../components/BookLibrary";
import { BOOK_LIBRARY_ADDRESS } from "../constants";
import useEagerConnect from "../hooks/useEagerConnect";

function Home() {
  const { account, library } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;

  return (
    <div>
      <Head>
        <title>LimeAcademy-boilerplate</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <nav style={{ background: "#303030", height: "50px" }}>
          <h1 style={{
            display: "flex",
            margin: '0 5px',
            flexDirection: "column",
            justifyContent: "center",
            color: 'white'
          }}>
            Book Library
          </h1>

          <Account triedToEagerConnect={triedToEagerConnect} />
        </nav>
      </header>

      <main>
        {isConnected && (
          <section>
            <NativeCurrencyBalance />
            <BookLibrary contractAddress={BOOK_LIBRARY_ADDRESS} />
          </section>
        )}
      </main>

      <style jsx>{`
        nav {
          display: flex;
          justify-content: space-between;
        }

        main {
        text-align: center;
        }

        body, html {
          margin: 0;
          height: 100%;
        }
      `}</style>
    </div >
  );
}

export default Home;
