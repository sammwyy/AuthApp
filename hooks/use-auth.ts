import { AuthContext } from "@/contexts/auth";
import { useContext } from "react";

const useAuth = () => useContext(AuthContext);

export default useAuth;
