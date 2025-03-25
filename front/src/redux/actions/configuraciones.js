const select = (id) => ({
    type: 'SELECT_PARAMETRO',
    id
})

const get_all = () => async (dispatch) => {
    const payload = [
      {id: "", icon: "bi-person-square", full_name: "Mi Cuenta"},  
      {id: "perfil", icon: "bi-caret-right", full_name: "Datos del Perfil"},
      {id: "", icon: "bi-house-gear", full_name: "Mi Organización"},        
      {id: "comunidad", icon: "bi-caret-right", full_name: "Datos Generales"},
      {id: "", icon: "bi-list-check", full_name: "Parámetros"},
      {id: "proyecto", icon: "bi-caret-right", full_name: "Proyectos"},
      {id: "donantes", icon: "bi-caret-right", full_name: "Financiadores"},
      {id: "socios", icon: "bi-caret-right", full_name: "Socios"},
      {id: "clientes", icon: "bi-caret-right", full_name: "Clientes"},
      {id: "proveedores", icon: "bi-caret-right", full_name: "Proveedores"},
      {id: "empleados", icon: "bi-caret-right", full_name: "Empleados"},
      {id: "caja-y-bancos", icon: "bi-caret-right", full_name: "Caja / Bancos"},
      {id: "ingresos", icon: "bi-caret-right", full_name: "Tipos de ingresos"},
      {id: "gastos", icon: "bi-caret-right", full_name: "Tipos de gastos"},
      {id: "titulo", icon: "bi-caret-right", full_name: "Plan de cuentas"},
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
