import { createSlice } from '@reduxjs/toolkit'

const interviewSlice = createSlice({
  name: 'interview',
  initialState: {
    sessionId:       null,
    questions:       [],
    currentIndex:    0,
    answers:         [],
    lastEvaluation:  null,
    domain:          null,
    difficulty:      null,
    loading:         false,
    submitting:      false,
    error:           null,
  },
  reducers: {
    setLoading:        (state, action) => { state.loading        = action.payload },
    setSubmitting:     (state, action) => { state.submitting     = action.payload },
    setError:          (state, action) => { state.error          = action.payload },
    setLastEvaluation: (state, action) => { state.lastEvaluation = action.payload },
    startSession: (state, action) => {
      state.sessionId    = action.payload.sessionId
      state.questions    = action.payload.questions
      state.domain       = action.payload.domain
      state.difficulty   = action.payload.difficulty
      state.currentIndex = 0
      state.answers      = []
      state.lastEvaluation = null
    },
    nextQuestion: (state, action) => {
      state.answers.push(action.payload)
      state.currentIndex += 1
      state.lastEvaluation = null
    },
    resetInterview: (state) => {
      state.sessionId      = null
      state.questions      = []
      state.currentIndex   = 0
      state.answers        = []
      state.lastEvaluation = null
      state.domain         = null
      state.difficulty      = null
    },
  },
})

export const {
  setLoading, setSubmitting, setError,
  setLastEvaluation, startSession, nextQuestion, resetInterview
} = interviewSlice.actions

export default interviewSlice.reducer