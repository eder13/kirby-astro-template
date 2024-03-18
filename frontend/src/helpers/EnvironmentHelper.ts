import CommonConstants from "./../constants/common";

export default class EnvironmentHelper {
    static getFetchBaseURL(): string {
        const domain = import.meta.env.DOMAIN;

        let protocol = "https";
        if (domain === "localhost") {
            protocol = "http";
        }

        return `${protocol}://${domain}${CommonConstants.CMS_PREFIX}`;
    }
}
