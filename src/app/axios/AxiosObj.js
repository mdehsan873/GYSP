import Axios from "axios";
import secureLocalStorage from "react-secure-storage";

const token = secureLocalStorage.getItem('access')

let local = "http://127.0.0.1:8000/"
let dev = "https://cyber-tutor-x-backend.vercel.app/"
let url = dev;

let config = {
  baseURL: url,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
  },
}
export const AxiosNoToken = Axios.create({ baseURL: url})
export const getAxiosWithToken = () => {
  let config = {
    baseURL: url,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
    },
  }
  return Axios.create(config)
}
export const getAxiosWithNoToken = () => {
  let config = {
    baseURL: url,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  return Axios.create(config)
}
export const getAxiosWithToken2 = (token) => {
  let config = {
    baseURL: url,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
  }
  return Axios.create(config)
}
const AxiosObj = Axios.create(config)
export default AxiosObj