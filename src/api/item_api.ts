import { api } from "./axios";
import { getToken } from "../utils/token";
import type { TBorrowItemData, TBorrowSession, TGuestBorrowFormData, TItemForm, TItemList, TReturnSession, TUpdateItem } from "../@types/types";

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

  // Debug: Check if token exists
  const token = getToken();
  console.log("🔑 Token exists:", !!token);
  console.log("🔑 Token value:", token ? `${token.substring(0, 20)}...` : "NO TOKEN");

  // Use axios instead of fetch to leverage the token refresh interceptor
  const response = await api.post(item_end_point, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};

export const updateItemApi = async ({ id, data }: TUpdateItemPayload) => {
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

  const response = await api.patch(`${item_end_point}/${id}`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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
  const response = await api.patch(`/lentItems/${id}`, {
    Status: "Returned"
  });
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

// ── RFID Session API ──────────────────────────────────────────────────────────

const rfid_session_end_point = "/rfid-sessions";

export const createRfidSessionApi = async (itemId: string) => {
  const response = await api.post(rfid_session_end_point, { itemId });
  return response.data.data;
};

export const getRfidSessionApi = async (sessionId: string) => {
  const response = await api.get(`${rfid_session_end_point}/${sessionId}`);
  return response.data.data;
};

export const cancelRfidSessionApi = async (sessionId: string) => {
  const response = await api.delete(`${rfid_session_end_point}/${sessionId}`);
  return response.data;
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

  // Use axios to leverage the token refresh interceptor
  const response = await api.post(`${item_borrow_end_point}/guests`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ── Borrow Session API ────────────────────────────────────────────────────────

const borrow_session_end_point = "/borrow-sessions";

export const createBorrowSessionApi = async (): Promise<TBorrowSession> => {
  const response = await api.post(borrow_session_end_point);
  return response.data.data;
};

export const getBorrowSessionApi = async (sessionId: string): Promise<TBorrowSession> => {
  const response = await api.get(`${borrow_session_end_point}/${sessionId}`);
  return response.data.data;
};

export const cancelBorrowSessionApi = async (sessionId: string): Promise<void> => {
  await api.delete(`${borrow_session_end_point}/${sessionId}`);
};

// ── Return Session API ────────────────────────────────────────────────────────

const return_session_end_point = "/return-sessions";

export const createReturnSessionApi = async (): Promise<TReturnSession> => {
  const response = await api.post(return_session_end_point);
  return response.data.data;
};

export const getReturnSessionApi = async (sessionId: string): Promise<TReturnSession> => {
  const response = await api.get(`${return_session_end_point}/${sessionId}`);
  return response.data.data;
};

export const cancelReturnSessionApi = async (sessionId: string): Promise<void> => {
  await api.delete(`${return_session_end_point}/${sessionId}`);
};
