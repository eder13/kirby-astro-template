import CommonConstants from "./../constants/common";

export const navHref = (url: string) => {
    return url.replace(CommonConstants.CMS_PREFIX, "");
};
