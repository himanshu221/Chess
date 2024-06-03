import { useRecoilValue } from "recoil";
import { userAtom } from "../atom/user";
import { AuthUser } from "@chess/commons/consts";


export function useUser() {
    const user = useRecoilValue<AuthUser | null>(userAtom)
    return user
}