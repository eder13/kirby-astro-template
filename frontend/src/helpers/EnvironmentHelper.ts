import CommonConstants from "./../constants/common";

export default class EnvironmentHelper {
    static getRootDomain(): string {
        return import.meta.env.DOMAIN;
    }

    static getRootDomainURL(): string {
        const domain = import.meta.env.DOMAIN;

        let protocol = "https";
        if (domain === "localhost") {
            protocol = "http";
        }

        return `${protocol}://${domain}`;
    }

    static getFetchBaseURL(): string {
        return `${this.getRootDomainURL()}${CommonConstants.CMS_PREFIX}`;
    }
}
