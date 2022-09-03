import RestService from '@/services/rest.service'
import EventBus from "@/common/EventBus";

export const email = {
    namespaced: true,

    state: {
        emailSending: false,
        completedRecipients: []
    },

    getters: {
        emailSending: state => {
            return state.emailSending
        },
        completedRecipients: state => {
            return state.completedRecipients
        }
    },

    mutations: {
        setEmailSending: (state, payload) => {
            state.emailSending = payload
        },
        setCompletedRecipients: (state, payload) => {
            state.completedRecipients = payload
        }
    },

    actions: {
        sendAllEmails: (context) => {
          return new Promise((resolve, reject) => {
              context.commit('setEmailSending', true)
              RestService.sendFiles().then(
                  (response) => {
                      context.commit('setEmailSending', false)
                      resolve(response.data)
                  },
                  error => {
                      context.commit('setEmailSending', false)
                      this.content =
                          (error.response && error.response.data && error.response.data.message) ||
                          error.message ||
                          error.toString();
                      if (error.response && error.response.status === 403) {
                          EventBus.dispatch("logout");
                      }
                      reject(error)
                  }
              )
          })
        },
        sendCheckedEmails: (context, payload) => {
            return new Promise((resolve, reject) => {
                context.commit('setEmailSending', true)
                RestService.postSendFiles(payload).then(
                    (response) => {
                        context.commit('setEmailSending', false)
                        context.commit('setCompletedRecipients', response.data)
                        resolve()
                    },
                    error => {
                        context.commit('setEmailSending', false)
                        this.content =
                            (error.response && error.response.data && error.response.data.message) ||
                            error.message ||
                            error.toString();
                        if (error.response && error.response.status === 403) {
                            EventBus.dispatch("logout");
                        }
                        reject(error)
                    }
                )
            })
        },
    }
}