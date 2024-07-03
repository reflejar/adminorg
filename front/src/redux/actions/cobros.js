import { Service } from '@/redux/services/general';

const apiEndpoint = 'operative/comprobantes/cliente/54/';

const send = (payload) => async () => {
  const response = await Service.post(apiEndpoint, payload);

  return response.data;
};

export const cobrosActions = {
  send
};

