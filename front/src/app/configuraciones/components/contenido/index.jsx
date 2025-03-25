'use client'
import { useState, useEffect } from "react";
import { connect } from 'react-redux'

import Grupo from "./grupo"
import Individual from './modals/individual'
import Masivo from './modals/masivo'

function Contenido({ selected }) {

    const [activeTab, setActiveTab] = useState("habilitados");
    const [content, setContent] = useState("");

    useEffect(()=> {
        if (selected) {
            switch (activeTab) {
                case "habilitados":
                    setContent(<Grupo selected={selected} />)
                    break;
                default:
                    setContent("Pronto")
                    break;
            }
        } else {
            setContent("Por favor seleccione")
        }
    }, [selected, activeTab])

    return (<div className="col-lg-8 min-vh-100">

            <section className="monitor-head pt-3 px-4">
                <ul className="nav nav-tabs" >
                <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === "habilitados" && "active"} pointer`}
                            onClick={() => {setActiveTab("habilitados");}}
                        >
                            <i className="bi-check-circle-fill text-success" /> Activos
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === "deshabilitados" && "active"} pointer`}
                            onClick={() => {setActiveTab("deshabilitados");}}
                        >
                            <i className="bi-x-circle-fill text-danger" /> Inactivos
                        </a>
                    </li>
                </ul>
            </section>

            <section className="monitor-body bg-white p-3">
                {content}
            </section>

            <section className="monitor-footer p-3 d-flex justify-content-between">
                <div className="btn-group">
                    {selected && <Individual selected={selected} />}
                    {/* <Masivo selected={selected} />, */}
                </div>
                <div className="btn-group">
                    {/* <ModalRegistros /> */}
                </div>               
            </section>

      </div>
    )
  }
  
const mapStateToProps = state => ({
    selected: state.configuraciones.instance,

})

export default connect(mapStateToProps)(Contenido);