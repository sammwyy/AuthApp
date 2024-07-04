import useMediaQuery from "./use-media-query";

const useMobile = () => {
  return useMediaQuery("screen and (max-width: 700px)");
};

export default useMobile;
