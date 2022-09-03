export const status_message = {
    namespaced: true,

    state: {
        haveError: null,
        message: null,
        active: false,
    },

    getters: {
        haveError: state => {
            return state.status
        },
        message: state => {
            return state.message
        },
        active: state => {
            return state.active
        }
    },

    mutations: {
        setHaveError: (state, payload) => {
            state.status = payload
        },
        setMessage: (state, payload) => {
            state.message = payload
        },
        setActive: (state, payload) => {
            state.active = payload
        },

        setAcceptLoading: (state, payload) => {
            state.acceptLoading = payload
        },
    },

    actions: {

    }
}