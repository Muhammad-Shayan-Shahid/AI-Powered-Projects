import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientNavbar from '../../../components/PatientNavbar';
import Footer from '../../../components/Footer';
import Input from '../../../components/Input';
import FormAlert from '../../../components/FormAlert';
import DoctorAvatar from '../../../components/DoctorAvatar';
import { useBooking } from '../hooks/useBooking';
import { getInitials } from '../../../utils/getInitials';
import { formatDateKey, formatDateLabel, formatTimeLabel } from '../../../utils/dateFormat';

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const STEP_NAMES = ['Select doctor', 'Select service', 'Select date', 'Select time'];

function buildCalendarCells({ year, monthIndex, selectedKey, today, onSelect }) {
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < firstWeekday; i++) {
    cells.push({ key: `blank-${i}`, day: '', disabled: true, visible: false, select: undefined, className: '' });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const key = formatDateKey(year, monthIndex, day);
    const past = Date.UTC(year, monthIndex, day) < Date.UTC(today.year, today.monthIndex, today.day);
    const selected = selectedKey === key;

    let className;
    if (selected) className = 'border-brand bg-brand text-white cursor-pointer';
    else if (past) className = 'border-muted-bg bg-page text-muted-text cursor-not-allowed';
    else className = 'border-border bg-surface text-ink cursor-pointer';

    cells.push({ key, day, disabled: past, visible: true, select: () => onSelect(key), className });
  }

  return cells;
}

