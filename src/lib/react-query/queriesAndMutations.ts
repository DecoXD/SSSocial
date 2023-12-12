/*eslint-disable*/
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery
} from "@tanstack/react-query"
import { createUserAccount, signInAccount } from "../appwrite/api"
import { INewUser, SignIn } from "@/types"


export const useCreateUserAccount = () =>{
return useMutation({
  mutationFn:(user:INewUser) =>createUserAccount(user)
})
}
export const useSignInAccount = () =>{
return useMutation({
  mutationFn:(user:SignIn) => signInAccount(user)
})
}
