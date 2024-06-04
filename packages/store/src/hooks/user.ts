import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { userAtom } from "../atom/user";
import { AuthUser } from "@chess/commons/consts";


export function useUser() {
    const user = useRecoilValueLoadable<AuthUser | null>(userAtom)
    return user
}