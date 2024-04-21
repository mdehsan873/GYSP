import Axios from "axios";
import secureLocalStorage from "react-secure-storage";

const token = secureLocalStorage.getItem('access')

let local = "http://gysp-app-lb-500921687.ap-south-1.elb.amazonaws.com"
let dev = "https://cyber-tutor-x-backend.vercel.app/"
let aws="https://api.gysp.in"
let url = aws;

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
