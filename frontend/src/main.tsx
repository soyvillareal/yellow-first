import { lazy as ReactLazy, StrictMode as ReactStrictMode } from "react";
import { Provider } from "react-redux";
import * as ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";

import { setupStore } from "@helpers/store";

// import { makeServer } from "./server";
import BooksProvider, { BooksContext } from "./contexts/BooksProvider";
import AuthProvider, { AuthContext } from "./contexts/AuthProvider";
import AddressProvider from "./contexts/AddressProvider";

import "./index.css";

export { BooksContext };
export { AuthContext };
// Call make Server
// makeServer();

const App = ReactLazy(() => import("./App"));

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ReactStrictMode>
    <Provider store={setupStore()}>
      <BrowserRouter>
        <AuthProvider>
          <BooksProvider>
            <AddressProvider>
              <Toaster position="top-right" reverseOrder={false} />
              <App />
            </AddressProvider>
          </BooksProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </ReactStrictMode>
);
