import React, { useState } from "react";

import BasicModal from '@/components/modal';

import Cliente from "@/components/CRUD/cliente/CU";
import Proveedor from "@/components/CRUD/proveedor/CU";
import Caja from "@/components/CRUD/caja/CU";
import Proyecto from "@/components/CRUD/proyecto/CU";
import Ingreso from "@/components/CRUD/ingreso/CU";
import Gasto from "@/components/CRUD/gasto/CU";
import Titulo from "@/components/CRUD/titulo/CU";

export default function Modal ({selected}) {

  const [modal, setModal] = useState(false)

  const handleToggle = () => {
    if (selected) setModal(!modal);
  };

  const modals = {
    creditos: <Cliente onClose={handleToggle} />,
    deudas: <Proveedor onClose={handleToggle} />,
    'caja-y-bancos': <Caja onClose={handleToggle} />,
    proyecto: <Proyecto onClose={handleToggle} />,
    ingresos: <Ingreso onClose={handleToggle} />,
    gastos: <Gasto onClose={handleToggle} />,
    titulo: <Titulo onClose={handleToggle} />,      
  }

  return (
    <>
      <BasicModal
        open={modal}
        onToggle={handleToggle}
        button={(<button className="btn btn-outline-primary mx-1 shadow" disabled={!selected} onClick={handleToggle}>Nuevo</button>)}
        header="Nuevo"
        component={selected && modals[selected.id]}
        footer={false}
      />
    </>
  );
}

