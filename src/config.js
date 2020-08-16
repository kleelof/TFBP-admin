const dev = {
    API_URL: "http://localhost:8000",
    OPERATOR_TOKEN: '8efedf49-db0e-4afe-9a96-2989fe599220'
}

const prod = {
    API_URL: "",
    OPERATOR_TOKEN: '8500f3e1-0282-4d09-a752-6756d188f584'
}

export const config = process.env.NODE_ENV === 'development' ? dev : prod;