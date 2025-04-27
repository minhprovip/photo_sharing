const config = {
    development:{
        // The base URL for the API in development mode
        apiUrl: 'http://localhost:8081/api',
    },
    production:{
        // The base URL for the API in production mode
        apiUrl: 'https://api.example.com',
    }
};
export default config.development;
