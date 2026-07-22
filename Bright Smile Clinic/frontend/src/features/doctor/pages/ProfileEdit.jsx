import { useState } from 'react';
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
  const { isSavingProfile, profileError, updateDoctorProfile } = useDoctor();

  const [specialization, setSpecialization] = useState(
    SPECIALIZATION_OPTIONS.includes(user?.specialization) ? user.specialization : SPECIALIZATION_OPTIONS[0]
  );
  const [bio, setBio] = useState(user?.bio || '');
  // Photo storage has no dedicated upload pipeline yet (see CLAUDE.md), so for
  // now the picked file is base64-encoded straight into `photoUrl` — revisit
  // with real object storage before this goes to production with real photos.
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || '');
  const [saved, setSaved] = useState(false);

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoUrl(reader.result);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSavingProfile) return;
    setSaved(false);
    const result = await updateDoctorProfile({ specialization, bio, photoUrl });
    if (result.meta.requestStatus === 'fulfilled') {
      await getMe(); // refresh the session user so the sidebar reflects the new specialization/photo
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }
  }

  const saveLabel = isSavingProfile ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes';

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
              <label
                htmlFor="doctor-profile-photo"
                className="h-[72px] w-[72px] flex-shrink-0 cursor-pointer overflow-hidden rounded-full bg-clinician-subtle bg-cover bg-center"
                style={photoUrl ? { backgroundImage: `url(${photoUrl})` } : undefined}
              >
                {!photoUrl && (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-clinician">
                    {getInitials(user?.name)}
                  </div>
                )}
              </label>
              <input
                id="doctor-profile-photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <span className="text-[0.8125rem] leading-snug text-ink-tertiary">
                Drag a new photo in, or click to browse.
              </span>
            </div>
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
