import axios from 'axios'
import authHeader from './auth-header'

const API_URL = 'http://localhost:8081/api/'
let config = {headers: authHeader()}

class RestService {

    //EmailNewsLetter
    putRecipient(recipient) {
        return axios.put(API_URL + 'recipients', recipient, config)
    }

    deleteRecipient(id) {
        return axios.delete(API_URL + 'recipients/' + id, config)
    }

    getRecipients() {
        return axios.get(API_URL + 'recipients', config)
    }

    getBranches() {
        return axios.get(API_URL + 'branches', config)
    }

    //LoadTables
    getLoadTables() {
        return axios.get(API_URL + 'loadTables', config)
    }

    getLoadTablesSettings() {
        return axios.get(API_URL + 'loadTables/settings', config)
    }

    postLoadTableSettings(userSettings) {
        return axios.post(API_URL + 'loadTables/settings', userSettings, config)
    }


}
export default new RestService();