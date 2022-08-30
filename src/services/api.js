import axios from "axios"
const instance = axios.create({
    baseURL: "http://188.127.224.195:8081",
    headers: {
        "Content-Type": "application/json",
    },
})
export default instance