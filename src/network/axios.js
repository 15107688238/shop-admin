import axios from 'axios'

export function request(config){
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:9090/api/private/v1/',
    timeout: 5000
  })

  instance.interceptors.response.use(rep => {
    return rep.data
  })
  
  return instance(config)
}