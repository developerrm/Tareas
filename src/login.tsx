"use client"
import React from "react"
import { useState, useEffect } from "react"
import "./login.css" // Importa el archivo CSS

export default function LoginPage() {
  const [name, setName] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Check if name already exists in localStorage on component mount
  useEffect(() => {
    const savedName = localStorage.getItem("userName")
    if (savedName) {
      setName(savedName)
      setIsSubmitted(true)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      localStorage.setItem("userName", name)
      setIsSubmitted(true)
    }
  }

  const handleReset = () => {
    localStorage.removeItem("userName")
    setName("")
    setIsSubmitted(false)
  }

  return ( 
      <div className="card">
        <div className="text-center">
          <h1 className="title">Bienvenido</h1>
          {!isSubmitted ? (
            <p className="subtitle">Por favor ingresa tu nombre para continuar</p>
          ) : (
            <p className="success-message">¡Hola, {name}!</p>
          )}
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Escribe tu nombre
              </label>
              <div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  placeholder="Tu nombre"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={!name.trim()}
                className={`btn btn-primary ${!name.trim() ? "disabled" : ""}`}
              >
                Ingresar
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6">
            <p className="mb-4 subtitle">Tu nombre ha sido guardado para esta sesión.</p>
            <button onClick={handleReset} className="btn btn-secondary">
              Cambiar nombre
            </button>
          </div>
        )}
      </div> 
  )
}
