/*eslint-disable*/
import {
  useQuery,
  useMutation,
  useQueryClient,
  // useInfiniteQuery
} from "@tanstack/react-query"
import { createUserAccount, deleteSavedPost, getRecentPosts, likePost, postCreate, savePost, signInAccount, signOutAccount } from "../appwrite/api"
import { INewPost, INewUser, SignIn } from "@/types"
import { QUERY_KEYS } from "./queryKeys"


type ILikePost = {
  postId:string,
  likesArray:string[]
}


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


export  const useLikePost = () =>{
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn:({postId,likesArray}:ILikePost) =>likePost(postId,likesArray),
    onSuccess:(data) =>{
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_POST_BY_ID,data?.$id]
      })
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  })
}


export  const useSavePost = () =>{
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn:({postId,userId}:{
      postId:string,
      userId:string
    }) =>savePost(postId,userId),
    onSuccess:() =>{
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  })
}


export  const useDeleteSavedPost = () =>{
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn:(savedRecordID:string) => deleteSavedPost(savedRecordID),
    onSuccess:() =>{
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  })
}
