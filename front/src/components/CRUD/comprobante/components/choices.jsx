const receiptTypes = {
    cliente: [
        {value: 'Recibo C', receipt_number: "auto", comportamiento: "disminucion" },
        {value: 'Nota de Crédito C', receipt_number: "auto", comportamiento: "disminucion" },
        {value: 'Recibo X', receipt_number: "auto", comportamiento: "disminucion" },
        {value: 'Nota de Crédito X', receipt_number: "auto", comportamiento: "disminucion" },
        {value: 'Factura C', receipt_number: "auto", comportamiento: "aumento" },
        {value: "Nota de Débito C", receipt_number: "auto", comportamiento: "aumento" },
        {value: 'Factura X', receipt_number: "auto", comportamiento: "aumento" },
        {value: "Nota de Débito X", receipt_number: "auto", comportamiento: "aumento" },
        {value: 'Contrato', receipt_number: "auto", comportamiento: "aumento" },
        {value: 'Comprobante de Donación', receipt_number: "auto", comportamiento: "aumento" },
    
    ],
    proveedor: [
        {value: "Factura A", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Nota de Débito A", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Nota de Crédito A", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Recibo A", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Nota de Ventas al Contado A", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Factura B", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Nota de Débito B", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Nota de Crédito B", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Recibo B", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Nota de Ventas al Contado B", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Factura C", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Nota de Débito C", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Nota de Crédito C", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Recibo C", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Nota de Venta al Contado C", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Factura X", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Nota de Débito X", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Nota de Crédito X", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Recibo X", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Ticket Factura A", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Ticket Factura B", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Ticket", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Ticket factura C", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Ticket Nota de Crédito A", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Ticket Nota de Crédito B", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Ticket Nota de Crédito C", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Ticket Nota de Débito A", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Ticket Nota de Débito B", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Ticket Nota de Débito C", receipt_number: "manual", comportamiento: "aumento"},
        {value: "Orden de Pago X", receipt_number: "auto", comportamiento: "disminucion"},        
    ],
    caja: [
        {value: "Transferencia X", receipt_number: "auto", comportamiento: "aumento"}
    ],  
    titulo: [
        {value: "Asiento X", receipt_number: "auto"},
    ],        
}

export default {
    receiptTypes,
}