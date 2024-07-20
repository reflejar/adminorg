"use client"

import { connect } from 'react-redux'
import { analisisActions } from "@/redux/actions/analisis";

function Botonera({analizar,agrupar_por,encolumnar,totalizar,setAnalizar, setAgrupar, setColumna, setTotalizar}) {
    

    const handleSeleccion = (event) => {
      const opciones = event.target.options;
      setAgrupar("")
      setColumna("")
      setTotalizar("total_pesos")
      const seleccionados = [];
      for (let i = 0; i < opciones.length; i++) {
        if (opciones[i].selected) {
          seleccionados.push(opciones[i].value);
        }
      }

      setAnalizar(seleccionados)
    };


    return (<div className="col-lg-2 min-vh-100 pe-3">
              <div className="monitor-head p-3 d-flex align-items-center">
                <div className="d-flex justify-content-center align-items-center text-dark "></div>
              </div>
              <div className="monitor-body-without-footer text-end p-3 bg-white">
                <label className='mt-3' htmlFor="analizar">Analizar</label>
                <select type="select" className='form-select' multiple name='analizar' value={analizar} onChange={handleSeleccion}>
                  <option value="creditos">Clientes</option>
                  <option value="deudas">Proveedores</option>
                  <option value="caja-y-bancos">Tesorería</option>
                  <option value="ingresos">Ingresos</option>
                  <option value="gastos">Gastos</option>
                  <option value="titulo">Títulos contables</option>
                </select>
                <label className='mt-3' htmlFor="agrupar_por">Agrupar</label>
                <select type="select" className='form-select' name='agrupar_por' value={agrupar_por} onChange={(e) => setAgrupar(e.target.value)}>
                <option value="">---</option>
                  <option value="concepto">Tipo</option>
                  <option value="proyecto">Proyectos</option>
                </select>
                <label className='mt-3' htmlFor="encolumnar">Columnas</label>
                <select type="select" className='form-select' name='encolumnar' value={encolumnar} onChange={(e) => setColumna(e.target.value)}>
                  <option value="">---</option>
                  <option value="periodo">Período</option>
                </select>
                <label className='mt-3' htmlFor="totalizar">Totalizar</label>
                <select type="select" className='form-select' name='totalizar' value={totalizar} onChange={(e) => setTotalizar(e.target.value)}>
                  <option value="">---</option>
                  <option value="total_pesos">Saldos totales $ARS</option>
                  <option value="$ARS">Saldos $ARS</option>
                  <option value="$USD">Saldos $USD</option>
                  <option value="cantidad">Cantidades</option>
                </select>                                
              </div>
            </div>)
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
    
    