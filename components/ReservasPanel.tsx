'use client';

import { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';

import {
  ReservaDTO,
  getReservas,
  getReservaById,
  editarReserva,
  cancelarReserva,
} from '@/providers/reservationProvider';

export default function ReservasPanel() {
  const [reservas, setReservas] = useState<ReservaDTO[]>([]);
  const [reservaModalOpen, setReservaModalOpen] = useState(false);
  const [reservaEditar, setReservaEditar] = useState<any>(null);
  const [editarModalOpen, setEditarModalOpen] = useState(false);

  const cargarReservas = async () => {
    try {
      const data = await getReservas();
      setReservas(data);
    } catch {
      setReservas([]);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const abrirEdicion = async (id: number) => {
    const data = await getReservaById(id);
    setReservaEditar({
      id: data.id,
      vehicle: data.vehicle,
      spot: data.spot,
      startTime: data.startTime.slice(0, 16),
      endTime: data.endTime.slice(0, 16),
    });
    setEditarModalOpen(true);
  };

  const guardarCambios = async () => {
    await editarReserva(reservaEditar.id, {
      idVehiculo: reservaEditar.vehicle.id,
      idSpot: reservaEditar.spot.id,
      startTime: reservaEditar.startTime,
      endTime: reservaEditar.endTime,
    });
    setEditarModalOpen(false);
    setReservaModalOpen(false);
    await cargarReservas();
  };

  const cancelar = async (id: number) => {
    await cancelarReserva(id);
    await cargarReservas();
  };

  return (
    <>
      <Button
        className="mt-10"
        color="primary"
        isDisabled={reservas.length === 0}
        onPress={() => setReservaModalOpen(true)}
      >
        Abrir reservas
      </Button>

      {/* Modal de lista de reservas */}
      <Modal isOpen={reservaModalOpen} onOpenChange={setReservaModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Reservas activas</ModalHeader>
              <ModalBody>
                {reservas.map((reserva) => (
                  <div
                    key={reserva.idReserva}
                    className="flex justify-between items-center p-2 border-b"
                  >
                    <div>
                      <p className="font-semibold">
                        {reserva.marcaVehiculo} ({reserva.placaVehiculo}) - Plaza{' '}
                        {reserva.codigoPlaza}
                      </p>
                      <p className="text-sm text-default-500">
                        {new Date(reserva.inicio).toLocaleString()} →{' '}
                        {new Date(reserva.fin).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onPress={() => abrirEdicion(reserva.idReserva)}>
                        ✏️
                      </Button>
                      <Button size="sm" color="danger" onPress={() => cancelar(reserva.idReserva)}>
                        ❌
                      </Button>
                    </div>
                  </div>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal para editar */}
      <Modal isOpen={editarModalOpen} onOpenChange={setEditarModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Editar reserva</ModalHeader>
              <ModalBody>
                <Input
                  label="Inicio"
                  type="datetime-local"
                  value={reservaEditar?.startTime || ''}
                  onChange={(e) =>
                    setReservaEditar({ ...reservaEditar, startTime: e.target.value })
                  }
                />
                <Input
                  label="Fin"
                  type="datetime-local"
                  value={reservaEditar?.endTime || ''}
                  onChange={(e) => setReservaEditar({ ...reservaEditar, endTime: e.target.value })}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={guardarCambios}>
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
