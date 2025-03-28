"use client"

import { connect } from 'react-redux'
import { analisisActions } from "@/redux/actions/analisis";

function Botonera({ analizar, agrupar_por, periodo, totalizar, setAnalizar, setAgrupar, setColumna, setTotalizar }) {


    const handleChange = (event) => {
        setAnalizar(event.target.value.split(","));
    };

    return (
        <div className="col-lg-2 min-vh-100 pe-3">
            <div className="monitor-body-without-footer mt-5 p-3">
                <h5>Analizar</h5>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="proyecto"
                            className='form-check-input'
                            checked={analizar.includes("proyecto")}
                            onChange={handleChange}
                            name="analizar"
                        /> Proyectos
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="ingresos,gastos"
                            className='form-check-input'
                            checked={analizar.includes("ingresos")}
                            onChange={handleChange}
                            name="analizar"
                        /> Ingresos y Gastos
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="creditos"
                            className='form-check-input'
                            checked={analizar.includes("creditos")}
                            onChange={handleChange}
                            name="analizar"
                        /> Deudas a Cobrar
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="deudas"
                            className='form-check-input'
                            checked={analizar.includes("deudas")}
                            onChange={handleChange}
                            name="analizar"
                        /> Deudas a Pagar
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="caja-y-bancos"
                            className='form-check-input'
                            checked={analizar.includes("caja-y-bancos")}
                            onChange={handleChange}
                            name="analizar"
                        /> Caja y Bancos
                    </label>
                </div>
                {/* {analizar.includes("creditos") | analizar.includes("deudas") ? <div>
                    <h5 className='mt-4'><label htmlFor="agrupar_por">Agrupar</label></h5>
                    <select type="select" className='form-select' name='agrupar_por' value={agrupar_por} onChange={(e) => setAgrupar(e.target.value)}>
                        <option value="">---</option>
                        <option value="concepto">Tipo</option>
                    </select>    
                </div> : null} */}

                {<div>
                    <h5 className='mt-4'><label htmlFor="periodo">Período</label></h5>
                    <div>
                        <label>
                            <input
                                type="radio"
                                value="hoy"
                                className='form-check-input'
                                checked={periodo === "hoy"}
                                onChange={(e) => setColumna(e.target.value)}
                                name="periodo"
                            /> Hoy
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type="radio"
                                value="mensual"
                                className='form-check-input'
                                checked={periodo === "mensual"}
                                onChange={(e) => setColumna(e.target.value)}
                                name="periodo"
                            /> Mensual
                        </label>
                    </div>
                    {/* <select type="select" className='form-select' name='periodo' value={periodo} onChange={(e) => setColumna(e.target.value)}>
                        <option value="">Hoy</option>
                        <option value="periodo">Mensual</option>
                    </select> */}
                </div>}                
                
                

                <h5 className='mt-4'><label htmlFor="totalizar">Sumar</label></h5>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="total_pesos"
                            className='form-check-input'
                            checked={totalizar === "total_pesos"}
                            onChange={(e) => setTotalizar(e.target.value)}
                            name="totalizar"
                        /> Saldos totales en $
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="$"
                            className='form-check-input'
                            checked={totalizar === "$"}
                            onChange={(e) => setTotalizar(e.target.value)}
                            name="totalizar"
                        /> Saldos en $
                    </label>
                </div>     
                <div>
                    <label>
                        <input
                            type="radio"
                            value="$USD"
                            className='form-check-input'
                            checked={totalizar === "$USD"}
                            onChange={(e) => setTotalizar(e.target.value)}
                            name="totalizar"
                        /> Saldos en $USD
                    </label>
                </div>                                     
                {/* <select type="select" className='form-select' name='totalizar' value={totalizar} onChange={}>
                    <option value="">---</option>
                    <option value="total_pesos">Saldos totales $</option>
                    <option value="$">Saldos $</option>
                    <option value="$USD">Saldos $USD</option>
                </select> */}
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    analizar: state.analisis.analizar,
    agrupar_por: state.analisis.agrupar_por,
    periodo: state.analisis.periodo,
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