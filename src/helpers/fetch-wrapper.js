import { useAuthStore } from '@/stores';

export const fetchWrapper = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE')
};

function request(method) {
    return (url, body) => {
        const requestOptions = {
            method,
            headers: authHeader(url)
        };
        if (body) {
            requestOptions.headers['Content-Type'] = 'application/json';
            requestOptions.body = JSON.stringify(body);
        }
        console.log('>>> requestOptions')
        console.log(requestOptions)
        return fetch(url, requestOptions).then(handleResponse);
    }
}

// helper functions
/*
{
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJib290IiwiaWF0IjoxNzMzMzcxNzM0LCJleHAiOjE4MTk3NzE3MzR9.1Fb7Oo_-Qub5hZEAMVk_CPv7LaqwxNvOr3L4IVO5wbI",
    "tokenType": "Bearer ",
    "username": "boot",
    "role": "ROLE_USER"
}
*/
function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const { user } = useAuthStore();
    const isLoggedIn = !!user?.token;
    const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL); //http://localhost:8080/api
    console.log('>>> isLoggedIn =' + isLoggedIn)
    console.log('>>> isApiUrl = ' + isApiUrl)

    if (isLoggedIn && isApiUrl) {
        const auth_token = { Authorization: `Bearer ${user.token}` }
        console.log(auth_token)
        return auth_token;
    } else {
        return {};
    }
}

async function handleResponse(response) {
    const isJson = response.headers?.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    // check for error response
    if (!response.ok) {
        const { user, logout } = useAuthStore();
        if ([401, 403].includes(response.status) && user) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            logout();
        }

        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
    }
    return data;
}