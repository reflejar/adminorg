'use client'
import React, { useState } from 'react';
import * as Yup from 'yup';
import csvtojson from 'csvtojson';
import { CSVLink } from "react-csv";
import { useDispatch } from 'react-redux';

// Components
import { ImportFileDropzone } from '@/components/ImportFileDropzone';

// Styles
import { Table } from 'reactstrap';
import { proyectosActions } from '@/redux/actions/proyectos';

const csvValidations = Yup.object({
  nombre: Yup
    .string('Nombre debe ser un texto valido')
    .required('Nombre es requerido'),

});

const tableHeaders = ['Nombre'];

const M = ({ onClose }) => {
  const [csvError, setCSVError] = useState([]);
  const [newProyectos, setNewProyectos] = useState([]);
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();

    const mappedNewProyectos = newProyectos.map((x) => ({
        ...x,

      }));

    dispatch(proyectosActions.send_bulk(mappedNewProyectos))
      .then(onClose);
  }

  const handleDrop = (files) => {
    // Cleaning previous errors
    setCSVError([]);

    const reader = new FileReader();

    reader.readAsText(files[0]);

    reader.onloadend = async (event) => {
      const csvArr = await csvtojson().fromString(event.target.result)
        .then((arr) => {
          // Mapping keys to lowercase
          return arr.map((row) => {
            const keys = Object.keys(row);

            return keys.reduce((acc, key) => {
              const loweredKey = key.toLowerCase();
              let value = row[key];

              return { ...acc, [loweredKey]: value };
            }, {});

          })
        });

      let errors = [];

      (await Promise.all(csvArr.map((row) => csvValidations.validate(row).catch((err) => err))))
        .find((val, index) => {
          if (val && val.errors && val.errors.length && val.message) {
            const error = val.message;
            const errorRowLine = index + 1;
            const message = `Linea ${errorRowLine}: ` + error;
            errors.push(message)
            return true;
          }
          return false;
        });



      if (errors.length > 0) {
        setCSVError([...errors]);
        return;
      } else {
        setNewProyectos(csvArr);
      }
    };
  }

  return (
    <>
      <form onSubmit={handleSubmit}>

        {(newProyectos.length) > 0 && (
          <Table responsive>
            <thead>
              <tr>
                {tableHeaders.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[...newProyectos].map((row, index) => {

                return (
                  <tr className={row.id ? "" : "warning"} key={index}>
                    <td>{row.nombre}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        )}

        <ul>
          {csvError.length > 0 && csvError.map(error => (
              <li className="danger">{error} </li>
          ))}
        </ul>

          <div className="ImportFileDropzone__container">
            <ImportFileDropzone onDrop={handleDrop} />
          </div>
          <p>
            Necesitas un archivo modelo? podes hacer <CSVLink filename={"importador-proyectos.csv"} data={[tableHeaders]}>click aqui</CSVLink>
          </p>   

        <div className='row'>
          <div className='col-12 text-right'>
            <button type='button' className='btn btn-secondary mr-2' onClick={onClose}>
              Cancelar
            </button>

            <button
              type='submit'
              className='btn btn-primary'
              disabled={newProyectos.length === 0}
            >
              Guardar
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default M;