import axios from 'axios'
import authHeader from './auth-header'

const API_URL = 'http://localhost:8081/api/'

class RestService {
    //TODO
    putRecipient(recipient) {
        return axios.put(API_URL + 'recipients', recipient, {headers: authHeader()})
    }

    deleteRecipient(id) {
        return axios.delete(API_URL + 'recipients/' + id, {headers: authHeader()})
    }

    getRecipients() {
        return axios.get(API_URL + 'recipients', {headers: authHeader()})
    }

    getBranches() {
        return axios.get(API_URL + 'branches', {headers: authHeader()})
    }
    //TODO

}
export default new RestService();