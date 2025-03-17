const select = (id) => ({
    type: 'SELECT_PARAMETRO',
    id
})

const get_all = () => async (dispatch) => {
    const payload = [
      {id: "",full_name: "Contactos"},
      {id: "creditos",full_name: "Clientes y Financiadores"},
      {id: "deudas",full_name: "Proveedores y Empleados"},
      {id: "",full_name: "Area Economica"},
      {id: "proyecto",full_name: "Proyectos"},
      {id: "caja-y-bancos",full_name: "Caja y Bancos"},
      {id: "ingresos",full_name: "Tipos de ingresos"},
      {id: "gastos",full_name: "Tipos de gastos"},
      {id: "",full_name: "Area Contable"},
      {id: "titulo",full_name: "Plan de cuentas"},
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
