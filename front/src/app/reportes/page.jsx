'use client'
import Sidebar from "@/components/sidebar"
import Botonera from "./components/botonera"
import Contenido from "./components/contenido"

export default function Resumen() {
    return (
      <main className="row">
        <Sidebar />
        <Botonera />
        <Contenido />
      </main>
    )
  }
  