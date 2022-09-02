export const loa = {
    namespaced: true,

    state: {
        letterOfAuthorization: {
            id: null,

            principal: {
                id: null,
                name: null,
                inn: null,
                kpp: null,
                address: null,
                bankAccount: null,
                directorName: null,
                okpo: null
            },

            sellType: null,

            issuedDate: null,

            validUntil: null,

            number: null,

            supplier: {
                id: null,
                supplierName: null
            },

            driver: {
                id: null,
                name: null,
                passportSeries: null,
                passportNumber: null,
                issuedBy: null,
                dateOfIssue: null
            },

            letterRows: [{id:null, nomenclature: null, number: 1}]
        },
    },

    getters: {
        letterOfAuthorization: state => {
            return state.letterOfAuthorization
        },

        id: state => {
            return state.letterOfAuthorization.id
        },

        principal: state => {
            return state.letterOfAuthorization.principal
        },

        sellType: state => {
            return state.letterOfAuthorization.sellType
        },

        issuedDate: state => {
            return state.letterOfAuthorization.issuedDate
        },

        validUntil: state => {
            return state.letterOfAuthorization.validUntil
        },

        number: state => {
            return state.letterOfAuthorization.number
        },

        supplier: state => {
            return state.letterOfAuthorization.supplier
        },

        driver: state => {
            return state.letterOfAuthorization.driver
        },

        letterRows: state => {
            return state.letterOfAuthorization.letterRows
        }
    },

    mutations: {
        setLetterOfAuthorization: (state, payload) => {
            state.letterOfAuthorization = payload
        },

        setId: (state, payload) => {
            state.letterOfAuthorization.id = payload
        },

        setPrincipal: (state, payload) => {
            state.letterOfAuthorization.principal = payload
        },

        setSellType: (state, payload) => {
            state.letterOfAuthorization.sellType = payload
        },

        setIssuedDate: (state, payload) => {
            state.letterOfAuthorization.issuedDate = payload
        },

        setValidUntil: (state, payload) => {
            state.letterOfAuthorization.validUntil = payload
        },

        setNumber: (state, payload) => {
            state.letterOfAuthorization.setNumber = payload
        },

        setSupplier: (state, payload) => {
            state.letterOfAuthorization.supplier = payload
        },

        setDriver: (state, payload) => {
            state.letterOfAuthorization.driver = payload
        },

        setLetterRows: (state, payload) => {
            state.letterOfAuthorization.letterRows = payload
        },
    },

    actions: {
        resetLetterOfAuthorization: (context) => {
            context.commit('setLetterOfAuthorization', {
                id: null,
                principal: {id: null, name: null, inn: null, kpp: null, address: null, bankAccount: null,
                    directorName: null, okpo: null},
                sellType: null,
                issuedDate: null,
                validUntil: null,
                number: null,
                supplier: {id: null, supplierName: null},
                driver: {id: null, name: null, passportSeries: null, passportNumber: null, issuedBy: null,
                    dateOfIssue: null},
                letterRows: [{id:null, nomenclature: null, number: 1}]
            })
            if (context.getters.letterOfAuthorization.issuedDate == null) {
                let currentDate = new Date()
                let day = currentDate.getDate() < 10 ? "0" + currentDate.getDate() : currentDate.getDate()
                let month = (currentDate.getMonth() + 1) < 10 ? "0" + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1
                let year = currentDate.getFullYear()
                context.commit('setIssuedDate', year + "-" + month + "-" + day)
            }
        },

        resetLetterRows: (context) => {
            context.commit('setLetterRows', [{id:null, nomenclature: null, number: 1}])
        }
    }
}