export default function BookAppointment() {
  const navigate = useNavigate();
  const {
    doctors,
    services,
    isLoadingCatalog,
    slots,
    isLoadingSlots,
    isBooking,
    bookingError,
    bookingConflict,
    fetchDoctors,
    fetchServices,
    fetchAvailableSlots,
    createAppointment,
    clearSlots,
    clearBookingConflict,
  } = useBooking();

  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctorId, setDoctorId] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [dateKey, setDateKey] = useState(null);
  const [slot, setSlot] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const today = useMemo(() => {
    const now = new Date();
    return { year: now.getFullYear(), monthIndex: now.getMonth(), day: now.getDate() };
  }, []);
  const [calendarYear, setCalendarYear] = useState(today.year);
  const [calendarMonth, setCalendarMonth] = useState(today.monthIndex);

  useEffect(() => {
    fetchDoctors();
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (doctorId && serviceId && dateKey) {
      fetchAvailableSlots({ doctorId, serviceId, date: dateKey });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId, serviceId, dateKey]);

  const doctorPicked = !!doctorId;
  const servicePicked = !!serviceId;
  const datePicked = !!dateKey;
  const slotPicked = !!slot;
  const allDone = doctorPicked && servicePicked && datePicked && slotPicked;

  const doneFlags = [doctorPicked, servicePicked, datePicked, slotPicked];
  const currentStepIdx = !doctorPicked ? 0 : !servicePicked ? 1 : !datePicked ? 2 : !slotPicked ? 3 : 3;

  const filteredDoctors = useMemo(() => {
    const q = doctorSearch.trim().toLowerCase();
    if (!q) return doctors;
    return doctors.filter(
      (d) => d.name.toLowerCase().includes(q) || (d.specialization || '').toLowerCase().includes(q)
    );
  }, [doctors, doctorSearch]);

  const monthLabel = new Date(calendarYear, calendarMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  function selectDoctor(id) {
    setDoctorId(id);
    setServiceId(null);
    setDateKey(null);
    setSlot(null);
    clearSlots();
    clearBookingConflict();
  }

  function selectService(id) {
    setServiceId(id);
    setDateKey(null);
    setSlot(null);
    clearSlots();
    clearBookingConflict();
  }

  function openCalendar() {
    if (!serviceId) return;
    setCalendarOpen(true);
  }

  function selectDate(key) {
    setDateKey(key);
    setSlot(null);
    setCalendarOpen(false);
    clearBookingConflict();
  }

  function changeMonth(delta) {
    let month = calendarMonth + delta;
    let year = calendarYear;
    if (month < 0) { month = 11; year -= 1; }
    if (month > 11) { month = 0; year += 1; }
    setCalendarMonth(month);
    setCalendarYear(year);
  }

  function selectSlot(time) {
    setSlot(time);
    clearBookingConflict();
  }

  async function handleConfirm() {
    if (!allDone || isBooking) return;
    const selectedDoctor = doctors.find((d) => d._id === doctorId);
    const selectedService = services.find((s) => s._id === serviceId);

    const result = await createAppointment({ doctorId, serviceId, date: dateKey, timeSlot: slot });

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/booking/confirmation', {
        state: {
          doctorName: selectedDoctor?.name,
          serviceName: selectedService?.name,
          dateKey,
          timeSlot: slot,
        },
      });
      return;
    }

    if (result.payload?.status === 409) {
      setSlot(null);
      fetchAvailableSlots({ doctorId, serviceId, date: dateKey });
    }
  }

  const cells = buildCalendarCells({ year: calendarYear, monthIndex: calendarMonth, selectedKey: dateKey, today, onSelect: selectDate });

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <PatientNavbar />

      <main className="mx-auto w-full max-w-[800px] flex-1 box-border px-5 pt-5 pb-[120px] sm:px-8 sm:pt-8 lg:px-12 lg:pt-12">
        <div className="mb-8">
          <h1 className="m-0 mb-1.5 text-[1.75rem] font-bold leading-[1.3] tracking-tight text-ink">Book an appointment</h1>
          <p className="m-0 text-[0.9375rem] leading-normal text-ink-secondary">Pick a doctor, service, and time that works for you.</p>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-center">
            {doneFlags.map((done, i) => {
              const current = i === currentStepIdx;
              const circleClass = done ? 'bg-brand text-white' : current ? 'bg-step-current-bg text-brand' : 'bg-step-upcoming-bg text-ink-tertiary';
              const lineClass = done ? 'bg-brand' : 'bg-border';
              return (
                <div key={i} className="flex items-center">
                  <div className={`flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200 sm:h-7 sm:w-7 ${circleClass}`}>
                    {i + 1}
                  </div>
                  {i < 3 && <div className={`h-0.5 w-6 rounded-sm sm:w-10 ${lineClass}`} />}
                </div>
              );
            })}
          </div>
          <div className="text-center text-[0.8125rem] font-bold text-brand">
            Step {currentStepIdx + 1} of 4: {STEP_NAMES[currentStepIdx]}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <section className="rounded-2xl border border-border bg-surface p-6">
            <div className="mb-3.5 text-base font-bold text-ink">1. Select a doctor</div>
            <div className="mb-3.5">
              <Input
                placeholder="Search doctors by name or specialty"
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
              {filteredDoctors.map((doc) => (
                <div
                  key={doc._id}
                  onClick={() => selectDoctor(doc._id)}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border-[1.5px] p-3.5 transition-colors duration-150 ${
                    doctorId === doc._id ? 'border-brand bg-brand-subtle' : 'border-border bg-surface'
                  }`}
                >
                  <DoctorAvatar initials={getInitials(doc.name)} size={44} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-ink">{doc.name}</div>
                    <div className="text-[0.8125rem] text-ink-secondary">{doc.specialization || 'General dentistry'}</div>
                  </div>
                </div>
              ))}
            </div>
            {!isLoadingCatalog && filteredDoctors.length === 0 && (
              <p className="m-0 mt-1 text-sm text-ink-secondary">No doctors match your search.</p>
            )}
          </section>

          <section className={`rounded-2xl border border-border bg-surface p-6 transition-opacity duration-200 ${doctorPicked ? 'opacity-100' : 'pointer-events-none opacity-45'}`}>
            <div className="mb-3.5 text-base font-bold text-ink">2. Select a service</div>
            <div className="flex flex-wrap gap-2.5">
              {services.map((svc) => (
                <button
                  key={svc._id}
                  type="button"
                  onClick={() => selectService(svc._id)}
                  className={`rounded-full border-[1.5px] px-[18px] py-2.5 text-sm font-semibold transition-colors duration-150 ${
                    serviceId === svc._id ? 'border-brand bg-brand text-white' : 'border-border bg-surface text-ink'
                  }`}
                >
                  {svc.name}
                </button>
              ))}
            </div>
          </section>

          <section className={`rounded-2xl border border-border bg-surface p-6 transition-opacity duration-200 ${servicePicked ? 'opacity-100' : 'pointer-events-none opacity-45'}`}>
            <div className="mb-3.5 text-base font-bold text-ink">3. Select a date</div>
            <button
              type="button"
              onClick={openCalendar}
              className="flex w-full items-center justify-between rounded-xl border-[1.5px] border-border bg-surface px-4 py-3 text-[0.9375rem] font-semibold text-ink transition-colors duration-150 hover:border-brand"
            >
              <span>{dateKey ? formatDateLabel(dateKey) : 'Choose a date'}</span>
              <span className="text-base text-ink-secondary" aria-hidden="true">📅</span>
            </button>
          </section>

          {calendarOpen && (
            <div
              onClick={() => setCalendarOpen(false)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(14%_0.006_90_/_0.42)] p-4"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[360px] rounded-[20px] bg-surface p-5 shadow-[0_24px_60px_oklch(22%_0.05_265_/_0.22)]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => changeMonth(-1)}
                    className="h-8 w-8 rounded-[10px] border-[1.5px] border-border bg-surface text-base font-bold text-ink hover:bg-neutral-hover"
                  >
                    ‹
                  </button>
                  <span className="text-[0.9375rem] font-bold text-ink">{monthLabel}</span>
                  <button
                    type="button"
                    onClick={() => changeMonth(1)}
                    className="h-8 w-8 rounded-[10px] border-[1.5px] border-border bg-surface text-base font-bold text-ink hover:bg-neutral-hover"
                  >
                    ›
                  </button>
                </div>
                <div className="mb-1.5 grid grid-cols-7 gap-1">
                  {WEEKDAY_LABELS.map((wd, i) => (
                    <div key={i} className="text-center text-[0.6875rem] font-semibold text-ink-tertiary">{wd}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {cells.map((cell) => (
                    <button
                      key={cell.key}
                      type="button"
                      disabled={cell.disabled}
                      onClick={cell.select}
                      className={`aspect-square min-h-[38px] rounded-[10px] border-[1.5px] text-[0.8125rem] font-semibold transition-all duration-150 ${cell.visible ? 'visible' : 'invisible'} ${cell.className}`}
                    >
                      {cell.day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <section className={`rounded-2xl border border-border bg-surface p-6 transition-opacity duration-200 ${datePicked ? 'opacity-100' : 'pointer-events-none opacity-45'}`}>
            <div className="mb-3.5 flex items-center justify-between">
              <div className="text-base font-bold text-ink">4. Select a time</div>
              {isLoadingSlots && <span className="text-xs font-medium text-ink-tertiary">Checking availability…</span>}
            </div>

            {isLoadingSlots && (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2.5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[42px] animate-shimmer rounded-full bg-[length:400px_100%] bg-[linear-gradient(90deg,var(--color-shimmer-from)_25%,var(--color-shimmer-via)_37%,var(--color-shimmer-from)_63%)]"
                  />
                ))}
              </div>
            )}

            {bookingConflict && (
              <div className="mb-3.5 flex animate-fade-in-up items-start gap-3 rounded-xl border border-notice-border bg-notice-bg px-4 py-3.5">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-notice-icon-bg text-[0.9375rem]" aria-hidden="true">🕐</span>
                <div>
                  <div className="mb-0.5 text-sm font-bold text-notice-title">That slot was just booked</div>
                  <div className="text-[0.8125rem] leading-snug text-notice-text">Someone else grabbed this time first — pick another below.</div>
                </div>
              </div>
            )}

            {!isLoadingSlots && (
              slots.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2.5">
                  {slots.map((time, i) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => selectSlot(time)}
                      style={{ animationDelay: `${i * 30}ms` }}
                      className={`animate-chip-in rounded-full border-[1.5px] px-2 py-[11px] text-[0.8125rem] font-semibold transition-all duration-150 ${
                        slot === time ? 'border-accent bg-accent text-accent-ink' : 'border-border bg-surface text-ink'
                      }`}
                    >
                      {formatTimeLabel(time)}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="m-0 text-sm text-ink-secondary">No times available on this day — try another date.</p>
              )
            )}
          </section>
        </div>
      </main>

      <div className="sticky bottom-0 flex justify-center border-t border-border bg-[oklch(99%_0.002_250_/_0.92)] px-5 py-4 backdrop-blur-sm sm:px-8">
        <div className="flex w-full max-w-[800px] flex-col items-end gap-2">
          {bookingError && !bookingConflict && (
            <div className="w-full">
              <FormAlert>{bookingError}</FormAlert>
            </div>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!allDone || isBooking}
            className={`flex items-center gap-2.5 rounded-full px-8 py-3.5 text-[0.9375rem] font-bold text-white transition-colors duration-150 active:scale-[0.98] ${
              allDone ? 'cursor-pointer bg-accent hover:bg-accent-hover' : 'cursor-not-allowed bg-disabled-bg'
            }`}
          >
            {isBooking ? (
              <>
                <span className="h-4 w-4 animate-spin-fast rounded-full border-2 border-white/35 border-t-white" />
                <span>Confirming…</span>
              </>
            ) : (
              <span>Confirm booking</span>
            )}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
