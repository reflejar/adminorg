import React, { useState } from "react";

import Titulo from "@/components/CRUD/titulo/CU";
import BasicModal from '@/components/modal';


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
        button={<i onClick={handleToggle} className="bi-person-plus" ></i>}
        header="Nuevo Titulo"
        component={<Titulo onClose={() => handleToggle(false)} />}
        footer={false}
      />
    </>
  );
}

