import { ID } from "appwrite";

import { INewUser } from "@/types";
import { account, avatars, databases, appwriteConfig } from "./config";

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        )

        if (!newAccount) throw Error;
        
        const avatarUrl = avatars.getInitials(user.name);
        
        const newUser = await saveUserToDb({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email, 
            username: user.username,
            imageUrl: avatarUrl
        });

        return newUser;
    } catch(error) {
        return error
    }
}

export async function saveUserToDb (user: {
    accountId: string;
    name: string;
    email: string;
    username?: string;
    imageUrl: URL;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        )

        return newUser;
        
    }
    catch(e) {
        console.log(e)
    }
}