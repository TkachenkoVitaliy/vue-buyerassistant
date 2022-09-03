import RestService from '@/services/rest.service'
import store from "@/store/index";

export const factory_files = {
    namespaced: true,

    state: {
        acceptLoading: false,
        multipleLoading: false,
        updated: false,
    },

    getters: {
        acceptLoading: state => {
            return state.acceptLoading
        },
        multipleLoading: state => {
            return state.multipleLoading
        },
        updated: state => {
            return state.updated
        }
    },

    mutations: {
        setAcceptLoading: (state, payload) => {
            state.acceptLoading = payload
        },
        setMultipleLoading: (state, payload) => {
            state.multipleLoading = payload
        },
        setUpdated: (state, payload) => {
            state.updated = payload
        }
    },

    actions: {
        uploadAccept: (context, payload) => {
            return new Promise((resolve, reject) => {
                const formData = new FormData()
                formData.append('mmkAccept', payload, payload.name)
                RestService.postUploadAccept(formData)
                    .then(
                        () => {
                            context.commit('setAcceptLoading', false)
                            store.commit('status_message/setMessage', 'Акцепт успешно загружены')
                            store.commit('status_message/setHaveError', false)
                            store.commit('status_message/setActive', true)
                            resolve()
                        },
                        error => {
                            context.commit('setAcceptLoading', false)
                            store.commit('status_message/setMessage', 'При загрузке акцепта произошла ошибка')
                            store.commit('status_message/setHaveError', true)
                            store.commit('status_message/setActive', true)
                            reject()
                        }
                    ).catch(() => {
                    context.commit('setAcceptLoading', false)
                    store.commit('status_message/setActive', true)
                    store.commit('status_message/setHaveError', true)
                    store.commit('status_message/setMessage', 'При загрузке акцепта произошла ошибка')
                    reject()
                })
            })
        },
        uploadMultipleFiles: (context, payload) => {
            return new Promise((resolve, reject) => {
                RestService.postUploadMultipleFiles(payload)
                    .then(
                        () => {
                            context.commit('setMultipleLoading', false)

                            store.commit('status_message/setMessage', 'Файлы успешно загружены')
                            store.commit('status_message/setHaveError', false)
                            store.commit('status_message/setActive', true)
                            store.commit('factory_files/setUpdated', true)
                            resolve()
                        },
                        error => {
                            context.commit('setMultipleLoading', false)
                            store.commit('status_message/setMessage', 'При загрузке файлов произошла ошибка')
                            store.commit('status_message/setHaveError', true)
                            store.commit('status_message/setActive', true)
                            reject()
                        }
                    ).catch(() => {
                    context.commit('setMultipleLoading', false)
                    store.commit('status_message/setActive', true)
                    store.commit('status_message/setHaveError', true)
                    store.commit('status_message/setMessage', 'При загрузке файлов произошла ошибка')
                    reject()
                })
            })
        }
    }
}