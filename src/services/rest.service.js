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
        return api.post('http://localhost:8081/api/sendFiles', selectedBranches)
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
    getLettersOfAuthorization() {
        return api.get('/api/lettersOfAuthorization')
    }

    getPrincipals() {
        return api.get('/api/principals')
    }

    getSuppliers() {
        return api.get('/api/suppliers')
    }

    postSuppliers(data) {
        return api.post('/api/suppliers', data)
    }

    getDrivers() {
        return api.get('/api/drivers')
    }

    getNomenclatures() {
        return api.get('api/nomenclatures')
    }

}

export default new RestService()