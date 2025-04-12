"use client";

import { useState, useEffect } from "react";
import "./Tareas.css";
import { db } from "../firebaseconfig.js"; // Asegúrate de importar tu configuración de Firebase correctamente
import { collection, getDocs } from "firebase/firestore";
import { doc, setDoc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";

const PostItTasks = (props) => {
  const { dataUser } = props;
  // Estado para almacenar las tareas
  const [tasks, setTasks] = useState([]);
  // Estado para la nueva tarea que se está escribiendo
  const [newTask, setNewTask] = useState("");
  // Estado para el Post-it que está siendo editado (asignación)
  const [editingTaskId, setEditingTaskId] = useState(null);
  // Estado para el nombre del asignado que se está editando
  const [assigneeName, setAssigneeName] = useState(dataUser);
  const [valorAssignee, setValorAssignee] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  const updateData = async (documentId, updatedData) => {
    try {
      const docRef = doc(db, "Tareas", documentId);
      await updateDoc(docRef, updatedData);
      console.log("Document updated successfully!");
      ObtenerTareas();
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const ObtenerTareas = async () => {
    const querySnapshot = await getDocs(collection(db, "Tareas"));
    let dataArray = querySnapshot.docs.map((doc) => ({
      idRegister: doc.id,
      ...doc.data(),
    }));
    // Filtrar los datos según el usuario
    if (dataUser !== "ADMINISTRADOR") {
      dataArray = dataArray.filter(
        (task) =>
          (!task.assignee && task.valorAssignee > 0) ||
          task.assignee === dataUser
      );
    }
    setTasks(dataArray);
    setAssigneeName(dataUser);
  };

  // Cargar tareas desde localStorage al iniciar
  useEffect(() => {
    // const savedTasks = localStorage.getItem("postItTasks");
    // if (savedTasks) {
    //   setTasks(JSON.parse(savedTasks));
    // }
    ObtenerTareas();

    setIsAdmin(
      dataUser != null && dataUser.length > 0 && dataUser == "ADMINISTRADOR"
    );

    console.log("UsuarioRegister", dataUser);
  }, [dataUser]);

  // Guardar tareas en localStorage cuando cambian
  // useEffect(() => {
  //   localStorage.setItem("postItTasks", JSON.stringify(tasks));
  // }, [tasks]);
  const Salir = () => {
    // Supongamos que quieres eliminar un registro con la clave "miRegistro"
    localStorage.removeItem("userName");
    window.location.reload();
  };
  // Función para agregar una nueva tarea
  const addTask = async (e) => {
    e.preventDefault();
    if (newTask.trim() === "") return;

    // Crear nueva tarea con un color aleatorio
    const colors = ["yellow", "green", "blue", "pink"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomRotation = Math.random() * 6 - 3; // Rotación entre -3 y 3 grados

    const newTaskObj = {
      id: Date.now(), // ID único basado en la fecha y hora actual
      Descripcion: newTask,
      color: randomColor,
      rotation: randomRotation,
      assignee: "", // Campo para el asignado
      valorAssignee: 0,
    };
    try {
      await addDoc(collection(db, "Tareas"), newTaskObj);
      console.error("Tarea agregado con éxito");
    } catch (e) {
      console.error("Error al agregar documento: ", e);
    }
    ObtenerTareas();
    setNewTask("");
  };

  // Función para eliminar una tarea
  const deleteTask = async (taskId) => {
    setTasks(tasks.filter((task) => task.idRegister !== taskId));
    try {
      await deleteDoc(doc(db, "Tareas", taskId));
      console.error("Tarea eliminada con éxito");
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  // Función para iniciar la edición del asignado
  const startEditingAssignee = (taskId, currentAssignee) => {
    if (!currentAssignee) {
      setEditingTaskId(taskId);
      setAssigneeName(currentAssignee);
    } else {
      setTasks(
        tasks.map((task) =>
          task.idRegister === taskId
            ? updateData(task.idRegister, {
                ...task,
                assignee: "",
              })
            : task
        )
      );

      setEditingTaskId(null);
    }
  };
  // Función para iniciar la edición del Valor asignado
  const startEditingValorAssignee = (taskId, currentAssignee) => {
    if (!currentAssignee) {
      setEditingTaskId(taskId);
      setValorAssignee(currentAssignee || 0);
    } else {
      setTasks(
        tasks.map((task) =>
          task.idRegister === taskId
            ? updateData(task.idRegister, {
                ...task,
                assignee: "",
                valorAssignee: 0,
              })
            : task
        )
      );
      setEditingTaskId(null);
      setValorAssignee(0);
    }
  };

  // Función para guardar el asignado
  const saveAssignee = () => {
    if (editingTaskId) {
      setTasks(
        tasks.map((task) =>
          task.idRegister === editingTaskId
            ? (updateData(editingTaskId, {
                ...task,
                assignee: assigneeName.trim(),
              }),
              {
                ...task,
                assignee: assigneeName.trim(),
              })
            : task
        )
      );
      setEditingTaskId(null);
    }
  };
  // Función para guardar el valor asignado
  const saveValorAssignee = () => {
    if (editingTaskId) {
      setTasks(
        tasks.map((task) =>
          task.idRegister === editingTaskId
            ? (updateData(editingTaskId, {
                ...task,
                valorAssignee: valorAssignee,
              }),
              {
                ...task,
                valorAssignee: valorAssignee,
              })
            : task
        )
      );
      setEditingTaskId(null);
      setValorAssignee(0);
    }
  };

  // Función para cancelar la edición
  const cancelEditing = () => {
    setEditingTaskId(null);
  };
  // Función para cancelar la edición del valor
  const cancelValorEditing = () => {
    setEditingTaskId(null);
    setValorAssignee(0);
  };

  return (
    <div className="post-it-container">
      <h1 className="post-it-title">Mis Tareas</h1>

      {/* Formulario para agregar tareas */}
      {isAdmin ? (
        <form className="post-it-form" onSubmit={addTask}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Escribe una nueva tarea..."
            className="post-it-input"
          />
          <button type="submit" className="post-it-button">
            Agregar
          </button>
        </form>
      ) : (
        ""
      )}

      {/* Contenedor de las notas Post-it */}
      <div className="post-it-board">
        {tasks.length === 0 ? (
          <p className="no-tasks">No hay tareas.</p>
        ) : (
          tasks.map((task) =>
            task.id > 0 ? (
              <div
                key={task.idRegister}
                className={`post-it ${task.color}`}
                style={{ transform: `rotate(${task.rotation}deg)` }}
              >
                {isAdmin && !task.assignee ? (
                  <button
                    className="delete-button"
                    onClick={() => deleteTask(task.idRegister)}
                  >
                    ×
                  </button>
                ) : (
                  ""
                )}
                <p className="post-it-text">{task.Descripcion}</p>
                {task.valorAssignee > 0 && (
                  <p className="post-it-text">Valor ${task.valorAssignee}</p>
                )}
                {/* Mostrar el asignado si existe */}
                {task.assignee && (
                  <div className="assignee-badge">
                    Asignado a: {task.assignee}
                  </div>
                )}

                {/* Botón para asignar que aparece al hacer hover */}
                {!isAdmin ? (
                  editingTaskId !== task.idRegister &&
                  task.valorAssignee > 0 && (
                    <button
                      className="assign-button"
                      onClick={() =>
                        startEditingAssignee(task.idRegister, task.assignee)
                      }
                    >
                      {task.assignee ? "Rechazar" : "Aceptar tarea"}
                    </button>
                  )
                ) : !task.assignee ? (
                  <button
                    className="assign-button"
                    onClick={() =>
                      startEditingValorAssignee(
                        task.idRegister,
                        task.valorAssignee
                      )
                    }
                  >
                    {task.valorAssignee ? "Quitar Valor" : "Asignar Valor"}
                  </button>
                ) : (
                  ""
                )}
                {/* Formulario de edición que aparece cuando se está editando */}
                {!isAdmin
                  ? editingTaskId === task.idRegister && (
                      <div className="assignee-form">
                        <input
                          type="text"
                          value={assigneeName}
                          onChange={(e) => setAssigneeName(e.target.value)}
                          placeholder="Nombre del asignado"
                          className="assignee-input"
                          autoFocus
                        />
                        <div className="assignee-buttons">
                          <button
                            className="save-button"
                            onClick={saveAssignee}
                          >
                            Guardar
                          </button>
                          <button
                            className="cancel-button"
                            onClick={cancelEditing}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )
                  : editingTaskId === task.idRegister && (
                      <div className="assignee-form">
                        <input
                          type="number"
                          value={valorAssignee}
                          onChange={(e) => setValorAssignee(e.target.value)}
                          placeholder="Valor $"
                          className="assignee-input"
                          autoFocus
                        />
                        <div className="assignee-buttons">
                          <button
                            className="save-button"
                            onClick={saveValorAssignee}
                          >
                            Guardar
                          </button>
                          <button
                            className="cancel-button"
                            onClick={cancelValorEditing}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
              </div>
            ) : (
              <p key="0" className="no-tasks">
                No hay tareas.
              </p>
            )
          )
        )}
      </div>
      <div className="footer">
        <div className="footer-data">
          <p className="post-it-text">Desarrollado por: Guillermo Maza</p>
          <p className="post-it-text">Versión 1.0</p>
        </div>
        <div>
          <button className="cancel-button" onClick={Salir}>
            Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostItTasks;
