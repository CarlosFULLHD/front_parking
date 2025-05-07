'use client';

import { useEffect, useState } from 'react';
import { title } from '@/components/primitives';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal';
import {
  ParkingSpot,
  getAllParkingSpots,
  createParkingSpot,
  updateParkingSpot,
  deleteParkingSpot,
} from '@/providers/parkingSpotProvider';

export default function AboutPage() {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [form, setForm] = useState<{ code: string; available: number }>({
    code: '',
    available: 1,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const cargar = async () => {
    const data = await getAllParkingSpots();
    setSpots(data);
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrirCrearModal = () => {
    setForm({ code: '', available: 1 });
    setEditingId(null);
    setModalOpen(true);
  };

  const abrirEditarModal = (spot: ParkingSpot) => {
    setForm({ code: spot.code, available: spot.available });
    setEditingId(spot.id);
    setModalOpen(true);
  };

  const guardar = async () => {
    if (editingId) {
      await updateParkingSpot(editingId, form);
    } else {
      await createParkingSpot(form);
    }
    setModalOpen(false);
    await cargar();
  };

  const eliminar = async (id: number) => {
    await deleteParkingSpot(id);
    await cargar();
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className={title()}>Gestión de Plazas de Estacionamiento</h1>

      <br />
      <Button color="primary" className="my-4" onPress={abrirCrearModal}>
        ➕ Crear plaza
      </Button>

      {/* Modal Crear/Editar */}
      <Modal isOpen={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{editingId ? 'Editar Plaza' : 'Crear Plaza'}</ModalHeader>
              <ModalBody>
                <Input
                  label="Código (Ej: 3A)"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                />
                <Input
                  label="Estado (1: disponible, 2: reservado, 3: ocupado)"
                  type="number"
                  min={1}
                  max={3}
                  value={form.available}
                  onChange={(e) => setForm({ ...form, available: parseInt(e.target.value) })}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={guardar}>
                  {editingId ? 'Guardar Cambios' : 'Crear'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Listado */}
      <div className="mt-6">
        {spots.map((spot) => (
          <div key={spot.id} className="flex items-center justify-between p-3 border rounded mb-2">
            <div>
              <p className="font-semibold">Plaza {spot.code}</p>
              <p className="text-sm text-default-500">Estado: {spot.available}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onPress={() => abrirEditarModal(spot)}>
                ✏️
              </Button>
              <Button size="sm" color="danger" onPress={() => eliminar(spot.id)}>
                ❌
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
