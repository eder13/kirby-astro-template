import { type DefaultResponse } from "./default-response";

export interface AboutResponse extends DefaultResponse {
    page: {
        text: {
            value: string;
        };
    };
}
