import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface Post {
    id: bigint;
    blob: ExternalBlob;
    likes: bigint;
    timestamp: Time;
    caption: string;
}
export interface Profile {
    bio: string;
    dob: string;
    twitter: string;
    instagram: string;
    name: string;
    nationality: string;
    isActive: boolean;
    email: string;
    facebook: string;
    gender: string;
    passwordHash: string;
    posts: Array<Post>;
    profilePicture?: ExternalBlob;
    hobbies: Array<string>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPost(caption: string, blob: ExternalBlob): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    authAddHobby(hobby: string): Promise<void>;
    deletePost(postId: bigint): Promise<void>;
    editPost(postId: bigint, newCaption: string, newBlob: ExternalBlob): Promise<void>;
    getAllHobbies(): Promise<Array<string>>;
    getCallerUserProfile(): Promise<Profile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProfileGrid(user: Principal): Promise<Array<Post>>;
    getUserProfile(user: Principal): Promise<Profile | null>;
    isCallerAdmin(): Promise<boolean>;
    loginWithEmail(email: string, passwordHash: string): Promise<boolean>;
    registerUser(newProfile: Profile): Promise<void>;
    updateCallerProfile(updatedProfile: Profile): Promise<void>;
}
