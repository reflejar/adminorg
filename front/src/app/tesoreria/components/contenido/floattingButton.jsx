"use client"

import { useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

import BasicModal from '@/components/modal';
import Comprobante from "@/components/CRUD/comprobante/CU";
import Comprobantes from "@/components/CRUD/comprobante/L";

const FloatingButton = ({selected}) => {
  
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [comprobanteIsOpen, setComprobanteIsOpen] = useState(false);
  const [cobroIsOpen, setPagoIsOpen] = useState(false);
  const [registroIsOpen, setRegistroIsOpen] = useState(false);

  const handleDropdown = () => {
    setDropdownIsOpen(!dropdownIsOpen);
  };
  

  return (
    <Dropdown isOpen={dropdownIsOpen && (!comprobanteIsOpen && !cobroIsOpen && !registroIsOpen)} toggle={handleDropdown} className="position-absolute">
      <DropdownToggle
        style={{
          position: 'fixed',
          bottom: '2em',
          right: '30px',
          zIndex: 1000,
          borderRadius: '50%',
        }}
        color="primary"
        className="shadow"
      >
        <i className="display-6 bi-plus"></i>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem disabled={!selected}>
          <BasicModal
            open={comprobanteIsOpen}
            onToggle={() => setComprobanteIsOpen((prev) => !prev)}
            button="Agregar Dinero"
            header="Agregar Dinero"
            component={<Comprobante 
              moduleHandler={"caja-y-bancos"} 
              destinatario={selected} 
              onClose={() => setComprobanteIsOpen(false)} 
              comportamiento="aumento"
            />}
            footer={false}
          />
        </DropdownItem>
        <div className="dropdown-divider"></div>
        <DropdownItem>
          <BasicModal
            open={registroIsOpen}
            onToggle={() => setRegistroIsOpen((prev) => !prev)}
            button="Ver comprobantes"
            header="Registro de Comprobantes"
            component={<Comprobantes causante={"caja-y-bancos"} />}
            footer={false}
          />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default FloatingButton