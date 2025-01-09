
import { loginSchema } from "@/schema/loginSchema";
import { registerSchema } from "@/schema/registerSchema";
import { ILogin, IOtherUser, IProfile } from "@/types/auth";
import axios from "axios";
import { z } from "zod";
import { BASE_URL } from "@/constants/baseUrl";

export default class AuthService {
    static async registerService(data: z.infer<typeof registerSchema>) {
        const response = await axios.post(`${BASE_URL}/auth/register`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    }
    static async loginService(data: z.infer<typeof loginSchema>): Promise<ILogin> {
        const response = await axios.post(`${BASE_URL}/auth/login`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    }
    static async profileService(token: string): Promise<IProfile>{
        const response = await axios.get(`${BASE_URL}/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    }
    static async OtherUserDataService(token: string): Promise<IOtherUser[]> {
        const response = await axios.get(`${BASE_URL}/auth/other-user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data;
    }
}