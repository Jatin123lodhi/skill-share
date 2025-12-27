import axios from "axios"

export const extractErrorMessage = (error: unknown): string => {
    if(axios.isAxiosError(error)){
        const data = error?.response?.data as { message?: string; error?: string } | undefined;

        return (
            data?.message ||
            data?.error ||
            error?.response?.statusText ||
            error?.message ||
            "Something went wrong"
        )
    }

    // fallback is not axios error
    return error instanceof Error ? error.message : String(error)

}