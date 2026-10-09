import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { Provider } from "react-redux";
import { store } from "./redux/store.js";

import AOS from "aos";
import "aos/dist/aos.css";

import { Toaster } from "react-hot-toast";

import { GoogleOAuthProvider } from "@react-oauth/google";

import AuthInitializer from "./components/AuthInitializer.jsx";

AOS.init({
  duration: 800,
  once: true,
  offset: 100,
});

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthInitializer>
        <App />
      </AuthInitializer>
      <Toaster position="top-right" />
    </GoogleOAuthProvider>
  </Provider>,
);
