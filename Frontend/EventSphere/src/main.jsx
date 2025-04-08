import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from './redux/store.js'
import App from "./App";
import AuthProvider from "./components/AuthProvider.jsx";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>  {/* Redux Provider */}
    <BrowserRouter>
      <AuthProvider>  {/* useContext for Authentication */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </Provider>
);
