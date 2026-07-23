import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPendingDoctors,
  approveDoctor,
  rejectDoctor,
  fetchActiveDoctors,
  featureDoctor,
  deactivateDoctor,
  fetchServices,
  createService,
  updateService,
  deleteService,
  fetchDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  fetchAllAppointments,
  clearDoctorActionError,
  clearServiceActionError,
  clearDocumentActionError,
  documentUploadStarted,
  documentUploadProgressed,
  documentUploadSucceeded,
  documentUploadFailed,
} from '../state/admin.slice';
import { adminService } from '../services/adminService';

// Wraps the admin slice so pages never touch dispatch/thunks directly.
export function useAdmin() {
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin);

  return {
    pendingDoctors: admin.pendingDoctors,
    isLoadingPendingDoctors: admin.isLoadingPendingDoctors,
    pendingDoctorsError: admin.pendingDoctorsError,
    actioningDoctorIds: admin.actioningDoctorIds,
    doctorActionError: admin.doctorActionError,

    activeDoctors: admin.activeDoctors,
    isLoadingActiveDoctors: admin.isLoadingActiveDoctors,
    togglingDoctorIds: admin.togglingDoctorIds,

    services: admin.services,
    isLoadingServices: admin.isLoadingServices,
    servicesError: admin.servicesError,
    savingServiceIds: admin.savingServiceIds,
    serviceActionError: admin.serviceActionError,

    documents: admin.documents,
    isLoadingDocuments: admin.isLoadingDocuments,
    documentsError: admin.documentsError,
    savingDocumentIds: admin.savingDocumentIds,
    documentActionError: admin.documentActionError,
    documentUploadProgress: admin.documentUploadProgress,

    allAppointments: admin.allAppointments,
    isLoadingAllAppointments: admin.isLoadingAllAppointments,
    allAppointmentsError: admin.allAppointmentsError,

    fetchPendingDoctors: useCallback(() => dispatch(fetchPendingDoctors()), [dispatch]),
    approveDoctor: useCallback((id) => dispatch(approveDoctor(id)), [dispatch]),
    rejectDoctor: useCallback((id, reason) => dispatch(rejectDoctor({ id, reason })), [dispatch]),

    fetchActiveDoctors: useCallback(() => dispatch(fetchActiveDoctors()), [dispatch]),
    featureDoctor: useCallback((id) => dispatch(featureDoctor(id)), [dispatch]),
    deactivateDoctor: useCallback((id) => dispatch(deactivateDoctor(id)), [dispatch]),

    fetchServices: useCallback(() => dispatch(fetchServices()), [dispatch]),
    createService: useCallback((payload) => dispatch(createService(payload)), [dispatch]),
    updateService: useCallback((id, payload) => dispatch(updateService({ id, payload })), [dispatch]),
    deleteService: useCallback((id) => dispatch(deleteService(id)), [dispatch]),

    fetchDocuments: useCallback(() => dispatch(fetchDocuments()), [dispatch]),
    createDocument: useCallback((payload) => dispatch(createDocument(payload)), [dispatch]),
    updateDocument: useCallback((id, payload) => dispatch(updateDocument({ id, payload })), [dispatch]),
    deleteDocument: useCallback((id) => dispatch(deleteDocument(id)), [dispatch]),

    // Bypasses the thunk pattern for the same reason as useDoctor's
    // uploadProfile: a live onProgress callback can't travel through a
    // createAsyncThunk arg. `id` present -> update (PUT), absent -> create (POST).
    uploadDocument: useCallback(
      async (formData, id) => {
        dispatch(documentUploadStarted());
        try {
          const data = id
            ? await adminService.uploadDocumentUpdate(id, formData, (percent) => dispatch(documentUploadProgressed(percent)))
            : await adminService.uploadDocument(formData, (percent) => dispatch(documentUploadProgressed(percent)));
          dispatch(documentUploadSucceeded(data));
          return data;
        } catch (error) {
          dispatch(documentUploadFailed(error.message));
          throw error;
        }
      },
      [dispatch]
    ),

    fetchAllAppointments: useCallback((filters) => dispatch(fetchAllAppointments(filters)), [dispatch]),

    clearDoctorActionError: useCallback(() => dispatch(clearDoctorActionError()), [dispatch]),
    clearServiceActionError: useCallback(() => dispatch(clearServiceActionError()), [dispatch]),
    clearDocumentActionError: useCallback(() => dispatch(clearDocumentActionError()), [dispatch]),
  };
}
