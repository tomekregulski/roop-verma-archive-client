import { api } from './client';

interface SupportMessage {
  name: string;
  email: string;
  message: string;
}

/** Submit to the fixed backend support destination and require explicit acceptance. */
export async function sendSupportMessage(message: SupportMessage) {
  const { data } = await api.post<{ accepted: boolean }>('/support', message);
  if (data?.accepted !== true) throw Error('Support acceptance was not confirmed');
}
