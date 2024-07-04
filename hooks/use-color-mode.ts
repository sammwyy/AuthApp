import { useContext } from "react";

import { ColorContext } from "@/contexts/color";

const useColorMode = () => useContext(ColorContext);

export default useColorMode;
