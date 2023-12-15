import { INewPost, INewUser, SaveUserParams, SignIn } from "@/types";
import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases,storage} from "./config"; //eslint-disable-line



export async function createUserAccount(user:INewUser){

  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name,
    )

    if(!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDb({ //eslint-disable-line
      accountid:newAccount.$id,
      name:newAccount.name,
      email:newAccount.email,
      username: user.username,
      imageUrl:avatarUrl
    })

    return newAccount

  } catch (error) {
    console.log(error)
    return error
  }
}


export async function saveUserToDb(user:SaveUserParams){

  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    )

    return newUser
  } catch (error) {
    console.log(error)
  }
}


export async function signInAccount(user:SignIn){
  try {
    const session = await account.createEmailSession(user.email,user.password)

    return session

  } catch (error) {
    console.log(error)
  }
}


export async function getCurrentUser() {
  try {

    const currentAccount = await account.get();
    if(!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountid',currentAccount.$id)])
      //parei aqui
    if(!currentUser) throw Error;


    return currentUser.documents[0]


  } catch (error) {
    console.log(error)
  }
}


export async function signOutAccount() {
  try {
    const session = await account.deleteSession('current')
    return session
  } catch (error) {
    console.log(error)
  }
}


export async function postCreate(post:INewPost) {
  console.log(post)

  try {
    //up data files to storage and get your $id

    const uploadedFile = await uploadFile(post.file[0])

    if(!uploadedFile) throw Error;

    //get image url by preview

    const fileUrl = await getFilePreview(uploadedFile.$id)

    if(!fileUrl){
      const deleteFile =  await deleteIntoStorage(uploadedFile.$id)
      console.log('deletefile',deleteFile)
      throw Error;
    }
    //convert tags in an array
    const tags = post.tags? post.tags : ''
    const tagList = tags?.split(',') || []

    //create post

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator:post.userId,
        caption:post.caption,
        tags:tagList,
        imageUrl:fileUrl,
        imageId:uploadedFile.$id,
        location:post.location? post.location : ''
      }
    )

    if(!newPost){
      const deleteFile =  await deleteIntoStorage(uploadedFile.$id)
      console.log('deletefile',deleteFile)
      throw Error;
    }

    return newPost

  } catch (error) {
    console.log(error)
  }



}


export async function uploadFile(file:File){
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file,
      )
      return uploadedFile
  } catch (error) {
    console.log(error)
  }
}


export async function getFilePreview(fileId:string){
  try {
    const fileUrl = await storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    )

    if(!fileUrl) throw Error;

    return fileUrl
  } catch (error) {
    console.log(error)
  }
}


export async function deleteIntoStorage(fileId:string){
  try {
      await storage.deleteFile(
      appwriteConfig.storageId,
      fileId)

    return {status:'ok'}
  } catch (error) {
      console.log(error)
  }
}


export async function getRecentPosts(){
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc('$createdAt'),Query.limit(20)]
    )

  if(!posts) throw Error;
  return posts
  } catch (error) {
    console.log(error)
  }
}


export async function likePost(postId:string,likesArray:string[]) {
  try {
    const updatedPost  = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes:likesArray
      }
    )
    if (!updatedPost) throw Error;

    return updatedPost
  } catch (error) {
    console.log(error)
  }
}

export async function savePost(postId:string,userId:string) {
  try {
    const savedPost  = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      ID.unique(),
      {
        user:userId,
        post:postId
      }

    )
    if (!savedPost) throw Error;

    return savedPost
  } catch (error) {
    console.log(error)
  }
}


export async function deleteSavedPost(savedRecordId:string) {
  try {
    const deleteSaved  = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      savedRecordId
    )
    if (!deleteSaved) throw Error;

    return {status:'ok'}
  } catch (error) {
    console.log(error)
  }
}
