import axios, { AxiosError } from "axios";

export class ErrorService {

    readonly ERROR_MESSAGE_REGEX: RegExp = /Error:\s(.+?)<br>/;

    async handleError(error: unknown) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            const errorMessageRegexString: string = this.ERROR_MESSAGE_REGEX.source;
            if (axiosError.response) {
                const html: string = axiosError.response.data as string;
                let matches : RegExpMatchArray | null = null;
                if (typeof html === 'string') {
                    matches = html.match(errorMessageRegexString);
                    // proceed with the matches
                } else {
                    // Handle the case where html is not a string
                    console.error(axiosError.response.data);
                }

                let errorMessage = "";
                if (matches && matches.length >= 2) {
                    errorMessage = matches[1];
                } else {
                    errorMessage = error.message;
                }
                throw new Error(errorMessage);
            } else if (axiosError.request) {
                // No response received (e.g., network error)
                console.error(axiosError);
                throw new Error("Unable to connect to server. Please check your internet connection.");
            } else {
                // Other Axios errors (e.g., timeout)
                console.error(axiosError);
                throw new Error("An error occurred while processing your request. Please try again later.");
            }
        } else {
            // Non-Axios errors
            console.error(error);
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }
}

