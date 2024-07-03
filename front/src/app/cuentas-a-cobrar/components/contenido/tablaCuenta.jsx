'use client'
import React, { useState } from 'react';
import { useMovimientos } from '@/utility/hooks';
import Spinner from '@/components/spinner';
import Listado from '@/components/listados';


import BasicModal from '@/components/modal';
import Comprobante from '@/components/CRUD/comprobante/CU';


export default function (props) {
  const { selected } = props;
  const [movimientos, loadingMovimientos] = useMovimientos(selected);
  const [modal, setModal] = useState({
            open: false,
            item: null
        });
  
  const handleModal = (rowInfo) => {
    setModal({
        open: !modal.open,
        item: rowInfo
    });
  };        

  const columns =[{
      label: 'Fecha',
      key: 'fecha'
    }, {
      label: 'Comprobante',
      key: 'comprobante',
      onClick: handleModal
    }, {
      label: 'Tipo',
      key: 'concepto',
    }, {
      label: 'Proyecto',
      key: 'proyecto',
    }, {      
      label: 'Moneda',
      key: 'moneda',
    }, {            
      label: 'Base',
      key: 'valor',
    }, {    
      label: 'TC',
      key: 'tipo_cambio',
    }, {            
      label: 'Monto',
      key: 'monto',
    }, {
      label: 'Saldo',
      key: 'saldo',
    }];  



  const renderModal = () => {
    if (modal.item && modal.item.comprobante) {
      return (
          <BasicModal
            open={modal.open}
            onToggle={handleModal}
            header={`${modal.item.comprobante} - ${selected.full_name}`}
            footer={false}
            component={<Comprobante 
                moduleHandler={'cliente'}
                destinatario={selected}
                comprobanteId={modal.item.comprobante__id}
                onClose={handleModal}
              />}
            
          />          
        )
    } 
  }

  if (loadingMovimientos) return <Spinner />

  return (<>
    {modal && modal.item && renderModal()}
    <Listado items={movimientos} columns={columns} />
    </>
    );
};



