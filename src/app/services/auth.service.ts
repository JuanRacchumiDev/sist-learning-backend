import { IAuth } from "../interfaces/Auth/IAuth"
import AuthRepository from "../repositories/Auth/authRepository"

class AuthService {
    async login(data: IAuth) {
        return await AuthRepository.login(data)
    }

    async logout(userId: number) {
        return await AuthRepository.logout(userId)
    }
}

export default new AuthService()