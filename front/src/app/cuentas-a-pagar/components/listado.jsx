"use client"

import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { proveedoresActions } from "@/redux/actions/proveedores";
import ModalNew from './contenido/modalProveedor';
import Spinner from '@/components/spinner';

function Listado({searchTerm, searchOnChange, items, instance, getItems, setSelectedObject}) {

    const [loading, setLoading] = useState(false)

    useEffect(()=> {
      if (items.length === 0) refreshItems()
    }, [])

    const refreshItems = async () => {
      setLoading(true)
      await getItems()
      setLoading(false)
    }

    return (<div className="col-lg-2 min-vh-100 bg-light">
              <div className="monitor-head p-3 d-flex align-items-center">
                <div className="d-flex justify-content-center align-items-center text-dark ">
                  <div className="form-control-position pointer">
                    <ModalNew />
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
              {loading ? <Spinner />  : <table className="table table-sm">
                  <tbody>
                    {items && items.map((item,key) => (
                      <tr 
                        className={(instance && instance.id === item.id) ? "table-primary" : ""} 
                        onClick={() => setSelectedObject(item)}
                        key={key}
                      >
                        <td className=' pointer'>{item.full_name}</td>  
                      </tr>                
                    ))}
                  </tbody>
                </table>}                
                            
              </div>
            </div>)
  }


const mapStateToProps = (state) => ({
  searchTerm: state.proveedores.search,
  items: state.proveedores.search !== '' ? 
         state.proveedores.list.filter(t => t.full_name.toLocaleLowerCase().includes(state.proveedores.search.toLocaleLowerCase())) : 
         state.proveedores.list,
  instance: state.proveedores.instance
});

const mapDispatchToProps = (dispatch) => ({
  searchOnChange: searchTerm => dispatch(proveedoresActions.search(searchTerm)),
  getItems: () => dispatch(proveedoresActions.get_all()),
  setSelectedObject: payload => dispatch(proveedoresActions.select(payload))

});


export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(Listado)
  
  