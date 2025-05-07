import { toast } from 'react-toastify';

type ReservationPayload = {
  idVehiculo: number;
  idSpot: number;
  startTime: string;
  endTime: string;
};

export type ReservationResponse = {
  mensaje: string;
  status: number;
  ruta: string;
  fecha: string;
  data: any;
};

export const createReservation = async (
  payload: ReservationPayload
): Promise<ReservationResponse> => {
  const res = await fetch('http://127.0.0.1:8080/api/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (res.ok) {
    toast.success(data.mensaje || "✅ Reserva creada con éxito");
  } else {
    toast.error(data.mensaje || "❌ Error al crear reserva");
  }

  return { ...data, status: res.status };
};

export type ReservaDTO = {
  idReserva: number;
  placaVehiculo: string;
  marcaVehiculo: string;
  codigoPlaza: string;
  inicio: string;
  fin: string;
};

export const getReservas = async (): Promise<ReservaDTO[]> => {
  const res = await fetch('http://127.0.0.1:8080/api/reservations');
  if (!res.ok) {
    toast.error("❌ Error al obtener las reservas");
    throw new Error('Error al obtener reservas');
  }
  return await res.json();
};

export const getReservaById = async (id: number) => {
  const res = await fetch(`http://127.0.0.1:8080/api/reservations/${id}`);
  const data = await res.json();

  if (!res.ok) {
    toast.error(data.mensaje || "❌ Error al obtener la reserva");
  }

  return data;
};

export const editarReserva = async (id: number, payload: any) => {
  const res = await fetch(`http://127.0.0.1:8080/api/reservations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (res.ok) {
    toast.success(data.mensaje || "✅ Reserva editada correctamente");
  } else {
    toast.error(data.mensaje || "❌ No se pudo editar la reserva");
  }

  return data;
};

export const cancelarReserva = async (id: number) => {
  const res = await fetch(`http://127.0.0.1:8080/api/reservations/${id}/cancelar`, {
    method: 'PUT',
  });

  const data = await res.json();

  if (res.ok) {
    toast.success(data.mensaje || "✅ Reserva cancelada");
  } else {
    toast.error(data.mensaje || "❌ No se pudo cancelar la reserva");
  }

  return data;
};
