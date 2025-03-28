'use client'
import { useEffect, useState } from "react"

export default function Portlet ({
    title,
    subtotal,
    handler,
    children,
    color,
  }) {

    const [display, setDisplay] = useState(color === "bg-light" ? false : true)

    useEffect(()=> {
        if (color === "bg-light") setDisplay(!display)
    }, [color])

return (
    <div className="row animate__animated animate__faster animate__fadeIn">
    <div className="col-md-12 accordion accordion-flush " id={`accordion-${handler}`}>
        <div className="accordion-item">
            <div className="accordion-header" id={`heading-${handler}`}>
                <div 
                    className={`accordion-button fw-bold pointer d-flex ${color ? color : "bg-white"} ${display ? "" :"py-1 fs-7" }`} 
                    // type="button" 
                    onClick={() => setDisplay(!display)}>
                        <div className="col-md-6 text-primary">{title}</div>
                        {subtotal > 0 && <div className="col-md-4 text-end text-info">Subtotal: {subtotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>}
                </div>
            </div>
            <div id={`collapse-${handler}`} className={`accordion-collapse collapse ${display && "show" }`} aria-labelledby={`heading-${handler}`}>
                <div className="accordion-body">
                    {children}
                </div>
            </div>            
        </div>             
    </div>
    
</div>
)
}