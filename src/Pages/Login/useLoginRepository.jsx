import { useApiCall } from "../../Utils/ApiNetwork/apiCall"

export const useLoginRepository = () => {
    const {apiCall, error, isLoading} = useApiCall()

    const doLogin = (email, password) => {
        const body = {
            email,
            password
        }

        return apiCall({path: '/api/v1/login', method: 'POST', body: body, isLogin: true})
    }

    return {isLoading, error, doLogin}
}