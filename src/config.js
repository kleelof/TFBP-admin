const dev = {
    API_URL: "http://localhost:8000",
    OPERATOR_TOKEN: '8efedf49-db0e-4afe-9a96-2989fe599220',
    RESULTS_PER_PAGE: 25,
    UPLOADS_PATH: '/uploads'
}

const prod = {
    API_URL: "https://www.daisychef.com",
    OPERATOR_TOKEN: '8500f3e1-0282-4d09-a752-6756d188f584',
    RESULTS_PER_PAGE: 25,
    UPLOADS_PATH: '/uploads'
}

const test = {
    API_URL: "",
    OPERATOR_TOKEN: '',
    RESULTS_PER_PAGE: 25,
    UPLOADS_PATH: ''
}

export const config = process.env.NODE_ENV === 'development' ? dev : process.env.NODE_ENV === 'test' ? test : prod;