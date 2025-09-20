import {io} from 'socket.io-client'
export const useWebSocket = () => {
    return io(process.env.NEXT_PUBLIC_API_URL)
}