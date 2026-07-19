import axios from "axios";


const api = axios.create({
    baseURL: "/api"
});


export const getTrends = async () => {

    const response = await api.get(
        "/trends"
    );

    console.log(response)
    return response.data;
};