const receiptTypes = {
    cliente: [
        {value: 'Factura C', receipt_number: "auto" },
        {value: "Nota de Debito C", receipt_number: "auto" },
        {value: 'Nota de Credito C', receipt_number: "auto" },
        {value: 'Factura X', receipt_number: "auto" },
        {value: "Nota de Debito X", receipt_number: "auto" },
        {value: 'Nota de Credito X', receipt_number: "auto" },
        {value: 'Recibo C', receipt_number: "auto" },
        {value: 'Recibo X', receipt_number: "auto" },
    ],
    proveedor: [
        {value: "Factura A", receipt_number: "manual"},
        {value: "Nota de Debito A", receipt_number: "manual"},
        {value: "Nota de Credito A", receipt_number: "manual" },
        {value: "Factura B", receipt_number: "manual"},
        {value: "Nota de Debito B", receipt_number: "manual"},
        {value: "Nota de Credito B", receipt_number: "manual" },
        {value: "Factura C", receipt_number: "manual"},
        {value: "Nota de Debito C", receipt_number: "manual"},
        {value: "Nota de Credito C", receipt_number: "manual" },
        {value: "Factura X", receipt_number: "manual"},
        {value: "Nota de Debito X", receipt_number: "manual"},
        {value: "Nota de Credito X", receipt_number: "manual" },
        {value: "Liquidacion A", receipt_number: "manual"},
        {value: "Liquidacion B", receipt_number: "manual"},
        {value: "Orden de Pago X", receipt_number: "auto"},
        {value: "Recibo C", receipt_number: "manual"},
        {value: "Recibo X", receipt_number: "manual"},
    ],
    caja: [
        {value: "Transferencia X", receipt_number: "auto"},
    ],  
    titulo: [
        {value: "Asiento X", receipt_number: "auto"},
    ],        
}

export default {
    receiptTypes,
}