import { useRecoilValueLoadable } from "recoil";
import { userAtom } from "../atom/user";
import { UserInfo } from "@chess/commons/definition";


export function useUser() {
    const user = useRecoilValueLoadable<UserInfo | null>(userAtom)
    return user
}