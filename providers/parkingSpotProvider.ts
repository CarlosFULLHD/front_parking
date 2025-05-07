import { toast } from "react-toastify";

export type ParkingSpot = {
  id: number;
  code: string;
  available: number; // 1: disponible, 2: reservado, 3: ocupado
};

export const getAllParkingSpots = async (): Promise<ParkingSpot[]> => {
  const res = await fetch("http://127.0.0.1:8080/api/parking-spots");
  if (!res.ok) {
    toast.error("❌ Error al obtener plazas");
    throw new Error("Error al obtener plazas");
  }
  return await res.json();
};

export const getParkingSpotById = async (id: number): Promise<ParkingSpot> => {
  const res = await fetch(`http://127.0.0.1:8080/api/parking-spots/${id}`);
  const data = await res.json();
  if (!res.ok) {
    toast.error("❌ Error al obtener la plaza");
  }
  return data;
};

export const createParkingSpot = async (spot: Omit<ParkingSpot, "id">) => {
  const res = await fetch("http://127.0.0.1:8080/api/parking-spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });

  const data = await res.json();

  if (res.ok) {
    toast.success("✅ Plaza creada con éxito");
  } else {
    toast.error("❌ Error al crear plaza");
  }

  return data;
};

export const updateParkingSpot = async (id: number, spot: Omit<ParkingSpot, "id">) => {
  const res = await fetch(`http://127.0.0.1:8080/api/parking-spots/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });

  const data = await res.json();

  if (res.ok) {
    toast.success("✅ Plaza actualizada con éxito");
  } else {
    toast.error("❌ Error al actualizar plaza");
  }

  return data;
};

export const deleteParkingSpot = async (id: number) => {
  const res = await fetch(`http://127.0.0.1:8080/api/parking-spots/${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    toast.success("✅ Plaza eliminada");
  } else {
    toast.error("❌ Error al eliminar plaza");
  }

  return res;
};
