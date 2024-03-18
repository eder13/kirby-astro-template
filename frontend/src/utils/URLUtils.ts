import CommonConstants from "./../constants/common";

export const href = (url: string) => {
    return url.replace(CommonConstants.CMS_PREFIX, "");
};
