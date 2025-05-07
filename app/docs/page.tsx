'use client';

import { useEffect, useState } from 'react';
import { title } from '@/components/primitives';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';

import {
  getAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  Vehicle,
} from '@/providers/vehicleProvider';

export default function DocsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [form, setForm] = useState<{ brand: string; plate: string }>({
    brand: '',
    plate: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const cargar = async () => {
    const data = await getAllVehicles();
    setVehicles(data);
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrirCrearModal = () => {
    setForm({ brand: '', plate: '' });
    setEditingId(null);
    setModalOpen(true);
  };

  const abrirEditarModal = (veh: Vehicle) => {
    setForm({ brand: veh.brand, plate: veh.plate });
    setEditingId(veh.id);
    setModalOpen(true);
  };

  const guardarVehiculo = async () => {
    if (editingId) {
      await updateVehicle(editingId, form);
    } else {
      await createVehicle(form);
    }
    setModalOpen(false);
    await cargar();
  };

  const handleDelete = async (id: number) => {
    await deleteVehicle(id);
    await cargar();
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className={title()}>Gestión de Vehículos</h1>

      <Button color="primary" className="my-4" onPress={abrirCrearModal}>
        ➕ Crear vehículo
      </Button>

      {/* Modal para Crear / Editar */}
      <Modal isOpen={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{editingId ? 'Editar Vehículo' : 'Crear Vehículo'}</ModalHeader>
              <ModalBody>
                <Input
                  label="Marca"
                  placeholder="Ej: TOYOTA"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                />
                <Input
                  label="Placa"
                  placeholder="Ej: 1234ABC"
                  value={form.plate}
                  onChange={(e) => setForm({ ...form, plate: e.target.value })}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={guardarVehiculo}>
                  {editingId ? 'Guardar Cambios' : 'Crear'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="mt-6">
        {vehicles.map((veh) => (
          <div key={veh.id} className="flex items-center justify-between p-3 border rounded mb-2">
            <div>
              <p className="font-semibold">{veh.brand}</p>
              <p className="text-sm text-default-500">{veh.plate}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onPress={() => abrirEditarModal(veh)}>
                ✏️
              </Button>
              <Button size="sm" color="danger" onPress={() => handleDelete(veh.id)}>
                ❌
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
