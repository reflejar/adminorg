const select = (id) => ({
    type: 'SELECT_PARAMETRO',
    id
})

const get_all = () => async (dispatch) => {
    const payload = [
      {id: "",full_name: "Contactos"},
      {id: "cliente",full_name: "Clientes y Financiadores"},
      {id: "proveedor",full_name: "Proveedores"},
      {id: "",full_name: "Area Economica"},
      {id: "proyecto",full_name: "Proyectos"},
      {id: "caja",full_name: "Tesorería"},
      {id: "ingreso",full_name: "Tipos de ingresos"},
      {id: "gasto",full_name: "Tipos de gastos"},
      {id: "",full_name: "Area Contable"},
      {id: "titulo",full_name: "Cuentas contables"},
    ]

    dispatch({
        type: 'GET_PARAMETROS',
        payload: payload
    });
}


export const configuracionesActions = {
    get_all,
    select,
}
