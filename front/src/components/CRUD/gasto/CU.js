'use client'
import React, { useState, useEffect } from 'react';
import { Row, Col, FormGroup, Label, Button } from 'reactstrap';
import { Formik, Field, Form } from "formik";
import * as Yup from 'yup';
import { ClipLoader } from 'react-spinners';
import get from 'lodash/get';
import { useDispatch } from 'react-redux';
import { gastosActions } from '@/redux/actions/gastos';

import Spinner from '@/components/spinner';
import { useTitulos } from '@/utility/hooks';

const empty = 'Campo requerido';

const CU = ({ selected, onClose }) => {
  const dispatch = useDispatch();

  const [titulos, loadingTitulos] = useTitulos();
  const [tituloPred, setTituloPred] = useState();

  useEffect(() => {
    setTituloPred(titulos.find(titulo => titulo.predeterminado === "gastos"))
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
        titulo: get(selected, 'titulo', tituloPred.id),
      }}
      validationSchema={Yup.object().shape({
        nombre: Yup.string().required(empty),
        titulo: Yup.number().required(empty),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setSubmitting(true);
          await dispatch(gastosActions.send({ 
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
      {({ errors, touched, setFieldValue, handleSubmit, isSubmitting, values }) => (
        <Form onSubmit={handleSubmit}>
          <Row>
              <h4>Datos del Gasto</h4>
              <FormGroup className='col-sm-4 px-3'>
                <Label for="nombre">Nombre<span className='text-danger'>*</span></Label>
                <Field name="nombre" id="nombre" className={`form-control ${errors.nombre && touched.nombre && 'is-invalid'}`} />
                {errors.nombre && touched.nombre ? <div className="invalid-feedback">{errors.nombre}</div> : null}
              </FormGroup>
              <FormGroup className='col-sm-4 px-3'>
                <Label for="titulo">Cuenta Contable<span className='text-danger'>*</span></Label>
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
