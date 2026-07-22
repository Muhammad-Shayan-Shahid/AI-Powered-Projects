import { useEffect, useRef, useState } from 'react';
import DoctorSidebar from '../../../components/DoctorSidebar';
import FormAlert from '../../../components/FormAlert';
import { useAuth } from '../../auth/hooks/useAuth';
import { useDoctor } from '../hooks/useDoctor';
import { getInitials } from '../../../utils/getInitials';

const SPECIALIZATION_OPTIONS = [
  'Orthodontics',
  'General dentistry',
  'Endodontics',
  'Periodontics',
  'Oral surgery',
  'Pediatric dentistry',
];

export default function ProfileEdit() {
  const { user, getMe } = useAuth();
  const { isSavingProfile, profileError, profileUploadProgress, uploadProfile } = useDoctor();

  const [specialization, setSpecialization] = useState(
    SPECIALIZATION_OPTIONS.includes(user?.specialization) ? user.specialization : SPECIALIZATION_OPTIONS[0]
  );
  const [bio, setBio] = useState(user?.bio || '');
  // The picked file itself (sent to the backend, which uploads it to ImageKit
  // — see upload.service.js) and a local object-URL just for the preview
  // circle; they're separate so the preview never depends on the upload finishing.
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(user?.photoUrl || '');
  // True once the user has explicitly removed the photo (delete icon) without
  // picking a replacement — tells the submit handler to send removePhoto:'true'.
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [saved, setSaved] = useState(false);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    // Revoke the previous blob: URL whenever we replace it, and on unmount,
    // so picking several photos in a row doesn't leak memory.
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const previewUrl = URL.createObjectURL(file);
    objectUrlRef.current = previewUrl;
    setPhotoFile(file);
    setPhotoPreviewUrl(previewUrl);
    setPhotoRemoved(false);
  }

  function handleRemovePhoto() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPhotoFile(null);
    setPhotoPreviewUrl('');
    setPhotoRemoved(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSavingProfile) return;
    setSaved(false);

    const formData = new FormData();
    formData.append('specialization', specialization);
    formData.append('bio', bio);
    if (photoFile) formData.append('photo', photoFile);
    else if (photoRemoved) formData.append('removePhoto', 'true');

    try {
      await uploadProfile(formData);
      await getMe(); // refresh the session user so the sidebar reflects the new specialization/photo
      setPhotoRemoved(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch {
      // profileError (from the slice) already surfaces the message via FormAlert below.
    }
  }

  const saveLabel = isSavingProfile
    ? photoFile
      ? `Uploading… ${profileUploadProgress}%`
      : 'Saving…'
    : saved
      ? 'Saved ✓'
      : 'Save changes';

  return (
    <div className="flex min-h-screen bg-page max-md:flex-col">
      <DoctorSidebar />

      <main className="min-w-0 flex-1 p-6 sm:p-8 md:p-10">
        <div className="mb-7">
          <h1 className="m-0 mb-1.5 text-[1.75rem] font-bold leading-[1.3] tracking-tight text-ink">Edit profile</h1>
          <p className="m-0 text-[0.9375rem] leading-normal text-ink-secondary">Update how patients see you.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex max-w-[560px] animate-fade-in-up flex-col gap-5 rounded-2xl border border-border bg-surface p-7"
        >
          {profileError && <FormAlert>{profileError}</FormAlert>}

          <label className="flex flex-col gap-2">
            <span className="text-[0.8125rem] font-semibold text-ink-secondary">Profile photo</span>
            <div className="flex items-center gap-4">
              <div
                className="h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-full bg-clinician-subtle bg-cover bg-center"
                style={photoPreviewUrl ? { backgroundImage: `url(${photoPreviewUrl})` } : undefined}
              >
                {!photoPreviewUrl && (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-clinician">
                    {getInitials(user?.name)}
                  </div>
                )}
              </div>
              <input
                id="doctor-profile-photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />

              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <label
                    htmlFor="doctor-profile-photo"
                    title="Change photo"
                    aria-label="Change photo"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-border bg-surface text-ink-secondary transition-colors duration-150 ease-in-out hover:border-clinician hover:text-clinician"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="M15 5l4 4" />
                    </svg>
                  </label>

                  {photoPreviewUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      title="Remove photo"
                      aria-label="Remove photo"
                      className="flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-border bg-surface text-ink-secondary transition-colors duration-150 ease-in-out hover:border-danger-border hover:bg-danger-bg hover:text-danger-text"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                      </svg>
                    </button>
                  )}
                </div>
                <span className="text-[0.8125rem] leading-snug text-ink-tertiary">JPEG, PNG, WEBP, or GIF — up to 5MB.</span>
              </div>
            </div>

            {isSavingProfile && photoFile && (
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-page">
                <div
                  className="h-full rounded-full bg-clinician transition-[width] duration-150 ease-out"
                  style={{ width: `${profileUploadProgress}%` }}
                />
              </div>
            )}
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[0.8125rem] font-semibold text-ink-secondary">Full name</span>
            <input
              type="text"
              value={user?.name || ''}
              disabled
              title="Name changes aren't supported yet — contact the clinic admin."
              className="cursor-not-allowed rounded-xl border-[1.5px] border-border bg-page px-4 py-3 text-[0.9375rem] text-ink-secondary outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[0.8125rem] font-semibold text-ink-secondary">Specialization</span>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="rounded-xl border-[1.5px] border-border bg-surface px-4 py-3 text-[0.9375rem] text-ink outline-none transition-colors duration-150 ease-in-out focus:border-clinician focus:ring-[3px] focus:ring-clinician-ring"
            >
              {SPECIALIZATION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[0.8125rem] font-semibold text-ink-secondary">Bio</span>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="resize-y rounded-xl border-[1.5px] border-border bg-surface px-4 py-3 font-sans text-[0.9375rem] leading-normal text-ink outline-none transition-colors duration-150 ease-in-out focus:border-clinician focus:ring-[3px] focus:ring-clinician-ring"
            />
          </label>

          <button
            type="submit"
            disabled={isSavingProfile}
            className="flex items-center gap-2 self-start rounded-full bg-clinician px-7 py-3.5 text-[0.9375rem] font-bold text-white transition-all duration-150 ease-in-out hover:bg-clinician-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-75"
          >
            {saveLabel}
          </button>
        </form>
      </main>
    </div>
  );
}
