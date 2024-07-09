'use client'
import { useState } from "react";
import { connect } from 'react-redux'

import Saldos from './tablaSaldos';
import Cuenta from './tablaCuenta';
import Info from "@/components/CRUD/cliente/CU";

import ModalComprobante from './modalComprobante';
import ModalRegistros from './modalRegistros';

function Contenido({ selected }) {

    const [activeTab, setActiveTab] = useState("saldos");

    const showContent = () => {
        switch (activeTab) {
            case "saldos":
                return <Saldos selected={selected} />
            case "cuentas":
                return <Cuenta selected={selected}/>
            case "info":
                return <Info selected={selected} />
        }  
    }

    return (<div className="col-lg-8  min-vh-100">

            <section className="monitor-head pt-3 px-4">
                <ul className="nav nav-tabs" >
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === "saldos" && "active"} pointer`}
                            onClick={() => {setActiveTab("saldos");}}
                        >
                            <i className="bi-currency-dollar" /> A cobrar
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === "cuentas" && "active"} pointer`}
                            onClick={() => {setActiveTab("cuentas");}}
                        >
                            <i className="bi-list-check me-2" /> Movimientos
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === "info" && "active"} pointer`}
                            onClick={() => {setActiveTab("info");}}
                        >
                            <i className="bi-info-circle me-2" /> Información del cliente
                        </a>
                    </li>              
                </ul>
            </section>

            <section className="monitor-body bg-white p-3">
                {selected ? showContent() : "Por favor seleccione una cuenta"}
            </section>

            <section className="monitor-footer p-3 d-flex justify-content-between">
                <div className="btn-group">
                    {selected && <ModalComprobante selected={selected} buttonName={'+ Comprobante'} comportamiento="aumento" />}
                    {selected && <ModalComprobante selected={selected} buttonName={'+ Cobrar'} comportamiento="disminucion" />}
                </div>
                <div className="btn-group">
                    <ModalRegistros />
                </div>               
            </section>

      </div>
    )
  }
  
const mapStateToProps = state => ({
    selected: state.clientes.instance,
})

export default connect(mapStateToProps, null)(Contenido);