import { useApiCall } from "../../Utils/ApiNetwork/apiCall"

/*
In your useFetchUserWorkspaces hook,
if the only operations within the try block are to make an API call and return the response,
and in the catch block you're simply re-throwing the error without any additional handling,
then the try-catch block is not strictly necessary in this hook.
Since you're handling errors in the useWorkspaceViewModel hook,
you can streamline useFetchUserWorkspaces like this:
*/

export const useFetchUserWorkspaces = () => {
    const { apiCall, isLoading, error } = useApiCall()

    const fetchWorkspacesByUserId = (_id) => {
        return apiCall({
            path: `/api/v1/workspace-by-user-id?userId=${_id}`
        });
    }

    return { fetchWorkspacesByUserId, isLoading, error }
}
