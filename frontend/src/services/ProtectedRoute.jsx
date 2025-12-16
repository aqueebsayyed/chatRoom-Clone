import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { data, Navigate, Outlet, useLocation } from "react-router-dom"
import { getProfile } from "./user.service"
import { setUser } from "../redux/features/authSlice"
import Loader from "../utilis/Loader"

export const ProtectedRoute = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const location = useLocation()
  const [isChecking, setIsChecking] = useState(true)
  const dispatch = useDispatch()
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const result = await getProfile()
        if (result?.data) {
          dispatch(setUser(result.data))
        } else {
          dispatch(setUser(null))
        }
      } catch (error) {
        console.error(error)
        dispatch(setUser(null))
      } finally {
        setIsChecking(false)
      }
    }

    verifyAuth()
  }, [dispatch])

  if (isChecking) {
    return <Loader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/user-login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export const PublicRoute = ()=>{
   const { user, isAuthenticated } = useSelector((state) => state.auth)
   if (isAuthenticated) {
        return <Navigate to="/" replace/>
   }
    return <Outlet />
}