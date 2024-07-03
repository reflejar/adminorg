import React, { useState } from "react";

import BasicModal from '@/components/modal';

import Cliente from "@/components/CRUD/cliente/M";
import Proveedor from "@/components/CRUD/proveedor/M";
import Caja from "@/components/CRUD/caja/M";
import Ingreso from "@/components/CRUD/ingreso/M";
import Gasto from "@/components/CRUD/gasto/M";

export default function Modal ({selected}) {

  const [modal, setModal] = useState(false)

  const handleToggle = () => {
    if (selected) setModal(!modal);
  };

  const modals = {
    cliente: <Cliente onClose={handleToggle} />,
    proveedor: <Proveedor onClose={handleToggle} />,
    caja: <Caja onClose={handleToggle} />,
    ingreso: <Ingreso onClose={handleToggle} />,
    gasto: <Gasto onClose={handleToggle} />,
    titulo: "No es posible realizar importacion de los titulos contables"
  }

  return (
    <>
      <BasicModal
        open={modal}
        onToggle={handleToggle}
        button={(<button className="btn btn-outline-primary mx-1 shadow" disabled={!selected} onClick={handleToggle}>Importar</button>)}
        header="Importación"
        component={selected && modals[selected.id]}
        footer={false}
      />
    </>
  );
}

