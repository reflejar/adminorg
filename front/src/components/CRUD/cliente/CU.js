'use client'
import React, { useState, useEffect } from 'react';
import { Row, FormGroup, Label, Button } from 'reactstrap';
import { Formik, Field, Form } from "formik";
import * as Yup from 'yup';
import { ClipLoader } from 'react-spinners';
import get from 'lodash/get';
import { useDispatch } from 'react-redux';

import { clientesActions } from '@/redux/actions/clientes';
import Spinner from '@/components/spinner';
import { provincias } from '@/utility/options/provincias';
import { tipo_documentos } from '@/utility/options/documentos';
import { useTitulos } from '@/utility/hooks';

const empty = 'Campo requerido';

const CU = ({ selected, onClose }) => {
  const dispatch = useDispatch();
  const [titulos, loadingTitulos] = useTitulos();
  const [tituloPred, setTituloPred] = useState();

  useEffect(() => {
    setTituloPred(titulos.find(titulo => titulo.predeterminado === "cliente"))
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
        nombre: get(selected, 'perfil.nombre', ''),
        razon_social: get(selected, 'perfil.razon_social', '') || '',
        tipo_documento: get(selected, 'perfil.tipo_documento', ''),
        numero_documento: get(selected, 'perfil.numero_documento', ''),
        es_extranjero: get(selected, 'perfil.es_extranjero', false),
        mail: get(selected, 'perfil.mail', ''),
        telefono: get(selected, 'perfil.telefono', ''),
        domicilio_provincia: get(selected, 'perfil.domicilio.provincia', null),
        domicilio_localidad: get(selected, 'perfil.domicilio.localidad', ''),
        domicilio_calle: get(selected, 'perfil.domicilio.calle', ''),
        domicilio_numero: get(selected, 'perfil.domicilio.numero', ''),
        titulo: get(selected, 'titulo', tituloPred.id),
      }}
      validationSchema={Yup.object().shape({
        nombre: Yup.string().required(empty),
        razon_social: Yup.string(),
        tipo_documento: Yup.string().required(empty),
        numero_documento: Yup.number().required(empty),
        es_extranjero: Yup.boolean(),
        mail: Yup.string().email("Email invalido").nullable(),
        telefono: Yup.string(),
        domicilio_provincia: Yup.string().nullable(),
        domicilio_localidad: Yup.string(),
        domicilio_calle: Yup.string(),
        domicilio_numero: Yup.string(),
        titulo: Yup.number().required(empty),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setSubmitting(true);
          await dispatch(clientesActions.send({ 
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
              <h4>Datos del cliente</h4>
              <FormGroup className='col-sm-4 px-3'>
                <Label for="nombre">Nombre<span className='text-danger'>*</span></Label>
                <Field name="nombre" id="nombre" className={`form-control ${errors.nombre && touched.nombre && 'is-invalid'}`} />
                {errors.nombre && touched.nombre ? <div className="invalid-feedback">{errors.nombre}</div> : null}
              </FormGroup>
              <FormGroup className='col-sm-4 px-3'>
                <Label for="razon_social">Razón Social</Label>
                <Field name="razon_social" id="razon_social" className={`form-control ${errors.razon_social && touched.razon_social && 'is-invalid'}`} />
                {errors.razon_social && touched.razon_social ? <div className="invalid-feedback">{errors.razon_social}</div> : null}
              </FormGroup>
              <FormGroup className='col-sm-4 px-3'>
                <Label for="tipo_documento">Tipo de documento<span className='text-danger'>*</span></Label>
                <Field component="select" name="tipo_documento" id="tipo_documento" className={`form-control ${errors.tipo_documento && touched.tipo_documento && 'is-invalid'}`}>
                  <option defaultValue={null}>---</option>
                  {tipo_documentos.map((documento, i) => (
                    <option key={i} value={documento}>{documento}</option>
                  ))}
                </Field>
                {errors.tipo_documento && touched.tipo_documento ? <div className="invalid-feedback">{errors.tipo_documento}</div> : null}
              </FormGroup>
              <FormGroup className='col-sm-4 px-3'>
                <Label for="numero_documento">Numero de documento<span className='text-danger'>*</span></Label>
                <Field type="number" step="1" name="numero_documento" id="numero_documento" className={`form-control ${errors.numero_documento && touched.numero_documento && 'is-invalid'}`} />
                {errors.numero_documento && touched.numero_documento ? <div className="invalid-feedback">{errors.numero_documento}</div> : null}
              </FormGroup>

              <FormGroup className='col-sm-4 px-3'>
                <Label for="mail">Dirección de email</Label>
                <Field name="mail" type="email" id="mail" className={`form-control ${errors.mail && touched.mail && 'is-invalid'}`} />
                {errors.mail && touched.mail ? <div className="invalid-feedback">{errors.mail}</div> : null}
              </FormGroup>

              <FormGroup className='col-sm-4 px-3'>
                <Label for="telefono">Teléfono</Label>
                <Field name="telefono" id="telefono" className={`form-control ${errors.telefono && touched.telefono && 'is-invalid'}`} />
                {errors.telefono && touched.telefono ? <div className="invalid-feedback">{errors.telefono}</div> : null}
              </FormGroup>
              <FormGroup className='col-sm-4 px-3'>
                <Label for="domicilio_provincia">Provincia</Label>
                <Field component="select" name="domicilio_provincia" id="domicilio_provincia" className={`form-control ${errors.domicilio_provincia && touched.domicilio_provincia && 'is-invalid'}`}>
                  {provincias.map((provincia, i) => {
                    return <option key={i} value={provincia.id}>{provincia.nombre}</option>
                  })}
                </Field>
                {errors.domicilio_provincia && touched.domicilio_provincia ? <div className="invalid-feedback">{errors.domicilio_provincia}</div> : null}
              </FormGroup>
              <FormGroup className='col-sm-4 px-3'>
                <Label for="domicilio_localidad">Localidad</Label>
                <Field name="domicilio_localidad" id="domicilio_localidad" className={`form-control ${errors.domicilio_localidad && touched.domicilio_localidad && 'is-invalid'}`} />
                {errors.domicilio_localidad && touched.domicilio_localidad ? <div className="invalid-feedback">{errors.domicilio_localidad}</div> : null}
              </FormGroup>
              <FormGroup className='col-sm-4 px-3'>
                <Label for="domicilio_calle">Calle</Label>
                <Field name="domicilio_calle" id="domicilio_calle" className={`form-control ${errors.domicilio_calle && touched.domicilio_calle && 'is-invalid'}`} />
                {errors.domicilio_calle && touched.domicilio_calle ? <div className="invalid-feedback">{errors.domicilio_calle}</div> : null}
              </FormGroup>
              <FormGroup className='col-sm-4 px-3'>
                <Label for="domicilio_numero">Numero</Label>
                <Field name="domicilio_numero" id="domicilio_numero" className={`form-control ${errors.domicilio_numero && touched.domicilio_numero && 'is-invalid'}`} />
                {errors.domicilio_numero && touched.domicilio_numero ? <div className="invalid-feedback">{errors.domicilio_numero}</div> : null}
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
