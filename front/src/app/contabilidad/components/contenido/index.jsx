'use client'
import { useState } from "react";
import { connect } from 'react-redux'

import Cuenta from './tablaCuenta';
import Info from "@/components/CRUD/titulo/CU";

import ModalComprobante from './modalComprobante';
import ModalRegistros from './modalRegistros';

function Contenido({ selected }) {

    const [activeTab, setActiveTab] = useState("cuentas");

    const showContent = () => {
        switch (activeTab) {
            case "cuentas":
                return <Cuenta selected={selected}/>
            case "info":
                return <Info selected={selected} />
        }  
    }

    return (<div className="col-lg-7  min-vh-100">
            <section className="monitor-head pt-3 px-4">
                <ul className="nav nav-tabs" >
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === "cuentas" && "active"} pointer`}
                            onClick={() => {setActiveTab("cuentas");}}
                        >
                            Mayores
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === "info" && "active"} pointer`}
                            onClick={() => {setActiveTab("info");}}
                        >
                            <i className="bi-info-circle me-2" /> Información del titulo
                        </a>
                    </li>
                </ul>
            </section>

            <section className="monitor-body bg-white p-3">
                {selected ? showContent() : "Por favor seleccione una cuenta"}
            </section>

            <section className="monitor-footer p-3 d-flex justify-content-between">
                <div className="btn-group">
                    {selected && <ModalComprobante selected={selected} />},
                </div>
                <div className="btn-group">
                    <ModalRegistros />
                </div>               
            </section>

      </div>
    )
  }
  
const mapStateToProps = state => ({
    selected: state.titulos.instance,
})

export default connect(mapStateToProps, null)(Contenido);