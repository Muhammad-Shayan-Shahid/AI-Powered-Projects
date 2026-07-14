import axiosInstance from "../../../config/axiosInstance";

export async function bookAppointment(formData) {
  const { data } = await axiosInstance.post("/api/appointments", formData);
  return data;
}
