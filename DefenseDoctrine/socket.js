import {io} from "socket.io-client"
const apiUrl = import.meta.env.VITE_API_URL;
const socket=io(`${apiUrl}`,{
    withCredentials:true,
    autoConnect:false
});
export default socket;