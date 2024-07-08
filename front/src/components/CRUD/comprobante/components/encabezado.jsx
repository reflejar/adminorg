import { usePuntosDeVenta } from "@/utility/hooks";
import CHOICES from "./choices";
import Portlet from "./portlet";
import { monedas } from "@/utility/options/monedas";

export default function Encabezado ({
    comprobante,
    tipoComprobante,
    setComprobante,
    onlyRead,
    }) {

    const types = CHOICES.receiptTypes[comprobante.modulo].filter(x => x.comportamiento === comprobante.comportamiento)
    const [point_of_sales] = usePuntosDeVenta();

    const handleChange = (e) => {
        if (e.target.value !== "---") {
            const name = e.target.name
            const subfields = name.split(".")
            subfields.length > 1 ?
                setComprobante({
                ...comprobante,
                [subfields[0]]: {
                    ...comprobante[subfields[0]],
                    [subfields[1]]: e.target.value
                }
                }) :
                setComprobante({
                ...comprobante,
                [name]: e.target.value
                })
        }
    }

    return (
        <Portlet title="Encabezado del Comprobante" handler='Encabezado del Comprobante'>
            <div className="row">
                <div className="col-md-2 px-1">
                <label htmlFor="receipt.receipt_type">Tipo</label>
                {comprobante.id ? 
                    <input 
                    type="text" 
                    className="form-control" 
                    name="receipt.receipt_type" 
                    id="receipt.receipt_type"
                    disabled={true}
                    value={comprobante.receipt.receipt_type}
                    />       
                : <select 
                    className="form-control" 
                    name="receipt.receipt_type" 
                    id="receipt.receipt_type"
                    disabled={onlyRead}
                    onChange={handleChange}
                    value={comprobante.receipt.receipt_type || ''}
                    >
                    <option value=''> --- </option>
                    {types.map((type, i) => (
                        <option key={i} value={type.value}>{type.value}</option>
                    ))}
                </select>}
                </div>
                <div className="col-md-2 px-1">
                    <label htmlFor="receipt.point_of_sales">Punto de Venta</label>
                    {(tipoComprobante && tipoComprobante.receipt_number === "auto") && !comprobante.id && point_of_sales ? <select 
                    className="form-control"
                    name="receipt.point_of_sales" 
                    id="receipt.point_of_sales" 
                    disabled={onlyRead}
                    onChange={handleChange}
                    value={comprobante.receipt.point_of_sales || ''}
                    >
                    <option value=''> --- </option>
                        {point_of_sales.map((point, i) => (
                            <option key={i} value={point.number}>{point.number}</option>
                        ))}
                    </select> : 
                        <input 
                        type="number" 
                        className="form-control" 
                        name="receipt.point_of_sales" 
                        id="receipt.point_of_sales"
                        disabled={onlyRead || (tipoComprobante && tipoComprobante.receipt_number === "auto")}
                        min="0" 
                        onChange={handleChange}
                        value={comprobante.receipt.point_of_sales || ''}
                        />
                    }
                
                </div>            
                <div className="col-md-2 px-1">
                <label htmlFor="receipt.receipt_number">N°</label>
                <input 
                    type="number" 
                    className="form-control" 
                    disabled={onlyRead || (tipoComprobante && tipoComprobante.receipt_number === "auto")}
                    name="receipt.receipt_number" 
                    id="receipt.receipt_number" 
                    onChange={handleChange}
                    value={comprobante.receipt.receipt_number || ''}
                />
                </div>              
                <div className="col-md-2 px-1">
                <label htmlFor="receipt.issued_date">Fecha Comprobante</label>
                <input 
                    className="form-control" 
                    name="receipt.issued_date" 
                    type="date" 
                    disabled={onlyRead}
                    onChange={handleChange}
                    value={comprobante.receipt.issued_date || ''}
                />
                </div>               
                <div className="col-md-2 px-1">
                <label htmlFor="fecha_operacion">Fecha Operación</label>
                <input 
                    className="form-control" 
                    name="fecha_operacion" 
                    type="date" 
                    disabled={onlyRead}
                    onChange={handleChange}
                    value={comprobante.fecha_operacion || ''}
                />
                </div>
                <div className="col-md-1 px-1">
                <label htmlFor="fecha_operacion">Moneda</label>
                <select 
                    className="form-control"
                    name="receipt.currency" 
                    id="receipt.currency" 
                    disabled={onlyRead}
                    onChange={handleChange}
                    value={comprobante.receipt.currency || ''}
                    >
                        <option value="">---</option>
                        {monedas.map((c, i) => (
                            <option key={i} value={c.value}>{c.label}</option>
                        ))}
                    </select>
                </div>    
                {comprobante.receipt.currency && comprobante.receipt.currency !== '$ARS' && <div className="col-md-1 px-1">
                <label htmlFor="fecha_operacion">TC</label>
                <input 
                    className="form-control" 
                    name="receipt.currency_quote" 
                    type="number" 
                    min={1}
                    disabled={onlyRead}
                    onChange={(e) => e.target.value >= 1 && handleChange(e) }
                    value={comprobante.receipt.currency_quote || 1}
                />
                </div>}
            </div>

        </Portlet>
    )
};