import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Register from "./pages/Register";
import CheckEmailPage from "./pages/CheckEmailPage";
import CheckPasswordPage from "./pages/CheckPasswordPage";
import Messages from "./components/Messages";
import Layout from "./layout/Layout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/:userId" element={<Messages />} />
        </Route>
        <Route
          path="/register"
          element={
            <>
              <Layout />
              <Register />
            </>
          }
        />
        <Route
          path="/email"
          element={
            <>
              <Layout />
              <CheckEmailPage />
            </>
          }
        />
        <Route
          path="/password"
          element={
            <>
              <Layout />
              <CheckPasswordPage />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
