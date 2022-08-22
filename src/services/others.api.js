import axios from "axios"

export const daDataInstance = axios.create({
    baseURL: "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Token 3bcf46707666230b2dd8f40f4da779bb6b36bd1d"
    },
})

export const itSoftInstance = axios.create({
    baseURL: "https://egrul.itsoft.ru/short_data/?"
})
