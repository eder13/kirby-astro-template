import { type DefaultResponse } from "./default-response";

export interface HomeResponse extends DefaultResponse {
    page: {
        headline: {
            value: string;
        };
        text: {
            value: string;
        };
    };
}
