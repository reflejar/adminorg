import {useState, useCallback, useEffect} from "react"
import Portlet from "./components/portlet";
import Encabezado from "./components/encabezado";
import Selectable from "./components/selectable";
import Appendable from "./components/appendable";
import { useCajas, useSaldos, useGastos, useIngresos, useProyectos, useClientes, useProveedores } from "@/utility/hooks";
import { saldosActions } from '@/redux/actions/saldos';
import { movimientosActions } from '@/redux/actions/movimientos';
import { comprobantesActions } from '@/redux/actions/comprobantes';
import { useDispatch } from "react-redux";
import Spinner from "@/components/spinner";
import moment from "moment";
import CHOICES from "./components/choices";
import { Service } from "@/redux/services/general";


export default function Comprobante({ moduleHandler, destinatario, comprobanteId, comportamiento, onClose }) {

    if (!destinatario) return null

    const dispatch = useDispatch();

    const [comprobante, setComprobante] = useState({
        id: null,
        fecha_operacion: moment().format('YYYY-MM-DD'),
        destinatario: destinatario ? destinatario.id : null,
        modulo: moduleHandler,
        comportamiento: comportamiento,
        descripcion: '',
        link: '',
        receipt: {
            receipt_type: "",
            point_of_sales: '',
            issued_date: moment().format('YYYY-MM-DD'),
            receipt_number: '',
            currency: '$',
            currency_quote: 1
        },
        cargas: [],
        cobros: [],
        descargas: [],
    });

    // const [clientes, loadingClientes] = useClientes();
    // const [proveedores, loadingProveedores] = useProveedores();
    const [onlyRead, setOnlyRead] = useState();
    const [step, setStep] = useState(1)
    const [ingresos, loadingIngresos] = useIngresos();
    const [proyectos, loadingProyectos] = useProyectos();
    const [gastos, loadingGastos] = useGastos();
    const [cajas, loadingCajas] = useCajas();
    const [saldos, loadingSaldos] = useSaldos(destinatario);
    const [canSend, setCanSend] = useState(false)
    const [loading, setLoading] = useState(false)
    const [tipoComprobante, setTipoComprobante] = useState({})
    const [titulos, setTitulos] = useState({
        encabezado: "Encabezado del Comprobante",
        cargas: {
            creditos: "Detalle del Comprobante",
            deudas: "Debitos",
            "caja-y-bancos": "Cargar dinero"
        }[moduleHandler],
        cobros: {
            creditos: "Saldos a cobrar",
            deudas: "Saldos a pagar",
        }[comprobante.modulo],
        descargas: {
            creditos: "Información para el cobro",
            deudas: "Información para el pago",
        }[comprobante.modulo],
        descripcion: "Observaciones"
    })
    const [errors, setErrors] = useState({})



    useEffect(() => {
        
        if (comprobanteId) {
            setLoading(true);
    
            dispatch(comprobantesActions.get(comprobanteId))
            .then((doc) => {
                setComprobante(doc)
                if (doc.afip || doc.modulo !== moduleHandler) setOnlyRead(true)
                const newTipo = CHOICES.receiptTypes[doc.modulo].find(t => t.value === doc.receipt.receipt_type)
                setTipoComprobante(newTipo)
                setStep(4)

            })
            .finally(() => setLoading(false));
          }
    }, []);

    useEffect(()=> {
        if (!comprobante.id) {
            setComprobante(doc => ({
                ...doc, 
                receipt: {
                    ...doc.receipt, 
                    point_of_sales: '', 
                    receipt_number: ''
                },
            }))
            const newTipo = CHOICES.receiptTypes[comprobante.modulo].find(t => t.value === comprobante.receipt.receipt_type)
            setTipoComprobante(newTipo)
        }
    }, [comprobante.receipt.receipt_type])


    const validate = () => {
        if (comprobante.receipt.receipt_type === '') return false
        if (comprobante.receipt.point_of_sales === '') return false
        if (comprobante.receipt.currency === '') return false
        if (comprobante.receipt.receipt_type !== '') {
            if(tipoComprobante && tipoComprobante.receipt_number === "manual" && comprobante.receipt.receipt_number === "") 
            return false
        }

        const totalCargas = comprobante.cargas ? comprobante.cargas.filter(c => (c.concepto !== 0 && Number(c.total_pesos) > 0)).reduce((total, current) => total + Number(current['total_pesos']), 0) : 0
        const totalCobros = comprobante.cobros ? comprobante.cobros.reduce((total, current) => total + Number(current['total_pesos']), 0) : 0
        const totalDescargas = comprobante.descargas ? comprobante.descargas.filter(c => (c.cuenta !== 0 && Number(c.total_pesos) > 0)).reduce((total, current) => total + Number(current['total_pesos']), 0) : 0
        const totalDeudas = totalCargas + totalCobros

        // Si se crean cargas o si se intenta pagar cobros y existen descargas
        // las descargas deben ser IGUAL a la suma de cobros y cargas
        if (totalDeudas>0 && totalDescargas>0) return totalDescargas === totalDeudas
        
        if (totalDeudas < 0) return false// Significa que SOLAMENTE HAY SALDOS A FAVOR. No pase
        if (totalCobros > 0) return false // Significa que SOLAMENTE HAY COBROS. No pase
        return totalCargas > 0 // Significa que SOLAMENTE HAY CARGAS. Pase pase

    }


    useEffect(() => {
        // Generación de titulos
        setTitulos(prev => ({
            ...prev,
        }))
        // Validación si se puede enviar o no
        setCanSend(validate(comprobante))
    }, [comprobante])
    
    const updateSituation = useCallback(() => {
        dispatch(saldosActions.get({ destinatario: destinatario.id, fecha: moment().format('YYYY-MM-DD'), save:true }));
        dispatch(movimientosActions.get({ destinatario: destinatario.id, fecha: moment().format('YYYY-MM-DD'), save:true, page: 1 }));
    }, [dispatch, destinatario] );

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        setLoading(true);
        
        
        const payload = {
            ...comprobante,
            cargas: comprobante.cargas.filter(c => (Number(c.monto) > 0)),
            cobros: comprobante.cobros.filter(c => (Number(c.monto) !== 0)),
            descargas: comprobante.descargas.filter(c => (Number(c.monto) > 0)),
        }

        dispatch(comprobantesActions.send(payload))
            .then(() => {
                updateSituation();      
            })
            .catch((error) => {
                const { data } = error;
                setErrors(data);
            })
            .finally(() => {
                setLoading(false)
                if (onClose) onClose()
            })        
    },[comprobante]);

    const changeStep = (e) => {
        e.preventDefault()
        setStep(x => x+1)        
    }


    const showPDF = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const response = await Service.get(`operative/comprobantes/${comprobanteId}/?pdf=1`, 'blob')
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            setLoading(false)
            window.open(url);
        } catch (error) {
          console.error('Error al abrir la ventana:', error);
        }
      };

    if (loading) return <Spinner />

    return (
        <form onSubmit={handleSubmit} name="form_cbte" method="POST">
            <Portlet 
                title={titulos.encabezado} 
                handler='Encabezado del Comprobante' 
                color={step > 1 ? "bg-light" : ""}
            >
                <Encabezado 
                    comprobante={comprobante} 
                    tipoComprobante={tipoComprobante}
                    setComprobante={setComprobante} 
                    onlyRead={onlyRead}
                />
            </Portlet>

            {(loadingIngresos || loadingCajas || loadingGastos || loadingProyectos || loadingSaldos) ? <Spinner /> : <div>
                            {/* Seccion de Cargas */}
            {step >= 1 && 
                tipoComprobante && tipoComprobante.comportamiento === "aumento" && 
                        <Portlet 
                            title={titulos.cargas}
                            handler='descargas'
                            color={step > 1 ? "bg-light" : ""}
                        >
                            <Appendable 
                                comprobante={comprobante} 
                                setComprobante={setComprobante} 
                                onlyRead={onlyRead}
                                title={{
                                    creditos: "Detalle del Comprobante",
                                    deudas: "Debitos",
                                    "caja-y-bancos": "Cargar dinero"
                                }[comprobante.modulo]}
                                handler="cargas"
                                fields={[           
                                    {
                                    type: 'select',
                                    name: 'concepto',
                                    label: comprobante.modulo === "caja-y-bancos" ? "Desde": 'Tipo',
                                    choices: {
                                        "caja-y-bancos": cajas,
                                        creditos: ingresos,
                                        deudas: gastos
                                    }[comprobante.modulo]
                                    },
                                    {
                                    type: comprobante.modulo === "caja-y-bancos" ? "hidden": 'select',
                                    name: 'proyecto',
                                    label: 'Proyecto',
                                    choices: proyectos
                                    },
                                    {
                                    type: 'text',
                                    name: 'detalle',
                                    label: 'Detalle',
                                    },                                            
                                    {
                                    type: comprobante.modulo === "caja-y-bancos" ? "hidden": 'number',
                                    name: 'cantidad',
                                    label: 'Cantidad',
                                    },
                                    {
                                    type: (comprobante.modulo === "caja-y-bancos" && comprobante.receipt.currency !== "$") ? "number": 'hidden',
                                    name: 'tipo_cambio',
                                    label: 'TC Orig',
                                    },
                                    {
                                    type: 'number',
                                    name: 'monto',
                                    label: 'Monto',
                                    },                    
                                    {
                                    type: 'number',
                                    name: 'total_pesos',
                                    label: 'Subtotal ($)',
                                    },
                                ]}
                                cleanedField={{
                                    concepto: '',
                                    proyecto: '',
                                    cantidad: 1,
                                    tipo_cambio: 1,
                                    monto: null,
                                    detalle: '',
                                }}
                            />
                        </Portlet>
            }

            {/* Sección de Selección de cargas anteriores */}
            {step >= 1 && 
                tipoComprobante && tipoComprobante.comportamiento === "disminucion"  && (["creditos", "deudas"].includes(comprobante.modulo) || onlyRead) && 
                <Portlet 
                    title={titulos.cobros}
                    handler="cobros"
                    color={step > 1 ? "bg-light" : ""}
                >
                    <Selectable 
                        comprobante={comprobante} 
                        setComprobante={setComprobante} 
                        onlyRead={onlyRead}
                        handler="cobros"
                        rows={comprobante.id ? comprobante.cobros.map(x => ({...x.origen})): saldos}
                    />
                </Portlet>

            }

            {/* Seccion de Descargas */}
            {step >= 2 && 
                comprobante.receipt.receipt_type && (["creditos", "deudas"].includes(comprobante.modulo) || onlyRead) &&  
                    <Portlet 
                        title={titulos.descargas}
                        handler='descargas'
                        color={step > 2 ? "bg-light" : ""}
                    >
                        <Appendable 
                            comprobante={comprobante} 
                            setComprobante={setComprobante} 
                            onlyRead={onlyRead}
                            handler="descargas"
                            fields={[
                                {
                                type: 'select',
                                name: 'cuenta',
                                label: 'Cuenta',
                                choices: comprobante.receipt.receipt_type.includes("Nota de Credito") ? [...ingresos, ...gastos] : cajas.filter(c=> c.moneda === comprobante.receipt.currency)
                                },
                                {
                                type: 'text',
                                name: 'detalle',
                                label: 'Detalle',
                                },                 
                                {
                                type: 'date',
                                name: 'fecha_vencimiento',
                                label: 'Vencimiento',
                                },          
                                {
                                type: 'number',
                                name: 'monto',
                                label: 'Monto',
                                },
                                {
                                type: 'number',
                                name: 'total_pesos',
                                label: 'Subtotal ($)',
                                },                    
                            ]}
                            cleanedField={{
                                cuenta: '',
                                detalle: '',
                                fecha_vencimiento: moment().format('YYYY-MM-DD'),
                                monto: 0,
                            }}
                        />
                    </Portlet>
                }

                
            {step >= 3 && comprobante.receipt.receipt_type && comprobante.fecha_operacion && <Portlet 
                title="Observaciones"
                handler="descripcion"
                color={step > 3 ? "bg-light" : ""}
                >
                <div className="row">
                    <div className="col-md-12">
                    
                    <textarea 
                        type="text" 
                        id='descripcion' 
                        name="descripcion" 
                        disabled={onlyRead}
                        className="form-control" 
                        placeholder="Agregá un descripción"
                        value={comprobante.descripcion || ''}
                        onChange={(e) => setComprobante({...comprobante, descripcion: e.target.value})}
                    />
                    </div>            
                </div>
                
                {tipoComprobante && tipoComprobante.receipt_number === "manual" && <div className="row my-3">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text rounded-end-0" id="basic-addon1"><i className="bi-link-45deg" /></span>
                    </div>
                    <input 
                        type="text" 
                        id="link" 
                        name="link" 
                        className="form-control" 
                        placeholder="Agregá el link al documento" 
                        value={comprobante.link || ''}
                        onChange={(e) => setComprobante({...comprobante, link: e.target.value})}
                    />
                    </div>
                </div>}
            </Portlet>}

                </div>}

            <div className="panel-footer mt-3">
                <div className="row">
                    <div className="col-sm-6">
                        <a onClick={onClose} className="btn btn-outline-danger btn-block">Cancelar</a>
                    </div>
                    <div className="col-sm-6 text-end">
                    {comprobante.pdf && <button onClick={showPDF} target="_blank" className="btn btn-bordered btn-warning btn-block mx-1">Imprimir</button>}
                    {comprobante.link && <a href={comprobante.link} target="_blank" className="btn btn-bordered btn-warning btn-block mx-1">Ver</a>}
                    {comprobante.destinatario && comprobante.receipt.receipt_type && step < 3 && <button onClick={changeStep} disabled={!comprobante.receipt.receipt_type} className="btn btn-bordered btn-block mx-1 btn-primary">Siguiente</button>}           
                    {!onlyRead && step === 3 && <button disabled={!canSend} onClick={handleSubmit} type="submit" className="btn btn-bordered btn-block mx-1 btn-primary">Guardar</button>}
                    </div>
                </div>
            </div>
        </form>
    );
};
