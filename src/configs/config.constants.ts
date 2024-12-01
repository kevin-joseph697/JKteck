import * as dotenv from 'dotenv'
dotenv.config()
export const appConfig = {
    secret : process.env.SECRET || 'KevinJoseph',
    expiresIn : process.env.EXPIRESIN || '24h',
    pythonAPI : process.env.PYTHONAPI || 'http://localhost:5000'
}
export enum UserRole {
    Admin = "Admin",
    Editor = "Editor",
    Viewer = "Viewer"
}

