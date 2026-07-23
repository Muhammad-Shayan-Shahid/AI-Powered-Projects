import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../services/adminService';

// Normalizes whatever adminService throws into the { message, fieldErrors }
// shape the slice stores, so components can read the failure details
// regardless of which thunk failed.
function rejectWithAdminError(error, thunkAPI) {
  return thunkAPI.rejectWithValue({ message: error.message, fieldErrors: error.fieldErrors || null });
}

export const fetchPendingDoctors = createAsyncThunk('admin/fetchPendingDoctors', async (_, thunkAPI) => {
  try {
    return await adminService.listPendingDoctors();
  } catch (error) {
    return rejectWithAdminError(error, thunkAPI);
  }
});

export const approveDoctor = createAsyncThunk('admin/approveDoctor', async (id, thunkAPI) => {
  try {
    await adminService.approveDoctor(id);
    return { id };
  } catch (error) {
    return thunkAPI.rejectWithValue({ id, message: error.message });
  }
});

export const rejectDoctor = createAsyncThunk('admin/rejectDoctor', async ({ id, reason }, thunkAPI) => {
  try {
    await adminService.rejectDoctor(id, reason);
    return { id };
  } catch (error) {
    return thunkAPI.rejectWithValue({ id, message: error.message });
  }
});

export const fetchActiveDoctors = createAsyncThunk('admin/fetchActiveDoctors', async (_, thunkAPI) => {
  try {
    return await adminService.listActiveDoctors();
  } catch (error) {
    return rejectWithAdminError(error, thunkAPI);
  }
});

export const featureDoctor = createAsyncThunk('admin/featureDoctor', async (id, thunkAPI) => {
  try {
    const data = await adminService.featureDoctor(id);
    return { id, doctor: data.doctor };
  } catch (error) {
    return thunkAPI.rejectWithValue({ id, message: error.message });
  }
});

export const deactivateDoctor = createAsyncThunk('admin/deactivateDoctor', async (id, thunkAPI) => {
  try {
    const data = await adminService.deactivateDoctor(id);
    return { id, doctor: data.doctor };
  } catch (error) {
    return thunkAPI.rejectWithValue({ id, message: error.message });
  }
});

export const fetchServices = createAsyncThunk('admin/fetchServices', async (_, thunkAPI) => {
  try {
    return await adminService.listServices();
  } catch (error) {
    return rejectWithAdminError(error, thunkAPI);
  }
});

export const createService = createAsyncThunk('admin/createService', async (payload, thunkAPI) => {
  try {
    return await adminService.createService(payload);
  } catch (error) {
    return rejectWithAdminError(error, thunkAPI);
  }
});

export const updateService = createAsyncThunk('admin/updateService', async ({ id, payload }, thunkAPI) => {
  try {
    const data = await adminService.updateService(id, payload);
    return { id, service: data.service };
  } catch (error) {
    return thunkAPI.rejectWithValue({ id, message: error.message });
  }
});

export const deleteService = createAsyncThunk('admin/deleteService', async (id, thunkAPI) => {
  try {
    await adminService.deleteService(id);
    return { id };
  } catch (error) {
    return thunkAPI.rejectWithValue({ id, message: error.message });
  }
});

export const fetchDocuments = createAsyncThunk('admin/fetchDocuments', async (_, thunkAPI) => {
  try {
    return await adminService.listDocuments();
  } catch (error) {
    return rejectWithAdminError(error, thunkAPI);
  }
});

export const createDocument = createAsyncThunk('admin/createDocument', async (payload, thunkAPI) => {
  try {
    return await adminService.createDocument(payload);
  } catch (error) {
    return rejectWithAdminError(error, thunkAPI);
  }
});

export const updateDocument = createAsyncThunk('admin/updateDocument', async ({ id, payload }, thunkAPI) => {
  try {
    const data = await adminService.updateDocument(id, payload);
    return { id, document: data.document };
  } catch (error) {
    return thunkAPI.rejectWithValue({ id, message: error.message });
  }
});

export const deleteDocument = createAsyncThunk('admin/deleteDocument', async (id, thunkAPI) => {
  try {
    await adminService.deleteDocument(id);
    return { id };
  } catch (error) {
    return thunkAPI.rejectWithValue({ id, message: error.message });
  }
});

export const fetchAllAppointments = createAsyncThunk('admin/fetchAllAppointments', async (filters, thunkAPI) => {
  try {
    return await adminService.listAllAppointments(filters);
  } catch (error) {
    return rejectWithAdminError(error, thunkAPI);
  }
});

