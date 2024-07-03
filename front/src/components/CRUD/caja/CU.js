'use client'
import React, { useState, useEffect } from 'react';
import { Row, FormGroup, Label, Button } from 'reactstrap';
import { Formik, Field, Form } from "formik";
import * as Yup from 'yup';
import { ClipLoader } from 'react-spinners';
import get from 'lodash/get';
import { useDispatch } from 'react-redux';
import { cajasActions } from '@/redux/actions/cajas';

import { cajas } from '@/utility/options/taxones';
import Spinner from '@/components/spinner';
import { useTitulos } from '@/utility/hooks';
import { monedas } from '@/utility/options/monedas';

const empty = 'Campo requerido';


const CU = ({ selected, onClose }) => {
  const dispatch = useDispatch();
  const [titulos, loadingTitulos] = useTitulos();
  const [tituloPred, setTituloPred] = useState();

  useEffect(() => {
    setTituloPred(titulos.find(titulo => titulo.predeterminado === "caja"))
  }, [titulos])

  if (loadingTitulos) {
    return (
      <div className="loading-modal">
        <br/><br/>
        <Spinner />
      </div>
    )
  }

  if(!tituloPred) {
    return (
      <div className="alert alert-warning text-center">
        Necesita configurar un título contable por defecto para este tipo de cuentas. <br /> Por favor dirijase a configuraciones - Títulos contables
      </div>
    )
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        nombre: get(selected, 'nombre', ''),
        taxon: get(selected, 'taxon', ''),
        moneda: get(selected, 'moneda', '$ARS'),
        titulo: get(selected, 'titulo', tituloPred.id),
      }}
      validationSchema={Yup.object().shape({
        nombre: Yup.string().required(empty),
        taxon: Yup.string(),
        moneda: Yup.string().required(empty),
        titulo: Yup.number().required(empty),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setSubmitting(true);
          await dispatch(cajasActions.send({ 
            ...values, 
            id: get(selected, 'id', null) 
          })).then((response) => {
            if (200 <= response.status < 300 && onClose) {
              onClose(false);
            }
          })
        } catch (error) {
          console.error(error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, touched, handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <Row>
              <h4>Datos del tesoro</h4>
              <FormGroup className='col-sm-4 px-3'>
                <Label for="nombre">Nombre<span className='text-danger'>*</span></Label>
                <Field name="nombre" id="nombre" className={`form-control ${errors.nombre && touched.nombre && 'is-invalid'}`} />
                {errors.nombre && touched.nombre ? <div className="invalid-feedback">{errors.nombre}</div> : null}
              </FormGroup>
              <FormGroup className='col-sm-4 px-3'>
                <Label for="taxon">Tipo de disponibilidad</Label>
                <Field component="select" name="taxon" id="taxon" className={`form-control ${errors.taxon && touched.taxon && 'is-invalid'}`}>
                  {cajas.map((caja, i) => {
                    return <option key={i} value={caja.id}>{caja.nombre}</option>
                  })}
                </Field>
                {errors.taxon && touched.taxon ? <div className="invalid-feedback">{errors.taxon}</div> : null}
              </FormGroup>
              <FormGroup className='col-sm-4 px-3'>
                <Label for="taxon">Moneda<span className='text-danger'>*</span></Label>
                <Field component="select" name="moneda" id="moneda" className={`form-control ${errors.moneda && touched.moneda && 'is-invalid'}`}>
                  {monedas.map((moneda, i) => {
                    return <option key={i} value={moneda.value}>{moneda.label}</option>
                  })}
                </Field>
                {errors.moneda && touched.moneda ? <div className="invalid-feedback">{errors.moneda}</div> : null}
              </FormGroup>              
              <FormGroup className='col-sm-4 px-3'>
                <Label for="titulo">Titulo contable<span className='text-danger'>*</span></Label>
                <Field value={tituloPred.id} disabled component="select" name="titulo" id="titulo" className={`form-control ${errors.titulo && touched.titulo && 'is-invalid'}`}>
                  <option value={""}> --- </option>
                  {titulos.map((titulo, i) => {
                    return <option key={i} value={titulo.id}>{titulo.nombre}</option>
                  })}
                </Field>
                {errors.titulo && touched.titulo ? <div className="invalid-feedback">{errors.titulo}</div> : null}
              </FormGroup>               

          </Row>

          <Button type="submit" color="primary" className="button-clip-loader" disabled={isSubmitting}>
            {isSubmitting && (
              <ClipLoader
                sizeUnit="px"
                size={18}
                color="#FF586B"
              />
            )}

            Guardar
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default CU;