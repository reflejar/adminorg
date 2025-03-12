"use client"

import { connect } from 'react-redux'
import { analisisActions } from "@/redux/actions/analisis";

function Botonera({ analizar, agrupar_por, encolumnar, totalizar, setAnalizar, setAgrupar, setColumna, setTotalizar }) {

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        setAgrupar("");
        setColumna("");
        setTotalizar("total_pesos");

        let nuevosAnalizar = [...analizar];
        if (checked) {
            nuevosAnalizar.push(value);
        } else {
            nuevosAnalizar = nuevosAnalizar.filter(item => item !== value);
        }

        setAnalizar(nuevosAnalizar);
    };

    return (
        <div className="col-lg-2 min-vh-100 pe-3">
            <div className="monitor-body-without-footer mt-5 p-3 bg-white">
                <h5>Analizar</h5>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            value="proyectos"
                            className='form-check-input'
                            checked={analizar.includes("proyectos")}
                            onChange={handleCheckboxChange}
                        /> Proyectos
                    </label>
                </div>
                <hr />
                <div>
                    <label>
                        <input
                            type="checkbox"
                            value="ingresos"
                            className='form-check-input'
                            checked={analizar.includes("ingresos")}
                            onChange={handleCheckboxChange}
                        /> Ingresos
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            value="gastos"
                            className='form-check-input'
                            checked={analizar.includes("gastos")}
                            onChange={handleCheckboxChange}
                        /> Gastos
                    </label>
                </div>
                <hr />
                <div>
                    <label>
                        <input
                            type="checkbox"
                            value="creditos"
                            className='form-check-input'
                            checked={analizar.includes("creditos")}
                            onChange={handleCheckboxChange}
                        /> Deudas de Clientes
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            value="deudas"
                            className='form-check-input'
                            checked={analizar.includes("deudas")}
                            onChange={handleCheckboxChange}
                        /> Deudas con Proveedores
                    </label>
                </div>
                <hr />
                <div>
                    <label>
                        <input
                            type="checkbox"
                            value="caja-y-bancos"
                            className='form-check-input'
                            checked={analizar.includes("caja-y-bancos")}
                            onChange={handleCheckboxChange}
                        /> Caja y Bancos
                    </label>
                </div>
                {analizar.includes("creditos") | analizar.includes("deudas") ? <div>
                    <h5 className='mt-4'><label htmlFor="agrupar_por">Agrupar</label></h5>
                    <select type="select" className='form-select' name='agrupar_por' value={agrupar_por} onChange={(e) => setAgrupar(e.target.value)}>
                        <option value="">---</option>
                        <option value="concepto">Tipo</option>
                    </select>    
                </div> : null}

                {analizar.length < 2 ? <div>
                    <h5 className='mt-4'><label htmlFor="encolumnar">Período</label></h5>
                    <select type="select" className='form-select' name='encolumnar' value={encolumnar} onChange={(e) => setColumna(e.target.value)}>
                        <option value="">Hoy</option>
                        <option value="periodo">Semanal</option>
                        <option value="periodo">Mensual</option>
                    </select>
                </div> : null}                
                
                

                <h5 className='mt-4'><label htmlFor="totalizar">Totalizar</label></h5>
                <select type="select" className='form-select' name='totalizar' value={totalizar} onChange={(e) => setTotalizar(e.target.value)}>
                    <option value="">---</option>
                    <option value="total_pesos">Saldos totales $ARS</option>
                    <option value="$ARS">Saldos $ARS</option>
                    <option value="$USD">Saldos $USD</option>
                </select>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    analizar: state.analisis.analizar,
    agrupar_por: state.analisis.agrupar_por,
    encolumnar: state.analisis.encolumnar,
    totalizar: state.analisis.totalizar,
})

const mapDispatchToProps = (dispatch) => ({
    setAnalizar: payload => dispatch(analisisActions.selectAnalizar(payload)),
    setAgrupar: payload => dispatch(analisisActions.selectAgrupar(payload)),
    setColumna: payload => dispatch(analisisActions.selectColumna(payload)),
    setTotalizar: payload => dispatch(analisisActions.selectTotalizar(payload))

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Botonera)