import { INewUser, SaveUserParams, SignIn } from "@/types";
import { ID } from "appwrite";
import { account, appwriteConfig, avatars, databases } from "./config";

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
