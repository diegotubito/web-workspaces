import { useApiCall } from "../../Utils/apiCall"

export const useLoginRepository = () => {
    const {apiCall, error, isLoading} = useApiCall()

    const doLogin = (email, password) => {
        const body = {
            email,
            password
        }

        return apiCall({path: '/api/v1/login', method: 'POST', body: body})
    }

    return {isLoading, error, doLogin}
}