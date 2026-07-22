import { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import FormAlert from '../../../components/FormAlert';
import { useAdmin } from '../hooks/useAdmin';

const EMPTY_FORM = { name: '', description: '', duration: '', price: '' };

export default function ManageServices() {
  const {
    services,
    isLoadingServices,
    servicesError,
    savingServiceIds,
    serviceActionError,
    fetchServices,
    createService,
    updateService,
    deleteService,
  } = useAdmin();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setFormOpen(true);
  }
  function openEdit(svc) {
    setEditingId(svc._id);
    setForm({
      name: svc.name,
      description: svc.description || '',
      duration: svc.durationMinutes,
      price: svc.price,
    });
    setFormError(null);
    setFormOpen(true);
  }
  function closeForm() {
    setFormOpen(false);
  }
  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim()) return;

    const payload = {
      name: form.name,
      description: form.description,
      durationMinutes: Number(form.duration),
      price: Number(form.price) || 0,
    };

    setIsSaving(true);
    setFormError(null);
    try {
      if (editingId) {
        await updateService(editingId, payload).unwrap();
      } else {
        await createService(payload).unwrap();
      }
      setFormOpen(false);
    } catch (error) {
      setFormError(error.message || 'Could not save this service.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-page-admin max-md:flex-col">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-6 sm:p-8 md:p-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="m-0 mb-1.5 text-[1.75rem] font-bold leading-[1.3] tracking-tight text-ink">
              Manage services
            </h1>
            <p className="m-0 text-[0.9375rem] leading-normal text-ink-secondary">
              The services patients can book across the clinic.
            </p>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="rounded-full bg-brand px-[22px] py-3 text-sm font-bold text-white transition-all duration-150 ease-in-out hover:bg-brand-hover active:scale-[0.98]"
          >
            + Add service
          </button>
        </div>

        {servicesError && <FormAlert>{servicesError}</FormAlert>}
        {serviceActionError && <FormAlert>{serviceActionError}</FormAlert>}

        {formOpen && (
          <form
            onSubmit={handleSave}
            className="mb-5 flex max-w-[560px] animate-fade-in-up flex-col gap-3.5 rounded-2xl border-[1.5px] border-brand bg-surface p-6"
          >
            <div className="text-base font-bold text-ink">{editingId ? 'Edit service' : 'Add service'}</div>
            {formError && <FormAlert>{formError}</FormAlert>}

            <label className="flex flex-col gap-1.5">
              <span className="text-[0.8125rem] font-semibold text-ink-secondary">Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="Teeth whitening"
                required
                className="w-full rounded-[10px] border-[1.5px] border-border-admin bg-surface px-3.5 py-2.5 text-[0.9375rem] text-ink outline-none transition-colors duration-150 ease-in-out focus:border-brand focus:ring-[3px] focus:ring-brand-ring"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[0.8125rem] font-semibold text-ink-secondary">Description</span>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                placeholder="Brief description"
                className="w-full resize-y rounded-[10px] border-[1.5px] border-border-admin bg-surface px-3.5 py-2.5 font-sans text-[0.9375rem] leading-snug text-ink outline-none transition-colors duration-150 ease-in-out focus:border-brand focus:ring-[3px] focus:ring-brand-ring"
              />
            </label>

            <div className="grid grid-cols-2 gap-3.5 max-md:grid-cols-1">
              <label className="flex flex-col gap-1.5">
                <span className="text-[0.8125rem] font-semibold text-ink-secondary">Duration (min)</span>
                <input
                  type="number"
                  min="5"
                  value={form.duration}
                  onChange={(e) => setField('duration', e.target.value)}
                  placeholder="30"
                  required
                  className="w-full rounded-[10px] border-[1.5px] border-border-admin bg-surface px-3.5 py-2.5 text-[0.9375rem] text-ink outline-none transition-colors duration-150 ease-in-out focus:border-brand focus:ring-[3px] focus:ring-brand-ring"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[0.8125rem] font-semibold text-ink-secondary">Price ($)</span>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setField('price', e.target.value)}
                  placeholder="120"
                  className="w-full rounded-[10px] border-[1.5px] border-border-admin bg-surface px-3.5 py-2.5 text-[0.9375rem] text-ink outline-none transition-colors duration-150 ease-in-out focus:border-brand focus:ring-[3px] focus:ring-brand-ring"
                />
              </label>
            </div>

            <div className="flex gap-2.5">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-full bg-brand px-[22px] py-2.5 text-[0.8125rem] font-bold text-white transition-colors duration-150 ease-in-out hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? 'Saving…' : 'Save service'}
              </button>
              <button
                type="button"
                onClick={closeForm}
                disabled={isSaving}
                className="rounded-full border-[1.5px] border-[oklch(85%_0.01_250)] bg-transparent px-[22px] py-2.5 text-[0.8125rem] font-bold text-[oklch(45%_0.01_260)] transition-colors duration-150 ease-in-out hover:bg-[oklch(94%_0.007_90)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {isLoadingServices && <p className="text-sm text-ink-secondary">Loading services…</p>}

        {!isLoadingServices && services.length > 0 && (
          <div className="flex max-w-[800px] flex-col gap-2.5">
            {services.map((svc) => {
              const isSavingRow = savingServiceIds.includes(svc._id);
              return (
                <div
                  key={svc._id}
                  className="grid animate-fade-in-up grid-cols-[1.4fr_0.6fr_0.5fr_auto] items-center gap-4 rounded-[14px] border border-border-admin bg-surface px-5 py-4 max-md:grid-cols-1"
                >
                  <div>
                    <div className="text-[0.9375rem] font-bold text-ink">{svc.name}</div>
                    {svc.description && (
                      <div className="mt-0.5 text-[0.8125rem] text-ink-secondary">{svc.description}</div>
                    )}
                  </div>
                  <div className="text-[0.8125rem] font-semibold text-ink-secondary">{svc.durationMinutes} min</div>
                  <div className="text-[0.9375rem] font-bold text-ink">${svc.price}</div>
                  <div className="flex justify-end gap-2 max-md:justify-start">
                    <button
                      type="button"
                      onClick={() => openEdit(svc)}
                      disabled={isSavingRow}
                      className="rounded-full border-[1.5px] border-border-admin bg-transparent px-4 py-2 text-xs font-semibold text-ink transition-colors duration-150 ease-in-out hover:bg-[oklch(94%_0.007_90)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteService(svc._id)}
                      disabled={isSavingRow}
                      className="rounded-full border-[1.5px] border-border-admin bg-transparent px-4 py-2 text-xs font-semibold text-[oklch(45%_0.01_260)] transition-all duration-150 ease-in-out hover:border-danger-border hover:bg-danger-bg hover:text-danger-text disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoadingServices && services.length === 0 && (
          <div className="max-w-[480px] rounded-[20px] border border-border-admin bg-surface px-6 py-14 text-center text-[0.9375rem] font-medium text-ink-tertiary">
            No services yet — add your first one above.
          </div>
        )}
      </main>
    </div>
  );
}
