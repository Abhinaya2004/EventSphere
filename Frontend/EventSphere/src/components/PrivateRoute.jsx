import { Navigate } from "react-router-dom"
import AuthContext from "../context/Auth"
import { useContext } from "react"
const PrivateRoute = (props) => {
  const {userState} = useContext(AuthContext)
  if(userState.isLoggedIn){
    return props.children
  }else{
    return <Navigate to='/login' replace />
  }
}

export default PrivateRoute