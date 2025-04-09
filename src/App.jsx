import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LoginPage from "./login.tsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="container">
        <LoginPage />
      </div>
    </>
  );
}

export default App;
