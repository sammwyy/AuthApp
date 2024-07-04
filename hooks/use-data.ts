import { DataContext } from "@/contexts/data";
import { useContext } from "react";

const useData = () => useContext(DataContext);

export default useData;
