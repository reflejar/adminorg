import React, {Fragment, useState} from "react";
import { connect, useSelector } from "react-redux";
import { Table } from 'reactstrap';
import { useTitulos } from "@/utility/hooks";
import { titulosActions } from "@/redux/actions/titulos";
import ModalNew from './contenido/modalTitulo';

import Spinner from "@/components/spinner";

const Item = ({ indentation, item, children, titulos, filterChildren, setSelected }) => {
    const indentationItem = indentation + "px";

    const selected = useSelector(state => state.titulos.instance)

    const [openItem, setOpenItem] = useState(false);

    const selectItem = () => {
        setSelected(item);
        setOpenItem(!openItem);
    }

    return (
        <Fragment>
            <tr 
            className={selected === item ? "table-primary" : ""}
            style={{cursor: 'pointer'}}
            onClick={selectItem}
            > 
                <td style={{"paddingLeft": indentationItem}} >
                    {children && (openItem ? <i className="bi-chevron-down" /> : <i className="bi-chevron-right" />)}
                    {children ? <i className="bi-folder" /> : <i className="bi-file-text" /> } {children ? item.full_name : item.nombre}
                </td>
                <td className="text-right">{item.numero}</td>
            </tr>
            {openItem && children && children.map((itemChild, keyChild) => (
                    <Item 
                        indentation={indentation+10}
                        item={itemChild} 
                        key={keyChild}
                        children={filterChildren(titulos, itemChild)} 
                        titulos={titulos}
                        filterChildren={filterChildren}
                        selected={selected}
                        setSelected={setSelected}
                    />))}
            {openItem && item.cuentas && item.cuentas.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((itemChild, keyChild) => (
                    <Item 
                        indentation={indentation+10}
                        item={itemChild} 
                        key={keyChild}
                        children={null}
                        titulos={titulos}
                        filterChildren={filterChildren}
                        selected={selected}
                        setSelected={setSelected}
                    />))}                    
        </Fragment>
    
      )
};

const fitlerParents = (arr) => arr.filter(x => !x.supertitulo);
const filterChildren = (arr, item) => arr.filter(x => x.supertitulo === item.id);


const List = ({setSelected}) => {
    
    const [titulos, loadingTitulos] = useTitulos(true);

    if (loadingTitulos) {
        return <Spinner />
      }
  

    return (
        <div className="col-lg-3 min-vh-100 bg-light">
        <div className="monitor-head p-3 d-flex align-items-center">
            <div className="d-flex justify-content-center align-items-center text-dark ">
                <div className="form-control-position pointer">
                <ModalNew />
                </div>
            </div>
        </div>
          <div className="monitor-body-without-footer p-3 bg-white">
          <Table size="sm" responsive borderless={true} hover={true}>
               <thead>
                  <tr>
                     <th>Titulo/Cuenta</th>
                     <th className="text-right">N°</th>
                  </tr>
               </thead>
               <tbody>
                {titulos && fitlerParents(titulos).map((item, key) => (
                <Item 
                    indentation={0}
                    item={item}
                    key={key} 
                    children={filterChildren(titulos, item)}
                    titulos={titulos}
                    filterChildren={filterChildren}
                    setSelected={setSelected}
                />))}

               </tbody>
            </Table>
          </div>
        </div>
      );

}
 

const mapDispatchToProps = dispatch => ({
    setSelected: payload => dispatch(titulosActions.select(payload))
})

export default connect(
    null,
    mapDispatchToProps
)(List)