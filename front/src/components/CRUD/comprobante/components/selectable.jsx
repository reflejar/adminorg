import { useEffect, useState } from "react"
import Portlet from "./portlet"


export default function Selectable ({ comprobante, setComprobante, onlyRead, color, title, handler, rows }) {

    const [grouped, setGrouped] = useState([...rows.filter(s => s.moneda === comprobante.receipt.currency).map(obj=> ({
        vinculo: obj.id, 
        concepto: `${obj.concepto ? obj.concepto + " - " : ""} ${obj.comprobante}`, 
        monto:obj.saldo, 
        moneda:obj.moneda, 
        tipo_cambio: obj.tipo_cambio,
        total_pesos: obj.saldo*comprobante.receipt.currency_quote,
        max:obj.saldo, 
        checked:comprobante.id ? true : false,
        detalle: ''
    }))])

    useEffect(() => {
        const newGrouped = rows.filter(s => s.moneda === comprobante.receipt.currency).map(obj=> ({
            vinculo: obj.id, 
            concepto: `${obj.cuenta ? obj.cuenta + " - " : ''} ${obj.concepto ? obj.concepto + " - " : ""} ${obj.comprobante}`, 
            monto:obj.saldo, 
            moneda:obj.moneda, 
            tipo_cambio: obj.tipo_cambio,
            total_pesos: obj.saldo*comprobante.receipt.currency_quote,
            max:obj.saldo, 
            checked:false,
            detalle: ''
        }))
        setGrouped(newGrouped)
    }, [comprobante.receipt.currency])

    useEffect(() => {
        const newGrouped = grouped.map(c => ({...c, total_pesos: c.monto*comprobante.receipt.currency_quote}))
        setGrouped(newGrouped)
    }, [comprobante.receipt.currency_quote]);

    const handleChange = (e) => {
        e.preventDefault();
        const [row, name] = e.target.name.split('.');
        const newGrouped = [...grouped]; // Crear una nueva copia del estado
    
        if (name === "vinculo") {
            newGrouped[row]['checked'] = !newGrouped[row]['checked'];
        } else {
            if (+e.target.max >= +e.target.value) {
                const value = Number(+e.target.value)
                newGrouped[row][name] = value;
                if (name === "monto") {
                    newGrouped[row]['total_pesos'] = value*comprobante.receipt.currency_quote
                }                
            }
        }
        setGrouped(newGrouped);
    };

    useEffect(() => {
        setComprobante(() => ({
        ...comprobante,
        [handler]: grouped.filter(g => (g.monto !== 0 && g.checked === true))
        }))

    }, [grouped])


    return (
        <Portlet title={title} handler={handler} color={color} display={"in"}>
        <div className="row">
            <div className="col-md-12">
            {grouped.length === 0 ? <div className="text-center fs-4">...No hay items...</div> : <table className="table table-condensed table-responsive">
                <thead>
                <tr className="row">
                    <th className="col-md-1"></th>
                    <th className="col-md-9">Tipo</th>
                    <th className="col-md-2">Monto</th>
                </tr>
                </thead>
                <tbody>
                {grouped.map((row, i) => {
                    return (<tr key={i} className="row" >
                    <td className="col-md-1">
                        <input 
                        className="form-check" 
                        type="checkbox" 
                        value={row.vinculo} 
                        name={`${i}.vinculo`} 
                        checked={row.checked} 
                        disabled={onlyRead}
                        onChange={handleChange}
                        />
                    </td>
                    <td className={`col-md-9 ${onlyRead && "text-muted"}`}>{row.concepto}</td>
                    <td className="col-md-2">
                        <input 
                        className="form-control input-sm "
                        type="number" 
                        value={row.monto} 
                        name={`${i}.monto`} 
                        disabled={onlyRead || row.monto < 0}
                        onChange={handleChange}
                        max={row.max} 
                        />
                    </td>

                    </tr>)
                })}

                </tbody>
            </table>}
            </div>
        </div>
        </Portlet>
    )  
};