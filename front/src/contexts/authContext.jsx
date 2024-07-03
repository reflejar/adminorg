"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Cookies from "js-cookie";
import { authService } from "@/redux/services/auth";
import { Service } from "@/redux/services/general";


const setUserDetails = (data) => {
  return {
      user: data.user,
      profile: data.perfil,
      community: data.comunidad.nombre,
      logo: data.comunidad.logo,
      admin_of: data.admin_of,
      afip: data.comunidad.afip
  }
};


export const AuthContext = createContext({
  login: (username, password) => {},
  logout: () => {},
  fetchMe: () => {},
  changeCommunity: (comunidad) => {},
});

export default function AuthContextProvider({children}) {

  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    fetchMe()
  }, [])

  const login = useCallback(async function (username, password) {

    const response = await authService.post('users/login/', {username, password})
    if (response && response.data.access_token) {
        
        const dataUser = {...response.data};
        delete dataUser.access_token
        const currentUser = setUserDetails(dataUser);
        
        Cookies.set('currentUser', JSON.stringify(currentUser));
        Cookies.set('token', response.data.access_token);
        setCurrentUser(currentUser)
        
        return currentUser;
    }

    
  }, []);

  const logout = useCallback(function () {
    Cookies.remove("token");
    Cookies.remove("currentUser");
    setCurrentUser(null)
  }, []);


  const fetchMe = useCallback(function () {
    const cookieUser = Cookies.get('currentUser')
    const currentUser = cookieUser ? JSON.parse(cookieUser) : null
    setCurrentUser(currentUser)
  }, []);


  const changeCommunity = useCallback(async function (comunidad) {


    const response = await Service.post('users/changeCommunity/', {comunidad})
    if (response.status >= 400) throw response;

    if (response && response.data) {
        
        const dataUser = {...response.data};
        const currentUser = setUserDetails(dataUser);
        Cookies.set('currentUser', JSON.stringify(currentUser));
        window.location.reload(false)
    }

  })


  const value = useMemo(
    () => ({
      currentUser,
      login,
      logout,
      fetchMe,
      changeCommunity
    }),
    [currentUser, login, logout, fetchMe, changeCommunity]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}