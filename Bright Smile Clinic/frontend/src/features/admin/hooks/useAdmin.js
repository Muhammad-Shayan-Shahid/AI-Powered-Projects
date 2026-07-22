import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPendingDoctors,
  approveDoctor,
  rejectDoctor,
  fetchActiveDoctors,
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
} from '../state/admin.slice';

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

    allAppointments: admin.allAppointments,
    isLoadingAllAppointments: admin.isLoadingAllAppointments,
    allAppointmentsError: admin.allAppointmentsError,

    fetchPendingDoctors: useCallback(() => dispatch(fetchPendingDoctors()), [dispatch]),
    approveDoctor: useCallback((id) => dispatch(approveDoctor(id)), [dispatch]),
    rejectDoctor: useCallback((id, reason) => dispatch(rejectDoctor({ id, reason })), [dispatch]),

    fetchActiveDoctors: useCallback(() => dispatch(fetchActiveDoctors()), [dispatch]),

    fetchServices: useCallback(() => dispatch(fetchServices()), [dispatch]),
    createService: useCallback((payload) => dispatch(createService(payload)), [dispatch]),
    updateService: useCallback((id, payload) => dispatch(updateService({ id, payload })), [dispatch]),
    deleteService: useCallback((id) => dispatch(deleteService(id)), [dispatch]),

    fetchDocuments: useCallback(() => dispatch(fetchDocuments()), [dispatch]),
    createDocument: useCallback((payload) => dispatch(createDocument(payload)), [dispatch]),
    updateDocument: useCallback((id, payload) => dispatch(updateDocument({ id, payload })), [dispatch]),
    deleteDocument: useCallback((id) => dispatch(deleteDocument(id)), [dispatch]),

    fetchAllAppointments: useCallback((filters) => dispatch(fetchAllAppointments(filters)), [dispatch]),

    clearDoctorActionError: useCallback(() => dispatch(clearDoctorActionError()), [dispatch]),
    clearServiceActionError: useCallback(() => dispatch(clearServiceActionError()), [dispatch]),
    clearDocumentActionError: useCallback(() => dispatch(clearDocumentActionError()), [dispatch]),
  };
}
