'use client'
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux'

import Spinner from '@/components/spinner';
import Listado from '@/components/listados';
import BasicModal from '@/components/modal';

import { clientesActions } from '@/redux/actions/clientes';
import { proveedoresActions } from '@/redux/actions/proveedores';
import { cajasActions } from '@/redux/actions/cajas';
import { ingresosActions } from '@/redux/actions/ingresos';
import { gastosActions } from '@/redux/actions/gastos';
import { titulosActions } from '@/redux/actions/titulos';


import Cliente from "@/components/CRUD/cliente/CU";
import Proveedor from "@/components/CRUD/proveedor/CU";
import Caja from "@/components/CRUD/caja/CU";
import Proyecto from "@/components/CRUD/proyecto/CU";
import Ingreso from "@/components/CRUD/ingreso/CU";
import Gasto from "@/components/CRUD/gasto/CU";
import Titulo from "@/components/CRUD/titulo/CU";
import { proyectosActions } from '@/redux/actions/proyectos';


function Grupo({ 
    selected, 
    creditos, 
    deudas,
    cajaYBancos,
    proyecto,
    ingresos,
    gastos,
    titulo,
 }) {
    const [modal, setModal] = useState({open: false,item: null});

    const handleModal = (rowInfo) => {
        setModal({
            open: !modal.open,
            item: rowInfo
        });
      };

    const grupos = {
        creditos: {
            action: clientesActions,
            lista: creditos,
            columnas: [
                { label: "Nombre", key: "perfil.nombre"},
                { label: "Razón social", key: "perfil.razon_social" },
                { label: "Tipo de documento", key: "perfil.tipo_documento" },
                { label: "Numero", key: "perfil.numero_documento" },
                { label: "Mail", key: "perfil.mail" },
                { label: "Teléfono", key: "perfil.telefono" },
                { label: "Editar", key: "", onClick: handleModal},
              ],
            modal: <Cliente selected={modal.item} onClose={handleModal} />
        },
        deudas: {
            action: proveedoresActions,
            lista: deudas,
            columnas: [
                { label: "Nombre", key: "perfil.nombre" },
                { label: "Razón social", key: "perfil.razon_social" },
                { label: "Tipo de documento", key: "perfil.tipo_documento" },
                { label: "Numero", key: "perfil.numero_documento" },
                { label: "Mail", key: "perfil.mail" },
                { label: "Teléfono", key: "perfil.telefono" },
                { label: "Editar", key: "", onClick: handleModal},
              ],
              modal: <Proveedor selected={modal.item} onClose={handleModal} />
        },
        proyecto: {
            action: proyectosActions,
            lista: proyecto,
            columnas: [
                { label: "Nombre", key: "nombre" },
                { label: "Editar", key: "", onClick: handleModal},
              ],
              modal: <Proyecto selected={modal.item} onClose={handleModal} />
        },        
        'caja-y-bancos': {
            action: cajasActions,
            lista: cajaYBancos,
            columnas: [
                { label: "Nombre", key: "nombre" },
                { label: "", key: "taxon" },
                { label: "Moneda", key: "moneda" },
                { label: "Editar", key: "", onClick: handleModal},
              ],
              modal: <Caja selected={modal.item} onClose={handleModal} />
        },
        ingresos: {
            action: ingresosActions,
            lista: ingresos,
            columnas: [
                { label: "Nombre", key: "nombre" },
                { label: "Editar", key: "", onClick: handleModal},
              ],
              modal: <Ingreso selected={modal.item} onClose={handleModal} />
        },
        gastos: {
            action: gastosActions,
            lista: gastos,
            columnas: [
                { label: "Nombre", key: "nombre" },
                { label: "Editar", key: "", onClick: handleModal},
              ],
              modal: <Gasto selected={modal.item} onClose={handleModal} />
        },  
        titulo: {
            action: titulosActions,
            lista: titulo,
            columnas: [
                { label: "Numero", key: "numero" },
                { label: "Nombre", key: "nombre" },
                { label: "Predeterminado para", key: "predeterminado" },
                { label: "Editar", key: "", onClick: handleModal},
              ],
              modal: <Titulo selected={modal.item} onClose={handleModal} />
        },        
    }

    const grupo = selected && grupos[selected.id]

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const renderModal = () => {
        if (modal.item) {
          return (
              <BasicModal
                open={modal.open}
                onToggle={handleModal}
                header={"Editar"}
                footer={false}
                component={grupo.modal}
              />          
            )
        } 
      }
    
    useEffect(() => {
        const getItems = async () => {
            if (selected) {
                if (grupo.lista.length === 0) {
                    setLoading(true)
                    await dispatch(grupo.action.get_all())
                    setLoading(false)
                }
            }
        }
        getItems()
    }, [selected])

    const refreshItems = async () => {
        setLoading(true)
        await dispatch(grupo.action.get_all())
        setLoading(false)
      }
  

    if (loading) return <Spinner />
    
    else if (grupo && grupo.lista.length > 0) {
        return (<>
                {modal && modal.item && renderModal()}
                <Listado items={grupo.lista} columns={grupo.columnas} topRight={<i onClick={refreshItems} className="btn btn-sm btn-outline-dark bi-arrow-clockwise pointer" ></i>} />
        </>)
    } else {
        return "No hay items"
    }

  }
  
const mapStateToProps = state => ({
    creditos: state.clientes.list,
    deudas: state.proveedores.list,
    proyecto: state.proyectos.list,
    cajaYBancos: state.cajas.list,
    ingresos: state.ingresos.list,
    gastos: state.gastos.list,
    titulo: state.titulos.list,

})

export default connect(mapStateToProps)(Grupo);