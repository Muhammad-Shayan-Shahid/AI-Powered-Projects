import { useEffect, useRef, useState } from 'react';
import DoctorSidebar from '../../../components/DoctorSidebar';
import FormAlert from '../../../components/FormAlert';
import { useDoctor } from '../hooks/useDoctor';

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
// Maps the Monday-first display order to the backend's dayOfWeek convention
// (0 = Sunday .. 6 = Saturday, matching Date.getUTCDay() used across booking).
const DAY_OF_WEEK_BY_INDEX = [1, 2, 3, 4, 5, 6, 0];

function buildInitialDays() {
  return DAY_NAMES.map((name, i) => ({
    dayOfWeek: DAY_OF_WEEK_BY_INDEX[i],
    name,
    enabled: false,
    start: '09:00',
    end: '17:00',
    id: null,
  }));
}

export default function MyAvailability() {
  const {
    availability,
    isLoadingAvailability,
    availabilityError,
    fetchAvailability,
    createAvailability,
    updateAvailability,
    deleteAvailability,
  } = useDoctor();

  const [days, setDays] = useState(buildInitialDays);
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved
  const [saveError, setSaveError] = useState(null);
  const didHydrateRef = useRef(false);

  useEffect(() => {
    fetchAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once the initial fetch settles, seed each day's toggle/times from
  // whatever Availability rows already exist for this doctor. Runs once so
  // it never clobbers in-progress local edits on a later refetch.
  useEffect(() => {
    if (isLoadingAvailability || didHydrateRef.current) return;
    didHydrateRef.current = true;
    setDays((prev) =>
      prev.map((day) => {
        const match = availability.find((a) => a.dayOfWeek === day.dayOfWeek);
        return match ? { ...day, enabled: true, start: match.startTime, end: match.endTime, id: match._id } : day;
      })
    );
  }, [isLoadingAvailability, availability]);

  function toggleDay(i) {
    setDays((prev) => prev.map((d, idx) => (idx === i ? { ...d, enabled: !d.enabled } : d)));
    setSaveState('idle');
  }
  function setStart(i, value) {
    setDays((prev) => prev.map((d, idx) => (idx === i ? { ...d, start: value } : d)));
    setSaveState('idle');
  }
  function setEnd(i, value) {
    setDays((prev) => prev.map((d, idx) => (idx === i ? { ...d, end: value } : d)));
    setSaveState('idle');
  }

  // Reconciles each of the 7 local day rows against the existing Availability
  // CRUD endpoints: create a row that's newly enabled, update one that
  // changed times, delete one that got switched off.
  async function handleSave() {
    setSaveState('saving');
    setSaveError(null);
    try {
      const idUpdates = await Promise.all(
        days.map(async (day, idx) => {
          if (day.enabled && !day.id) {
            const result = await createAvailability({ dayOfWeek: day.dayOfWeek, startTime: day.start, endTime: day.end }).unwrap();
            return { idx, id: result.availability._id };
          }
          if (day.enabled && day.id) {
            await updateAvailability(day.id, { startTime: day.start, endTime: day.end }).unwrap();
            return null;
          }
          if (!day.enabled && day.id) {
            await deleteAvailability(day.id).unwrap();
            return { idx, id: null };
          }
          return null;
        })
      );

      setDays((prev) =>
        prev.map((d, idx) => {
          const change = idUpdates.find((u) => u && u.idx === idx);
          return change ? { ...d, id: change.id } : d;
        })
      );
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 1800);
    } catch (error) {
      setSaveState('idle');
      setSaveError(error.message || 'Could not save availability.');
    }
  }

  const saveLabel = saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved ✓' : 'Save changes';

  return (
    <div className="flex min-h-screen bg-page max-md:flex-col">
      <DoctorSidebar />

      <main className="min-w-0 flex-1 p-6 sm:p-8 md:p-10">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="m-0 mb-1.5 text-[1.75rem] font-bold leading-[1.3] tracking-tight text-ink">My availability</h1>
            <p className="m-0 text-[0.9375rem] leading-normal text-ink-secondary">
              Set the days and hours patients can book you.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saveState === 'saving'}
            className="rounded-full bg-clinician px-6 py-3 text-sm font-bold text-white transition-all duration-150 ease-in-out hover:bg-clinician-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-75"
          >
            {saveLabel}
          </button>
        </div>

        {availabilityError && <FormAlert>{availabilityError}</FormAlert>}
        {saveError && <FormAlert>{saveError}</FormAlert>}

        {isLoadingAvailability && <p className="text-sm text-ink-secondary">Loading availability…</p>}

        {!isLoadingAvailability && (
          <div className="max-w-[640px] overflow-hidden rounded-2xl border border-border bg-surface">
            {days.map((day, i) => (
              <div
                key={day.dayOfWeek}
                className="flex flex-wrap items-center gap-4 border-b border-[oklch(93%_0.006_250)] p-[18px_24px] last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={`relative h-[26px] w-11 flex-shrink-0 rounded-full transition-colors duration-150 ease-in-out ${
                    day.enabled ? 'bg-clinician' : 'bg-[oklch(88%_0.008_250)]'
                  }`}
                  aria-pressed={day.enabled}
                  aria-label={`Toggle ${day.name}`}
                >
                  <div
                    className={`absolute top-[3px] h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_oklch(22%_0.05_265_/_0.25)] transition-[left] duration-150 ease-in-out ${
                      day.enabled ? 'left-[21px]' : 'left-[3px]'
                    }`}
                  />
                </button>

                <div className={`w-[110px] flex-shrink-0 text-[0.9375rem] font-bold ${day.enabled ? 'text-ink' : 'text-ink-tertiary'}`}>
                  {day.name}
                </div>

                {day.enabled ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="time"
                      value={day.start}
                      onChange={(e) => setStart(i, e.target.value)}
                      className="rounded-[10px] border-[1.5px] border-border bg-surface px-3 py-2 text-[0.8125rem] font-medium text-ink outline-none transition-colors duration-150 ease-in-out focus:border-clinician focus:ring-[3px] focus:ring-clinician-ring"
                    />
                    <span className="text-[0.8125rem] font-medium text-ink-tertiary">to</span>
                    <input
                      type="time"
                      value={day.end}
                      onChange={(e) => setEnd(i, e.target.value)}
                      className="rounded-[10px] border-[1.5px] border-border bg-surface px-3 py-2 text-[0.8125rem] font-medium text-ink outline-none transition-colors duration-150 ease-in-out focus:border-clinician focus:ring-[3px] focus:ring-clinician-ring"
                    />
                  </div>
                ) : (
                  <span className="text-[0.8125rem] font-medium text-ink-tertiary">Unavailable</span>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
