import AuthContext from "../context/Auth.jsx";
import { useEffect, useReducer } from "react";
import userReducer from "../reducers/user-reducer.js";
import { useNavigate } from "react-router-dom";
const initialState = {
    isLoggedIn: false,
    user: null
}

const AuthProvider = (props) => {
  const navigate = useNavigate()
  const [userState,userDispatch] = useReducer(userReducer,initialState)
  const handleLogin = (user)=>{
    userDispatch({type:'LOGIN',payload:user})
  }
  const handleLogout = ()=>{
    localStorage.removeItem('token')
    userDispatch({type:'LOGOUT'})
    navigate('/')
  }

  useEffect(()=>{
    (async()=>{
      if(localStorage.getItem('token')){
        const userResponse = await axios.get('http://localhost:2025/api/users/account', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        handleLogin(userResponse.data)
      }
    })();
  })
  return (
    <div>
        <AuthContext.Provider value={{userState,handleLogin,handleLogout}}>
            {props.children}
        </AuthContext.Provider>
    </div>
  )
}

export default AuthProvider