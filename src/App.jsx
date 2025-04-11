import { useState } from "react";
import "./App.css";
import LoginPage from "./login.tsx";
import TareasPage from "./Tareas.jsx";

function App() {
  const [count, setCount] = useState(0);
  const [IsUsuarioRegister, setIsUsuarioRegister] = useState(false);
  const [UsuarioRegister, setUsuarioRegister] = useState("");
  const SetUserRegister = (data) => {
    const { isRegistered, userName } = data;
    setIsUsuarioRegister(isRegistered);
    setUsuarioRegister(userName);
  };
  return (
    <>
      <div className="container">
        {!IsUsuarioRegister ? (
          <LoginPage eventHandlerUsuarioRegister={SetUserRegister} />
        ) : (
          <TareasPage dataUser={UsuarioRegister} />
        )}
      </div>
    </>
  );
}

export default App;
