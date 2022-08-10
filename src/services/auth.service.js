import axios from 'axios';

// const AUTH_URL = 'http://localhost:8081/auth/';
const AUTH_URL = 'http://194.87.238.214:80811/auth/'

class AuthService {
    login(user) {
        return axios
            .post(AUTH_URL + 'signin', {
                username: user.username,
                password: user.password
            })
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data;
            });
    }
    logout() {
        localStorage.removeItem('user');
    }
    register(user) {
        return axios.post(AUTH_URL + 'signup', {
            username: user.username,
            email: user.email,
            password: user.password
        });
    }
}
export default new AuthService();