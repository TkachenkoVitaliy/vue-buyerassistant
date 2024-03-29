import api from './api'


class RestService {

    //EmailNewsLetter
    putRecipient(recipient) {
        return api.put('/api/recipients', recipient)
    }

    deleteRecipient(id) {
        return api.delete('/api/recipients/' + id)
    }

    getRecipients() {
        return api.get('/api/recipients')
    }

    getBranches() {
        return api.get('/api/branches')
    }

    sendFiles() {
        return api.get('/api/sendFiles')
    }

    postSendFiles(selectedBranches) {
        return api.post('/api/sendFiles', selectedBranches)
    }

    downloadFiles() {
        return api.get('/api/downloadAllFiles', {responseType: 'blob'})
    }

    postDownloadFiles(selectedBranches) {
        return api.post('/api/downloadAllFiles', selectedBranches, {responseType: 'blob'})
    }

    //LoadTables
    getLoadTables(username) {
        return api.get('/api/loadTables/'+ username)
    }

    getLoadTablesSettings(username) {
        return api.get('/api/loadTables/settings/' + username)
    }

    postLoadTableSettings(userSettings) {
        return api.post('/api/loadTables/settings', userSettings)
    }

    //Settings
    getBranchesSettings() {
        return api.get('/api/branches_settings')
    }

    postBranchesSettings(branchesSettings) {
        return api.post('/api/branches_settings', branchesSettings)
    }

    //UploadAcceptAndShipment
    getProductTypesUndefined() {
        return api.get('/api/productTypes/undefined')
    }

    postProductTypesUndefined(undefinedTypes) {
        return api.post('/api/productTypes/undefined', undefinedTypes)
    }

    getProductGroups() {
        return api.get('/api/productGroups')
    }

    getUndefinedRows() {
        return api.get('/api/undefinedRows')
    }

    postUploadMultipleFiles(formData) {
        return api.post('/api/uploadMultipleFiles', formData)
    }

    postUploadAccept(formData) {
        return api.post('/api/uploadAccept', formData)
    }

    //Orders
    getSpecs() {
        return api.get('/api/specs')
    }

    //LettersOfAuthorization
    downloadXlsLoa(id) {
        return api.get('/api/lettersOfAuthorization/xls/' + id, {responseType: 'blob'})
    }

    downloadPdfLoa(id) {
        return api.get('/api/lettersOfAuthorization/pdf/' + id, {responseType: 'blob'})
    }

    getLettersOfAuthorization() {
        return api.get('/api/lettersOfAuthorization')
    }

    getLettersOfAuthorization(principal_id) {
        return api.get('/api/lettersOfAuthorization', {params: {principal_id: principal_id}})
    }

    postLettersOfAuthorization(data) {
        return api.post('/api/lettersOfAuthorization', data)
    }

    putLettersOfAuthorization(data) {
        return api.put('/api/lettersOfAuthorization', data)
    }

    deleteLettersOfAuthorization(id) {
        return api.delete('/api/lettersOfAuthorization/' + id)
    }

    postArrayLetterRows(data) {
        return api.post('/api/letterRows', data)
    }

    putArrayLetterRows(data) {
        return api.put('/api/letterRows', data)
    }

    getPrincipals() {
        return api.get('/api/principals')
    }

    postPrincipals(data) {
        return api.post('/api/principals', data)
    }

    putPrincipals(data) {
        return api.put('/api/principals', data)
    }

    deletePrincipals(id) {
        return api.delete('/api/principals/' + id)
    }

    getSuppliers() {
        return api.get('/api/suppliers')
    }

    postSuppliers(data) {
        return api.post('/api/suppliers', data)
    }

    putSuppliers(data) {
        return api.put('/api/suppliers', data)
    }

    deleteSuppliers(id) {
        return api.delete('/api/suppliers/' + id)
    }

    getDrivers() {
        return api.get('/api/drivers')
    }

    postDrivers(data) {
        return api.post('/api/drivers', data)
    }

    putDrivers(data) {
        return api.put('/api/drivers', data)
    }

    deleteDrivers(id) {
        return api.delete('/api/drivers/' + id)
    }

    getNomenclatures() {
        return api.get('/api/nomenclatures')
    }

    postNomenclatures(data) {
        return api.post('/api/nomenclatures', data)
    }

    putNomenclatures(data) {
        return api.put('/api/nomenclatures', data)
    }

    deleteNomenclatures(id) {
        return api.delete('/api/nomenclatures/' + id)
    }

    // Principal templates
    postUploadTemplate(formData, inn) {
        return api.post('/api/uploadTemplate/' + inn, formData)
    }

}

export default new RestService()
