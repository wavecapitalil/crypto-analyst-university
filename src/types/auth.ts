export interface StudentUser{
  id:string;
  email:string;
  fullName?:string;
}
export interface StudentSession{
  accessToken:string;
  refreshToken:string;
  expiresAt:number;
  user:StudentUser;
}
export interface StudentProfile{
  userId:string;
  fullName:string;
  email:string;
  role:string;
  createdAt?:string;
  updatedAt?:string;
}
