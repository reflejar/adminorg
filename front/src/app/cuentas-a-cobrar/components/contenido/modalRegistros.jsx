import React, { Component, useState } from "react";
import BasicModal from '@/components/modal';

import Comprobantes from "@/components/CRUD/comprobante/L";
import CHOICES from "@/components/CRUD/comprobante/components/choices";

export default function Modal () {

  const [modal, setModal] = useState(false)

  const handleToggle = () => {
    setModal(!modal);
  };

  return (
    <>
      <BasicModal
        open={modal}
        onToggle={handleToggle}
        button={(<button className="btn btn-outline-info mx-1 shadow" onClick={handleToggle}> Registros </button>)}
        header="Registros"
        component={<Comprobantes causante={"creditos"} />}
        footer={false}
      />
    </>
  );
}