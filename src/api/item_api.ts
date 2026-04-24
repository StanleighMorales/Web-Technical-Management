import { api } from "./axios";
import { getToken } from "../utils/token";
import type { TBorrowItemData, TGuestBorrowFormData, TItemForm, TItemList, TUpdateItem } from "../@types/types";

const item_end_point = "/items";
const item_archive_end_point = "/archiveitems";
const item_borrow_end_point = "/lentItems";

type TUpdateItemPayload = {
  id: string;
  data: TUpdateItem;
};

export const summaryData = async () => {
  const response = await api.get("/summary");
  return response.data;
};

export const allItemsApi = async () => {
  const response = await api.get(item_end_point);
  return response.data.data;
};

export const getItemApi = async (id: string) => {
  const response = await api.get(`${item_end_point}/${id}`);
  return response.data.data;
};

export const addItemApi = async (data: Omit<TItemForm, "preview">) => {
  const body = new FormData();

  body.append("SerialNumber", data.serialNumber);
  body.append("ItemName", data.itemName);
  body.append("ItemType", data.itemType);
  body.append("ItemModel", data.itemModel);
  body.append("ItemMake", data.itemMake);
  body.append("Description", data.description);
  body.append("Category", data.category);
  body.append("Condition", data.condition);

  if (data.image) {
    body.append("Image", data.image);
  }

  // Use native fetch instead of axios for multipart/form-data to avoid
  // axios interfering with the Content-Type boundary (same pattern as borrowGuestItem).
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = getToken();

  const res = await fetch(`${BASE_URL}${item_end_point}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body,
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    const message =
      json?.message ||
      json?.errors?.[0] ||
      `Request failed with status code ${res.status}`;
    throw new Error(message);
  }

  const json = await res.json();
  return json.data;
};

export const updateItemApi = async ({ id, data }: TUpdateItemPayload) => {
  const response = await api.patch(`${item_end_point}/${id}`, data);
  return response.data.data;
};

export const archiveItemApi = async (id: string) => {
  const response = await api.delete(`${item_end_point}/archive/${id}`);
  return response.data;
};

export const allItemsArchiveApi = async () => {
  const response = await api.get(item_archive_end_point);
  return response.data.data;
};

export const getArchiveItemInfo = async (id: string) => {
  const response = await api.get(`${item_archive_end_point}/${id}`);
  return response.data.data;
};

export const restoreItemApi = async (id?: string) => {
  const response = await api.delete(`${item_archive_end_point}/restore/${id}`);
  return response.data;
};

export const deleteItemApi = async (id: string) => {
  const response = await api.delete(`${item_archive_end_point}/${id}`);
  return response.data;
};

export const recentlyBorrowItems = async (id?: string) => {
  const url = id ? `${item_borrow_end_point}/${id}` : item_borrow_end_point;

  const response = await api.get(url);

  if (id) return response.data;

  return response.data.data;
};

export const borrowItem = async (data: TBorrowItemData) => {
  const response = await api.post(`${item_borrow_end_point}/guests`, data);
  return response.data;
};

export const returnItem = async (id: string) => {
  const response = await api.post(`/lentItems/return/item/${id}`);
  return response.data;
};

export const importItem = async (formData: FormData) => {
  const response = await api.post("/items/import", formData);
  return response.data;
};

export const getItemByRfid = async (rfidUid: string): Promise<TItemList> => {
  const response = await api.get(`${item_end_point}/rfid/${encodeURIComponent(rfidUid)}`);
  return response.data.data;
};

export const borrowGuestItem = async (data: TGuestBorrowFormData) => {
  const body = new FormData();
  body.append("TagUid", data.tagUid);
  body.append("BorrowerFirstName", data.borrowerFirstName);
  body.append("BorrowerLastName", data.borrowerLastName);
  if (data.organization) body.append("Organization", data.organization);
  if (data.contactNumber) body.append("ContactNumber", data.contactNumber);
  if (data.purpose) body.append("Purpose", data.purpose);
  if (data.supervisorName) body.append("SupervisorName", data.supervisorName);
  body.append("Room", data.room);
  body.append("SubjectTimeSchedule", data.subjectTimeSchedule);
  if (data.remarks) body.append("Remarks", data.remarks);
  if (data.reservedFor) body.append("ReservedFor", data.reservedFor);
  body.append("Status", data.status);
  if (data.guestImage) body.append("GuestImage", data.guestImage);

  // Use native fetch instead of axios — axios can interfere with the
  // multipart/form-data boundary when Content-Type headers are manipulated.
  // fetch() automatically sets the correct Content-Type + boundary when given FormData.
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = getToken();

  const res = await fetch(`${BASE_URL}${item_borrow_end_point}/guests`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status code ${res.status}`);
  }

  return res.json();
};
