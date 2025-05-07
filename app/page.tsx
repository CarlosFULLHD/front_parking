'use client';

import { useEffect, useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalContent,
  useDisclosure,
} from '@heroui/modal';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Card, CardHeader, CardBody } from '@heroui/card';
import Image from 'next/image';

import { ParkingSpot, getAllParkingSpots } from '@/providers/parkingSpotProvider';
import { createReservation } from '@/providers/reservationProvider';

import { Select, SelectItem } from '@heroui/select';
import { Vehicle, getAllVehicles } from '@/providers/vehicleProvider';
import ReservasPanel from '@/components/ReservasPanel';

const getColor = (available: number) => {
  switch (available) {
    case 1:
      return 'bg-green-500';
    case 2:
      return 'bg-yellow-500';
    case 3:
      return 'bg-red-500';
    default:
      return 'bg-gray-300';
  }
};

export default function Home() {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [vehicleId, setVehicleId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);

  useEffect(() => {
    fetchSpots();

    getAllVehicles()
      .then(setVehicles)
      .catch((err) => console.error('Error al cargar vehículos:', err));
  }, []);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchSpots = async () => {
    try {
      const data = await getAllParkingSpots();
      setSpots(data);
    } catch (error) {
      console.error('Error al obtener los espacios:', error);
    }
  };

  useEffect(() => {
    fetchSpots();
  }, []);

  const handleCardClick = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
    setMensaje('');
    onOpen();
  };

  const handleReserva = async (onClose: () => void) => {
    if (!selectedSpot) return;

    const payload = {
      idVehiculo: selectedVehicleId!,
      idSpot: selectedSpot.id,
      startTime,
      endTime,
    };

    try {
      const response = await createReservation(payload);
      setMensaje(response.mensaje);

      if (response.status === 200) {
        onClose(); // cerrar modal
        await fetchSpots(); // actualizar
      }
    } catch (error) {
      console.error('Error al reservar:', error);
      setMensaje('Error al enviar la reserva');
    }
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <h1 className="text-3xl font-bold">Plazas de estacionamiento</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {spots.map((spot) => (
          <div key={spot.id} onClick={() => handleCardClick(spot)} className="cursor-pointer">
            <Card className={`w-[200px] h-[220px] text-white ${getColor(spot.available)}`}>
              <CardHeader className="text-center text-lg font-semibold">{spot.code}</CardHeader>
              <CardBody className="flex items-center justify-center">
                <Image alt={`Spot ${spot.code}`} height={80} src="/car1.png" width={80} />
              </CardBody>
            </Card>
          </div>
        ))}
      </div>

      {/* Modal dinámico */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Espacio: {selectedSpot?.code}</ModalHeader>
              <ModalBody>
                {selectedSpot?.available === 1 ? (
                  <>
                    <Select
                      className="max-w-md"
                      items={vehicles}
                      label="Selecciona un vehículo"
                      labelPlacement="outside-left"
                      placeholder="Selecciona un vehículo"
                      variant="flat"
                      selectedKeys={
                        selectedVehicleId ? new Set([selectedVehicleId.toString()]) : new Set([])
                      }
                      onSelectionChange={(keys) => {
                        const id = Array.from(keys)[0];
                        setSelectedVehicleId(parseInt(id));
                      }}
                    >
                      {(item) => (
                        <SelectItem key={item.id} textValue={`${item.brand} - ${item.plate}`}>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{item.brand}</span>
                            <span className="text-xs text-default-500">{item.plate}</span>
                          </div>
                        </SelectItem>
                      )}
                    </Select>

                    <Input
                      label="Hora inicio"
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      labelPlacement={'outside-left'}
                    />
                    <Input
                      label="Hora fin"
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      labelPlacement={'outside-left'}
                    />
                    {mensaje && <p className="text-sm mt-2">{mensaje}</p>}
                  </>
                ) : (
                  <p>
                    Este espacio está {selectedSpot?.available === 2 ? 'reservado' : 'ocupado'}.
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                {selectedSpot?.available === 1 && (
                  <Button color="primary" onPress={() => handleReserva(onClose)}>
                    Reservar
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ReservasPanel />
    </section>
  );
}
