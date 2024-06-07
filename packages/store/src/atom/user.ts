import {atom, selector} from 'recoil'
import axios from 'axios'
import {BACKEND_URL } from '@chess/commons/consts'
import {UserInfo} from '@chess/commons/definition'


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
                    const userInfo : UserInfo = resp.data
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