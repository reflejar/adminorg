"use client"

import { useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

import BasicModal from '@/components/modal';
import Comprobante from "@/components/CRUD/comprobante/CU";
import Comprobantes from "@/components/CRUD/comprobante/L";

const FloatingButton = ({selected}) => {
  
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [comprobanteIsOpen, setComprobanteIsOpen] = useState(false);
  const [cobroIsOpen, setCobroIsOpen] = useState(false);
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
            button="Nuevo Comprobante"
            header="Nuevo Comprobante"
            component={<Comprobante 
              moduleHandler={"creditos"} 
              destinatario={selected} 
              onClose={() => setComprobanteIsOpen(false)} 
              comportamiento="aumento"
            />}
            footer={false}
          />
        </DropdownItem>
        <DropdownItem disabled={!selected}>
          <BasicModal
            open={cobroIsOpen}
            onToggle={() => setCobroIsOpen((prev) => !prev)}
            button="Nuevo Cobro"
            header="Nuevo Cobro"
            component={<Comprobante 
              moduleHandler={"creditos"} 
              destinatario={selected} 
              onClose={() => setCobroIsOpen(false)} 
              comportamiento="disminucion"
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
            component={<Comprobantes causante={"creditos"} />}
            footer={false}
          />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default FloatingButton