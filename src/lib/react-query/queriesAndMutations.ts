/*eslint-disable*/
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery
} from "@tanstack/react-query"
import { createUserAccount, getRecentPosts, postCreate, signInAccount, signOutAccount } from "../appwrite/api"
import { INewPost, INewUser, SignIn } from "@/types"
import { QUERY_KEYS } from "./queryKeys"



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
export const useSignOutAccount = () =>{
return useMutation({
  mutationFn:signOutAccount
})
}

export const useCreatePost = () =>{
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn:(post:INewPost) => postCreate(post),
    //INVALID TO CURRENT QUERIES AND REFRESH DATABASE
    onSuccess:() =>{
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
      })
    }
  })
}


export const useGetRecentPosts = () =>{
return useQuery({
  queryKey:[QUERY_KEYS.GET_RECENT_POSTS],
  queryFn: getRecentPosts,

})
}