const initialState = {
  pendingDoctors: [],
  isLoadingPendingDoctors: false,
  pendingDoctorsError: null,
  actioningDoctorIds: [],
  doctorActionError: null,

  activeDoctors: [],
  isLoadingActiveDoctors: false,
  togglingDoctorIds: [],

  services: [],
  isLoadingServices: false,
  servicesError: null,
  savingServiceIds: [],
  serviceActionError: null,

  documents: [],
  isLoadingDocuments: false,
  documentsError: null,
  savingDocumentIds: [],
  documentActionError: null,
  // Real upload percentage (0-100) for the Knowledge Base "Upload file" mode,
  // driven by uploadRequest's XHR progress event. Set via plain actions
  // (dispatched directly from useAdmin's uploadDocument, see there) rather
  // than a createAsyncThunk lifecycle, since a live onProgress callback can't
  // safely travel through a thunk arg (Redux Toolkit's serializableCheck flags it).
  documentUploadProgress: 0,

  allAppointments: [],
  isLoadingAllAppointments: false,
  allAppointmentsError: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearDoctorActionError(state) {
      state.doctorActionError = null;
    },
    clearServiceActionError(state) {
      state.serviceActionError = null;
    },
    clearDocumentActionError(state) {
      state.documentActionError = null;
    },
    documentUploadStarted(state) {
      state.isLoadingDocuments = false;
      state.documentActionError = null;
      state.documentUploadProgress = 0;
    },
    documentUploadProgressed(state, action) {
      state.documentUploadProgress = action.payload;
    },
    documentUploadSucceeded(state, action) {
      state.documentUploadProgress = 100;
      const idx = state.documents.findIndex((d) => d._id === action.payload.document._id);
      if (idx !== -1) state.documents[idx] = action.payload.document;
      else state.documents.push(action.payload.document);
    },
    documentUploadFailed(state, action) {
      state.documentActionError = action.payload || 'Could not save this document.';
      state.documentUploadProgress = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingDoctors.pending, (state) => {
        state.isLoadingPendingDoctors = true;
        state.pendingDoctorsError = null;
      })
      .addCase(fetchPendingDoctors.fulfilled, (state, action) => {
        state.isLoadingPendingDoctors = false;
        state.pendingDoctors = action.payload.doctors;
      })
      .addCase(fetchPendingDoctors.rejected, (state, action) => {
        state.isLoadingPendingDoctors = false;
        state.pendingDoctorsError = action.payload?.message || 'Could not load pending doctors.';
      })

      // Approve/reject don't refetch the list — they drop the matching doctor
      // out of the pending array in place, same pattern as the doctor slice's
      // confirm/reject-in-place for appointments.
      .addCase(approveDoctor.pending, (state, action) => {
        state.actioningDoctorIds.push(action.meta.arg);
        state.doctorActionError = null;
      })
      .addCase(approveDoctor.fulfilled, (state, action) => {
        state.actioningDoctorIds = state.actioningDoctorIds.filter((id) => id !== action.payload.id);
        state.pendingDoctors = state.pendingDoctors.filter((d) => d.id !== action.payload.id);
      })
      .addCase(approveDoctor.rejected, (state, action) => {
        state.actioningDoctorIds = state.actioningDoctorIds.filter((id) => id !== action.payload?.id);
        state.doctorActionError = action.payload?.message || 'Could not approve this doctor.';
      })

      .addCase(rejectDoctor.pending, (state, action) => {
        state.actioningDoctorIds.push(action.meta.arg.id);
        state.doctorActionError = null;
      })
      .addCase(rejectDoctor.fulfilled, (state, action) => {
        state.actioningDoctorIds = state.actioningDoctorIds.filter((id) => id !== action.payload.id);
        state.pendingDoctors = state.pendingDoctors.filter((d) => d.id !== action.payload.id);
      })
      .addCase(rejectDoctor.rejected, (state, action) => {
        state.actioningDoctorIds = state.actioningDoctorIds.filter((id) => id !== action.payload?.id);
        state.doctorActionError = action.payload?.message || 'Could not reject this doctor.';
      })

      .addCase(fetchActiveDoctors.pending, (state) => {
        state.isLoadingActiveDoctors = true;
      })
      .addCase(fetchActiveDoctors.fulfilled, (state, action) => {
        state.isLoadingActiveDoctors = false;
        state.activeDoctors = action.payload.doctors;
      })
      .addCase(fetchActiveDoctors.rejected, (state) => {
        state.isLoadingActiveDoctors = false;
      })

      // Feature/deactivate patch the matching row in place rather than
      // refetching — mirrors approveDoctor/rejectDoctor's in-place pattern above.
      .addCase(featureDoctor.pending, (state, action) => {
        state.togglingDoctorIds.push(action.meta.arg);
        state.doctorActionError = null;
      })
      .addCase(featureDoctor.fulfilled, (state, action) => {
        state.togglingDoctorIds = state.togglingDoctorIds.filter((id) => id !== action.payload.id);
        const idx = state.activeDoctors.findIndex((d) => d._id === action.payload.id);
        if (idx !== -1) state.activeDoctors[idx] = { ...state.activeDoctors[idx], featured: action.payload.doctor.featured };
      })
      .addCase(featureDoctor.rejected, (state, action) => {
        state.togglingDoctorIds = state.togglingDoctorIds.filter((id) => id !== action.payload?.id);
        state.doctorActionError = action.payload?.message || 'Could not update featured status.';
      })

      // Deactivated doctors are kept in `activeDoctors` (status flipped, not
      // removed) so the row can dim + offer "Reactivate" in place, matching
      // the design — a real refetch would drop them since GET /doctors only
      // ever returns status: active.
      .addCase(deactivateDoctor.pending, (state, action) => {
        state.togglingDoctorIds.push(action.meta.arg);
        state.doctorActionError = null;
      })
      .addCase(deactivateDoctor.fulfilled, (state, action) => {
        state.togglingDoctorIds = state.togglingDoctorIds.filter((id) => id !== action.payload.id);
        const idx = state.activeDoctors.findIndex((d) => d._id === action.payload.id);
        if (idx !== -1) state.activeDoctors[idx] = { ...state.activeDoctors[idx], status: action.payload.doctor.status };
      })
      .addCase(deactivateDoctor.rejected, (state, action) => {
        state.togglingDoctorIds = state.togglingDoctorIds.filter((id) => id !== action.payload?.id);
        state.doctorActionError = action.payload?.message || 'Could not update this doctor.';
      })

      .addCase(fetchServices.pending, (state) => {
        state.isLoadingServices = true;
        state.servicesError = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoadingServices = false;
        state.services = action.payload.services;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoadingServices = false;
        state.servicesError = action.payload?.message || 'Could not load services.';
      })

      .addCase(createService.fulfilled, (state, action) => {
        state.services.push(action.payload.service);
      })
      .addCase(createService.rejected, (state, action) => {
        state.serviceActionError = action.payload?.message || 'Could not save this service.';
      })

      .addCase(updateService.pending, (state, action) => {
        state.savingServiceIds.push(action.meta.arg.id);
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.savingServiceIds = state.savingServiceIds.filter((id) => id !== action.payload.id);
        const idx = state.services.findIndex((s) => s._id === action.payload.id);
        if (idx !== -1) state.services[idx] = action.payload.service;
      })
      .addCase(updateService.rejected, (state, action) => {
        state.savingServiceIds = state.savingServiceIds.filter((id) => id !== action.payload?.id);
        state.serviceActionError = action.payload?.message || 'Could not save this service.';
      })

      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter((s) => s._id !== action.payload.id);
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.serviceActionError = action.payload?.message || 'Could not remove this service.';
      })

      .addCase(fetchDocuments.pending, (state) => {
        state.isLoadingDocuments = true;
        state.documentsError = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.isLoadingDocuments = false;
        state.documents = action.payload.documents;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.isLoadingDocuments = false;
        state.documentsError = action.payload?.message || 'Could not load documents.';
      })

      .addCase(createDocument.fulfilled, (state, action) => {
        state.documents.push(action.payload.document);
      })
      .addCase(createDocument.rejected, (state, action) => {
        state.documentActionError = action.payload?.message || 'Could not save this document.';
      })

      .addCase(updateDocument.pending, (state, action) => {
        state.savingDocumentIds.push(action.meta.arg.id);
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.savingDocumentIds = state.savingDocumentIds.filter((id) => id !== action.payload.id);
        const idx = state.documents.findIndex((d) => d._id === action.payload.id);
        if (idx !== -1) state.documents[idx] = action.payload.document;
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.savingDocumentIds = state.savingDocumentIds.filter((id) => id !== action.payload?.id);
        state.documentActionError = action.payload?.message || 'Could not save this document.';
      })

      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter((d) => d._id !== action.payload.id);
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.documentActionError = action.payload?.message || 'Could not remove this document.';
      })

      .addCase(fetchAllAppointments.pending, (state) => {
        state.isLoadingAllAppointments = true;
        state.allAppointmentsError = null;
      })
      .addCase(fetchAllAppointments.fulfilled, (state, action) => {
        state.isLoadingAllAppointments = false;
        state.allAppointments = action.payload.appointments;
      })
      .addCase(fetchAllAppointments.rejected, (state, action) => {
        state.isLoadingAllAppointments = false;
        state.allAppointmentsError = action.payload?.message || 'Could not load appointments.';
      });
  },
});

export const {
  clearDoctorActionError,
  clearServiceActionError,
  clearDocumentActionError,
  documentUploadStarted,
  documentUploadProgressed,
  documentUploadSucceeded,
  documentUploadFailed,
} = adminSlice.actions;
export default adminSlice.reducer;
