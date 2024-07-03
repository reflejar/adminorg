'use client'
import React, { useMemo, useRef } from 'react';
import { CSVLink } from 'react-csv';
import { get } from 'lodash';
import ReactToPrint from 'react-to-print';
import {Numero} from "@/utility/formats";

const Listado = ({ items, columns, topRight }) => {
    const ref = useRef(null);

    const dataForTable = useMemo(() => {
        if (items && !items.length) {
        return [];
        }
        return items;
    }, [items]);

    return (
        <div>
            <div className="d-flex justify-content-between">
                <div>
                    <ReactToPrint
                        trigger={() => <button className='btn btn-sm bi-printer btn-outline-secondary me-2'/>}
                        content={() => ref.current}
                    />

                    <CSVLink
                    target="_blank"
                    filename="listado.csv"
                    headers={columns}          
                    data={dataForTable}>
                        <button className='btn btn-sm btn-outline-success bi-filetype-csv' />
                    </CSVLink>
                </div>
            
                    {topRight && <div className="btn-toolbar">{topRight}</div>}
                
            </div>



            <table className='mt-3 table table-responsive table-sm table-striped' ref={ref}>
                <thead>
                <tr>
                    {columns.map(t => (
                        <th key={t.key} className={`${items.length > 0 && (typeof items[0][t.key] === "number") && "text-end"} small`}>
                            {t.label}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            {columns.map((te, k) => {
                                const value = get(item, te.key, null)
                                return <td 
                                        className={`${te.onClick !== undefined && "pointer link-primary text-primary"} ${typeof value === "number" && "text-end"} small`} 
                                        key={k}
                                        onClick={() => {te.onClick !== undefined && te.onClick(item)}}
                                        >
                                            {te.key === "" ? <i className='bi-pencil' />: typeof value === "number" ? Numero(value) : value}
                                        </td>
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};



export default Listado
  