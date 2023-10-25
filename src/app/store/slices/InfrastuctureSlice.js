// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

// export const getInfra = createAsyncThunk('getInfra', async () => {
//     // const sessionApi = { url: 'session/session-list', body: undefined }
//     // const classApi = { url: 'class/class-list', body: undefined }
//     // const section = { url: 'section/section-list', body: undefined }
//     // const subjects = { url: 'section/', body: undefined }
//     // initialState: {
//     //     sessions: [],
//     //         classes: [],
//     //             sections: [],
//     //                 teachers: [],
//     //                     users: [],
//     //                         subjects: []
//     // },
// })

const InfrastructureSlice = createSlice({
    name: 'infrasturcture',
    initialState: {
        sessions: [{ id: 1, session: '2021-22' }, { id: 2, session: '2022-23' },],
        classAndSection: [],
        classes: [],
        sections: [],
        teachers: [],
        users: [],
        school: [],
        subjects: [],
        studentDetails: []
    },

    reducers: {
        setRSessions(state, action) {
            state.sessions = action.payload
        },
        setRClasses(state, action) {
            state.classes = action.payload
        },
        setRClassAndSection(state, action) {
            state.classAndSection = action.payload
        },
        setRSections(state, action) {
            state.sections = action.payload
        },
        setRSubjects(state, action) {
            state.subjects = action.payload
        },
        setRTeachers(state, action) {
            state.teachers = action.payload
        },
        setRSchool(state, action) {
            state.school = action.payload
        },
        setRStudentDetails(state, action) {
            state.studentDetails = action.payload
        }
    },
    extraReducers: (builder) => {

    }
})
export const { setRSections, setRSessions, setRSubjects, setRClasses, setRTeachers, setRSchool, setRClassAndSection, setRStudentDetails } = InfrastructureSlice.actions
export default InfrastructureSlice.reducer