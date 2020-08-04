const dev = {
    API_URL: "http://localhost:8000",
    OPERATOR_TOKEN: 'd7cf3b9fec034a35b7823f5287ff38ad'
}

const prod = {
    API_URL: "",
    OPERATOR_TOKEN: ''
}

export const config = process.env.NODE_ENV === 'development' ? dev : prod;