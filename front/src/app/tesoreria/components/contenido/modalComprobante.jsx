import React, { useState } from "react";

import BasicModal from '@/components/modal';
import Comprobante from "@/components/CRUD/comprobante/CU";


export default function Modal ({selected}) {

  const [modal, setModal] = useState(false)

  const handleToggle = () => {
    if (selected) setModal(!modal);
  };

  return (
    <>
      <BasicModal
        open={modal}
        onToggle={handleToggle}
        button={(<button className="btn btn-outline-primary mx-1 shadow" disabled={!selected} onClick={handleToggle}> + Movimiento </button>)}
        header={`Nuevo movimiento - ${selected.full_name}`}
        component={<Comprobante moduleHandler={'caja'} destinatario={selected} onClose={() => handleToggle()}/>}
        footer={false}
      />
    </>
  );
}