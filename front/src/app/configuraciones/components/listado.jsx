"use client"

import { useEffect } from 'react';
import { connect } from 'react-redux'
import { configuracionesActions } from "@/redux/actions/configuraciones";

function Listado({items, instance, getItems, setSelectedObject}) {

    useEffect(()=> {
      if (items.length === 0) getItems()
    }, [])
  
    return (<div className="col-lg-2 min-vh-100 bg-light">
              <div className="monitor-head bg-white">
              </div>
              <div className="monitor-body-without-footer p-3 bg-white">
              <table className="table table-sm">
                  <tbody>
                    {items && items.map((item,key) => (
                      <tr 
                        className={(instance && instance.full_name === item.full_name) ? "table-primary" : ""} 
                        onClick={() => {item.id && setSelectedObject(item)}}
                        key={key}
                      >
                        <td className={`${item.id ? "pointer" : 'text-dark fw-bold' }`}>
                         <span className={`${item.id && "ms-3" }`}> {item.icon && <i className={item.icon}></i>} {item.full_name}</span>
                        </td>  
                      </tr>                
                    ))}
                  </tbody>
                </table>    
              </div>
            </div>)
  }


const mapStateToProps = (state) => ({
  items: state.configuraciones.list,
  instance: state.configuraciones.instance
});

const mapDispatchToProps = (dispatch) => ({
  getItems: () => dispatch(configuracionesActions.get_all()),
  setSelectedObject: payload => dispatch(configuracionesActions.select(payload))
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(Listado)
  
  