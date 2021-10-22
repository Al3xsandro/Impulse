import axios from 'axios';

const api = axios.create({
    baseURL: 'https://nlw-heat.herokuapp.com/'
});

export { api };