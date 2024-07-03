import Cookies from 'js-cookie';

export const baseUrl = process.env.NEXT_PUBLIC_API_URL
// export const baseUrl = "https://api.adminorg.reflej.ar/"

export const initialHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': 'Token ' + Cookies.get('token'),
})


