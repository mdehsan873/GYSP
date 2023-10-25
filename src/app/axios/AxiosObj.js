import Axios from "axios";
import secureLocalStorage from "react-secure-storage";

const token = secureLocalStorage.getItem('access')

let config = {
  baseURL: 'https://cyber-tutor-x-backend.vercel.app/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
  },
}
export const AxiosNoToken = Axios.create({ baseURL: 'https://cyber-tutor-x-backend.vercel.app/' })
export const getAxiosWithToken = () => {
  let config = {
    baseURL: 'https://cyber-tutor-x-backend.vercel.app/',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
    },
  }
  return Axios.create(config)
}
export const getAxiosWithToken2 = (token) => {
  let config = {
    baseURL: 'https://cyber-tutor-x-backend.vercel.app/',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
  }
  return Axios.create(config)
}
const AxiosObj = Axios.create(config)
export default AxiosObj