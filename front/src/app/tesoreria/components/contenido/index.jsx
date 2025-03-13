'use client'
import { useState } from "react";
import { connect } from 'react-redux'

import Saldos from './tablaSaldos';
import Cuenta from './tablaCuenta';
import Info from "@/components/CRUD/caja/CU";

import FloatingButton from "./floattingButton";


function Contenido({ selected }) {

    const [activeTab, setActiveTab] = useState("saldos");

    const showContent = () => {
        switch (activeTab) {
            case "saldos":
                return <Saldos selected={selected}/>
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
                            onClick={() => setActiveTab("saldos")}
                        >
                            <i className="bi-currency-dollar" /> Disponible
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
                            <i className="bi-info-circle me-2" /> Información de la caja
                        </a>
                    </li>
                </ul>
            </section>

            <section className="monitor-body position-relative bg-white p-3">
                {selected ? showContent() : "Por favor seleccione una cuenta"}
                <FloatingButton selected={selected} />
            </section>

      </div>
    )
  }
  
const mapStateToProps = state => ({
    selected: state.cajas.instance,
})

export default connect(mapStateToProps, null)(Contenido);