'use client'
import { useEffect, useState } from "react"

export default function Portlet ({
    title,
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
        <div className="accordion-item ">
            <span className="accordion-header" id={`heading-${handler}`}>
                <button className={`accordion-button fw-bold text-primary ${color ? color : "bg-white"} ${display ? "" :"py-1 fs-7" }`} type="button" onClick={() => setDisplay(!display)}>
                    {title}
                </button>
            </span>
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