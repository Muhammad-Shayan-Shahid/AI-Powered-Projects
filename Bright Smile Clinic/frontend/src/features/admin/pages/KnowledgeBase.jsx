import { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import FormAlert from '../../../components/FormAlert';
import { useAdmin } from '../hooks/useAdmin';

const CATEGORY_LABELS = {
  insurance: 'Insurance',
  policy: 'Policy',
  procedure_instructions: 'Procedure Instructions',
};

const CATEGORY_STYLES = {
  insurance: 'bg-brand-subtle text-brand',
  policy: 'bg-clinician-subtle text-clinician',
  procedure_instructions: 'bg-warning-bg text-warning-text',
};

const EMPTY_FORM = { title: '', category: 'insurance', content: '' };

function formatUpdated(dateISOString) {
  return new Date(dateISOString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function KnowledgeBase() {
  const {
    documents,
    isLoadingDocuments,
    documentsError,
    savingDocumentIds,
    documentActionError,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
  } = useAdmin();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [mode, setMode] = useState('paste'); // 'paste' | 'upload' — only paste is wired to a backend, see note below
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setMode('paste');
    setFormError(null);
    setFormOpen(true);
  }
  function openEdit(doc) {
    setEditingId(doc._id);
    setForm({ title: doc.title, category: doc.category, content: doc.content });
    setMode('paste');
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
    if (!form.title.trim() || !form.content.trim()) return;

    const payload = { title: form.title, category: form.category, content: form.content };

    setIsSaving(true);
    setFormError(null);
    try {
      if (editingId) {
        await updateDocument(editingId, payload).unwrap();
      } else {
        await createDocument(payload).unwrap();
      }
      setFormOpen(false);
    } catch (error) {
      setFormError(error.message || 'Could not save this document.');
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
              Knowledge base
            </h1>
            <p className="m-0 text-[0.9375rem] leading-normal text-ink-secondary">
              Reference docs used across the clinic.
            </p>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="rounded-full bg-brand px-[22px] py-3 text-sm font-bold text-white transition-all duration-150 ease-in-out hover:bg-brand-hover active:scale-[0.98]"
          >
            + Add document
          </button>
        </div>

        {documentsError && <FormAlert>{documentsError}</FormAlert>}
        {documentActionError && <FormAlert>{documentActionError}</FormAlert>}

        {formOpen && (
          <form
            onSubmit={handleSave}
            className="mb-5 flex max-w-[560px] animate-fade-in-up flex-col gap-3.5 rounded-2xl border-[1.5px] border-brand bg-surface p-6"
          >
            <div className="text-base font-bold text-ink">{editingId ? 'Edit document' : 'Add document'}</div>
            {formError && <FormAlert>{formError}</FormAlert>}

            <label className="flex flex-col gap-1.5">
              <span className="text-[0.8125rem] font-semibold text-ink-secondary">Title</span>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
                placeholder="Insurance FAQ"
                required
                className="w-full rounded-[10px] border-[1.5px] border-border-admin bg-surface px-3.5 py-2.5 text-[0.9375rem] text-ink outline-none transition-colors duration-150 ease-in-out focus:border-brand focus:ring-[3px] focus:ring-brand-ring"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[0.8125rem] font-semibold text-ink-secondary">Category</span>
              <select
                value={form.category}
                onChange={(e) => setField('category', e.target.value)}
                className="w-full rounded-[10px] border-[1.5px] border-border-admin bg-surface px-3.5 py-2.5 text-[0.9375rem] text-ink outline-none transition-colors duration-150 ease-in-out focus:border-brand focus:ring-[3px] focus:ring-brand-ring"
              >
                <option value="insurance">Insurance</option>
                <option value="policy">Policy</option>
                <option value="procedure_instructions">Procedure Instructions</option>
              </select>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode('paste')}
                className={[
                  'flex-1 rounded-full border-[1.5px] py-2.5 text-xs font-bold transition-colors duration-150 ease-in-out',
                  mode === 'paste' ? 'border-brand bg-brand text-white' : 'border-border-admin bg-transparent text-ink',
                ].join(' ')}
              >
                Paste text
              </button>
              <button
                type="button"
                onClick={() => setMode('upload')}
                className={[
                  'flex-1 rounded-full border-[1.5px] py-2.5 text-xs font-bold transition-colors duration-150 ease-in-out',
                  mode === 'upload' ? 'border-brand bg-brand text-white' : 'border-border-admin bg-transparent text-ink',
                ].join(' ')}
              >
                Upload file
              </button>
            </div>

            {mode === 'paste' && (
              <textarea
                rows={4}
                value={form.content}
                onChange={(e) => setField('content', e.target.value)}
                placeholder="Paste the document text here…"
                required
                className="w-full resize-y rounded-[10px] border-[1.5px] border-border-admin bg-surface px-3.5 py-2.5 font-sans text-sm leading-normal text-ink outline-none transition-colors duration-150 ease-in-out focus:border-brand focus:ring-[3px] focus:ring-brand-ring"
              />
            )}
            {mode === 'upload' && (
              <div className="rounded-xl border-[1.5px] border-dashed border-[oklch(85%_0.01_250)] px-6 py-6 text-center text-[0.8125rem] font-medium text-ink-tertiary">
                File upload isn't wired up to storage yet — switch to "Paste text" to save this document for now.
              </div>
            )}

            <div className="flex gap-2.5">
              <button
                type="submit"
                disabled={isSaving || mode === 'upload'}
                className="rounded-full bg-brand px-[22px] py-2.5 text-[0.8125rem] font-bold text-white transition-colors duration-150 ease-in-out hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? 'Saving…' : 'Save document'}
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

        {isLoadingDocuments && <p className="text-sm text-ink-secondary">Loading documents…</p>}

        {!isLoadingDocuments && documents.length > 0 && (
          <div className="flex max-w-[760px] flex-col gap-2.5">
            {documents.map((doc) => {
              const isSavingRow = savingDocumentIds.includes(doc._id);
              return (
                <div
                  key={doc._id}
                  className="grid animate-fade-in-up grid-cols-[1.4fr_0.6fr_0.5fr_auto] items-center gap-4 rounded-[14px] border border-border-admin bg-surface px-5 py-4 max-md:grid-cols-1"
                >
                  <div className="text-[0.9375rem] font-bold text-ink">{doc.title}</div>
                  <div className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-[0.6875rem] font-bold ${CATEGORY_STYLES[doc.category]}`}>
                    {CATEGORY_LABELS[doc.category]}
                  </div>
                  <div className="text-[0.8125rem] text-ink-secondary">{formatUpdated(doc.updatedAt)}</div>
                  <div className="flex justify-end gap-2 max-md:justify-start">
                    <button
                      type="button"
                      onClick={() => openEdit(doc)}
                      disabled={isSavingRow}
                      className="rounded-full border-[1.5px] border-border-admin bg-transparent px-4 py-2 text-xs font-semibold text-ink transition-colors duration-150 ease-in-out hover:bg-[oklch(94%_0.007_90)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteDocument(doc._id)}
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

        {!isLoadingDocuments && documents.length === 0 && (
          <div className="max-w-[480px] rounded-[20px] border border-border-admin bg-surface px-6 py-14 text-center text-[0.9375rem] font-medium text-ink-tertiary">
            No documents yet — add your first one above.
          </div>
        )}
      </main>
    </div>
  );
}
