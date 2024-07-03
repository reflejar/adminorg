'use client'
import React, { useMemo, useState, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Spinner from '@/components/spinner';
import { comprobantesActions } from '@/redux/actions/comprobantes';
import { usePuntosDeVenta } from '@/utility/hooks';
import Listado from '@/components/listados';
import CHOICES from '@/components/CRUD/comprobante/components/choices'

const initialFields = {
  receipt_type: '',
  point: '',
  numero: '',
  startDate: '',
  endDate: '',
};

const headers = [
  { label: 'Fecha', key: 'receipt.issued_date' },
  { label: 'Comprobante', key: 'nombre' },
  { label: 'Portador', key: 'destinatario' },
  { label: 'Total', key: 'receipt.total_amount' },
];

const LStep = ({ causante }) => {
  const comprobantesTypes = CHOICES.receiptTypes[causante]
  const dispatch = useDispatch();
  const [table, setTable] = useState(false);
  const [fields, setFields] = useState(initialFields);
  const [puntos] = usePuntosDeVenta();
  const [loading, setLoading] = useState(false);
  const [comprobantes, setComprobantes] = useState([]);
  const ref = useRef(null);


  

  const dataForTable = useMemo(() => {
    if (table) {
      if (comprobantes && !comprobantes.length) {
        return [];
      }
      return comprobantes;
    }
  }, [table, comprobantes]);

  const handleSearch = useCallback(async (event) => {
    event.preventDefault();
    setLoading(true);

    const response = await dispatch(comprobantesActions.getList(causante, fields))
    .then((response) => {
      setComprobantes(response);
      setTable(true);
    })
    .finally(() => setLoading(false));;

    if (!response || !Array.isArray(response.results) || response.results.length === 0) {
      return;
    }

    ;
  }, [dispatch, causante, fields]);

  const handleChange = (key) => {
    return (event) => {
      const value = event.target.value;

      setFields(old => ({
        ...old,
        [key]: value
      }))
    }
  };

  if (loading) {
    return (
      <div className='loading-modal'>
        <Spinner />
      </div>
    )
  }

  if (!table) {
    return (
      <form className="row" onSubmit={handleSearch}>
        <div className='col-sm-4 px-3 my-2'>
          <label className='form-label'>Tipo de comprobante</label>
          <select type="select" name="select" className='form-select' onChange={handleChange('receipt_type')}>
            <option value=''>---</option>
            {comprobantesTypes.filter(d => d.value !== "---").map((type, i) => (
              <option key={i} value={type.value}>{type.value}</option>
            ))}
          </select>
        </div>  

        <div className='col-sm-4 px-3 my-2'>
          <label className='form-label'>Punto de venta</label>

          <select type="select" name="select" className='form-select' onChange={handleChange('point')}>
            <option value=''>---</option>
            {puntos.map((punto, i) => (
              <option key={i} value={punto.number}>{punto.number}</option>
            ))}
          </select>
        </div>

        <div className='col-sm-4 px-3 my-2'>
          <label className='form-label'>Numero de comprobante</label>
          <input
            value={fields.numero}
            className='form-control'
            placeholder="#12345"
            label="Numero de comprobante"
            onChange={handleChange('numero')} />
        </div>

        <div className='col-sm-4 px-3 my-2'>
          <label className='form-label'>Desde</label>
          <input
            type="date"
            className='form-control'
            name="start_date"
            placeholder="Fecha desde"
            onChange={handleChange('startDate')}
          />
        </div>

        <div className='col-sm-4 px-3 my-2'>
          <label className='form-label'>Hasta</label>
          <input
            type="date"
            name="end_date"
            className='form-control'
            placeholder="Fecha hasta"
            onChange={handleChange('endDate')}
          />
        </div>
        <div className="text-end">
          <button type="submit" className='btn btn-primary mb-2'>Buscar</button>
        </div>
      </form>
    );
  }

  return <Listado columns={headers} items={dataForTable} />;
};

export default LStep;
