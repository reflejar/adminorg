"use client"

import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { clientesActions } from "@/redux/actions/clientes";

import Spinner from '@/components/spinner';
import Cliente from "@/components/CRUD/cliente/CU";
import BasicModal from '@/components/modal';

function Listado({searchTerm, searchOnChange, items, instance, getItems, setSelectedObject}) {

    const [loading, setLoading] = useState(false)
    const [modal, setModal] = useState(false)

    useEffect(()=> {
      if (items.length === 0) refreshItems()
    }, [])

    const handleToggle = () => {
      setModal(!modal);
    };    


    const refreshItems = async () => {
      setLoading(true)
      await getItems()
      setLoading(false)
    }

    return (<div className="col-lg-2 min-vh-100 bg-light">
              <div className="monitor-head p-3 d-flex align-items-center">
                <div className="d-flex justify-content-center align-items-center text-dark ">
                  <div className="form-control-position pointer">
                  <BasicModal
                      open={modal}
                      onToggle={handleToggle}
                      button={<i onClick={handleToggle} className="bi-plus-circle" ></i>}
                      header="Nueva Cuenta por Cobrar"
                      component={<Cliente onClose={() => handleToggle(false)} />}
                      footer={false}
                    />
                  </div>
                  <input
                      className="form-control mx-2 shadow-sm"
                      id="searchUser"
                      name="searchUser"
                      placeholder="Buscar"
                      type="text"
                      onChange={e => searchOnChange(e.target.value)}
                      value= {searchTerm}
                  />
                  <div className="form-control-position pointer">
                    <i onClick={refreshItems} className="bi-arrow-clockwise" ></i>
                  </div>                  
                </div>
              </div>
              <div className="monitor-body-without-footer p-3 bg-white">
                {loading ? <Spinner />  : <table className="table table-xs table-hover">
                  <tbody>
                    {items && items.map((item,key) => (
                      <tr 
                        className={(instance && instance.id === item.id) ? "table-primary" : ""} 
                        onClick={() => setSelectedObject(item)}
                        key={key}
                      >
                        <td className='fs-6 pointer'>{item.full_name}</td>  
                      </tr>                
                    ))}
                  </tbody>
                </table>   }
             
              </div>
            </div>)
  }


const mapStateToProps = (state) => ({
  searchTerm: state.clientes.search,
  items: state.clientes.search !== '' ? 
         state.clientes.list.filter(t => t.full_name.toLocaleLowerCase().includes(state.clientes.search.toLocaleLowerCase())) : 
         state.clientes.list,
  instance: state.clientes.instance
});

const mapDispatchToProps = (dispatch) => ({
  searchOnChange: searchTerm => dispatch(clientesActions.search(searchTerm)),
  getItems: () => dispatch(clientesActions.get_all()),
  setSelectedObject: payload => dispatch(clientesActions.select(payload))

});


export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(Listado)
  
  