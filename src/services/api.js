import axios from "axios"
const instance = axios.create({
    // baseURL: "http://localhost:8081",
    baseURL: "http://45.155.207.175:8081",
    headers: {
        "Content-Type": "application/json",
    },
})
export default instance