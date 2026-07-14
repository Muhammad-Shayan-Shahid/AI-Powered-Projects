import axiosInstance from "../../../config/axiosInstance";

export async function sendChatMessage(question) {
  const { data } = await axiosInstance.post("/api/chat", { question });
  return data; // { answer, sources }
}
