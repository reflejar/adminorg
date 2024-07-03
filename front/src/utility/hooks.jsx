'use client'
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { clientesActions } from '@/redux/actions/clientes';
import { proveedoresActions } from '@/redux/actions/proveedores';
import { puntosActions } from '@/redux/actions/puntos';
import { saldosActions } from '@/redux/actions/saldos';
import { movimientosActions } from '@/redux/actions/movimientos';
import { titulosActions } from '@/redux/actions/titulos';
import { ingresosActions } from '@/redux/actions/ingresos';
import { gastosActions } from '@/redux/actions/gastos';
import { cajasActions } from '@/redux/actions/cajas';
import { proyectosActions } from '@/redux/actions/proyectos';

// Parametros
export const useClientes = () => {
  const [loading, setLoading] = useState(false);
  const clientes = useSelector((state) => state.clientes.list);
  const dispatch = useDispatch();
  
  useEffect(() => {
    async function fetch() {
      setLoading(true);
      await dispatch(clientesActions.get_all())
        .finally(() => setLoading(false));
    }
    if (clientes.length === 0) {
      fetch();
    }
  }, []);

  return [clientes, loading];
};

export const useProveedores = () => {
  const [loading, setLoading] = useState(false);
  const proveedores = useSelector((state) => state.proveedores.list);
  const dispatch = useDispatch();
  
  useEffect(() => {
    async function fetch() {
      setLoading(true);
      await dispatch(proveedoresActions.get_all())
        .finally(() => setLoading(false));
    }
    if (proveedores.length === 0) {
      fetch();
    }
  }, []);

  return [proveedores, loading];
};
export const usePuntosDeVenta = () => {
  const [loading, setLoading] = useState(false);
  const puntos = useSelector((state) => state.puntos.list.results || []);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      await dispatch(puntosActions.get_all())
        .finally(() => setLoading(false));
    }
    if (puntos.length === 0) {
      fetch();
    }
  }, []);

  return [puntos, loading];
};

export const useTitulos = (supertitulos=false) => {
  const [loading, setLoading] = useState(false);
  const titulos = useSelector((state) => state.titulos.list);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      await dispatch(titulosActions.get_all())
        .finally(() => setLoading(false));
    }
    if (titulos.length === 0) {
      fetch();
    }
  }, []);

  return [titulos, loading];
};

export const useIngresos = () => {
  const [loading, setLoading] = useState(false);
  const ingresos = useSelector((state) => state.ingresos.list);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      await dispatch(ingresosActions.get_all())
        .finally(() => setLoading(false));
    }
    if (ingresos.length === 0) {
      fetch();
    }
  }, []);

  return [ingresos, loading];
};

export const useGastos = () => {
  const [loading, setLoading] = useState(false);
  const gastos = useSelector((state) => state.gastos.list);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      await dispatch(gastosActions.get_all())
        .finally(() => setLoading(false));
    }
    if (gastos.length === 0) {
      fetch();
    }
  }, []);

  return [gastos, loading];
};


export const useCajas = () => {
  const [loading, setLoading] = useState(false);
  const cajas = useSelector((state) => state.cajas.list);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      await dispatch(cajasActions.get_all())
        .finally(() => setLoading(false));
    }
    if (cajas.length === 0) {
      fetch();
    }
  }, []);

  return [cajas, loading];
};

export const useProyectos = () => {
  const [loading, setLoading] = useState(false);
  const proyectos = useSelector((state) => state.proyectos.list);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      await dispatch(proyectosActions.get_all())
        .finally(() => setLoading(false));
    }
    if (proyectos.length === 0) {
      fetch();
    }
  }, []);

  return [proyectos, loading];
};

// Otros
export const useSaldos = (selected, date) => {
  const [loading, setLoading] = useState(false);
  const [saldos, setSaldos] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selected) {
      setLoading(true);
      dispatch(saldosActions.get({ destinatario: selected.id, fecha: moment(date).format('YYYY-MM-DD') }))
        .then((response) => setSaldos(response.data))
        .finally(() => setLoading(false));
    }
  }, [selected]);

  return [saldos, loading];
};



export const useMovimientos = (selected) => {
  const [loading, setLoading] = useState(false);
  const movimientos = useSelector(state => state.movimientos.list);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selected) {
      setLoading(true);
      const esTitulo = selected.hasOwnProperty("supertitulo");
      let query = { destinatario: selected.id, fecha: moment().format('YYYY-MM-DD'), save:true }
      if (esTitulo) {query = {...query, titulo:1};}
      dispatch(movimientosActions.get(query)).finally(() => setLoading(false));
    }
  }, [selected.id]);

  return [movimientos, loading];
};
