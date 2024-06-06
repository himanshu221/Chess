import {atom, selector} from 'recoil'
import axios, { get } from 'axios'
import { AuthUser, BACKEND_URL } from '@chess/commons/consts'


export const userAtom = atom({
    key: 'userAtom',
    default: selector({
        key: 'userAtomSelector',
        get: async () => {
   
            try{
                const resp = await axios.get(`${BACKEND_URL}/auth/refresh`,{
                    withCredentials: true
                });
               
                if(resp.status === 200){
                    const userInfo : AuthUser = resp.data
                    return userInfo
                }else{
                    return null;
                }
            }catch(e){
                console.error(e)
            }

            return null;
        }
    })
})