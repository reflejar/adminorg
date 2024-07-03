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
      label: 'Debe',
      key: 'debe',
    }, {
      label: 'Haber',
      key: 'haber',
    }, {      
      label: 'Saldo',
      key: 'saldo',
    }];  



  const renderModal = () => {
    if (modal.item && modal.item.receipt) {
      const { receipt } = modal.item
      return (
          <BasicModal
            open={modal.open}
            onToggle={handleModal}
            header={`${receipt.receipt_type} - ${receipt.formatted_number}`}
            footer={false}
            component={<Comprobante 
                moduleHandler={'titulo'} 
                destinatario={selected}
                comprobanteId={modal.item.id}
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



