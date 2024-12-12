import { useTranslation } from "react-i18next";

const useRTL = () => {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === "ar";
  let direction = isRTL ? "rtl" : "ltr";
  return { isRTL, direction, t };
};

export default useRTL;

//const { isRTL, t, direction }: any = useRTL();
