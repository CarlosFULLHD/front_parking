// providers/vehicleProvider.ts
import { toast } from "react-toastify";

export type Vehicle = {
  id: number;
  plate: string;
  brand: string;
};

export const getAllVehicles = async (): Promise<Vehicle[]> => {
  const res = await fetch("http://127.0.0.1:8080/api/vehicles");
  return await res.json();
};

export const getVehicleById = async (id: number): Promise<Vehicle> => {
  const res = await fetch(`http://127.0.0.1:8080/api/vehicles/${id}`);
  return await res.json();
};

export const createVehicle = async (vehicle: Omit<Vehicle, "id">) => {
  const res = await fetch("http://127.0.0.1:8080/api/vehicles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vehicle),
  });

  const data = await res.json();

  if (res.ok) {
    toast.success(data.mensaje || "✅ Vehículo creado con éxito");
  } else {
    toast.error(data.mensaje || "❌ Error al crear vehículo");
  }

  return data;
};

export const updateVehicle = async (
  id: number,
  vehicle: Omit<Vehicle, "id">
) => {
  const res = await fetch(`http://127.0.0.1:8080/api/vehicles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vehicle),
  });

  const data = await res.json();

  if (res.ok) {
    toast.success(data.mensaje || "✅ Vehículo actualizado");
  } else {
    toast.error(data.mensaje || "❌ Error al actualizar vehículo");
  }

  return data;
};

export const deleteVehicle = async (id: number) => {
  const res = await fetch(`http://127.0.0.1:8080/api/vehicles/${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    toast.success("🗑️ Vehículo eliminado");
  } else {
    toast.error("❌ No se pudo eliminar el vehículo");
  }

  return res;
};
