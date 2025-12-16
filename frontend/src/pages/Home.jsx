import React, { useEffect } from 'react'
import { getProfile } from '../services/user.service'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../redux/features/authSlice'
import Sidebar from '../components/Sidebar'
import ChatList from '../components/ChatList'
import ChatWindow from '../components/ChatWindow'
import Layout from '../components/Layout'
import { Outlet } from 'react-router-dom'

const Home = () => {
const {user} = useSelector((state)=> state.auth)
const dispatch = useDispatch()


// useEffect(() => {
//   const fetchData = async()=>{
//   const getuser = await getProfile()
//     dispatch(setUser(getuser.data))
//   }
// fetchData()
// }, [])
    


  return (

    <div className="flex h-screen">
       <Sidebar />
          <Outlet/>
          <ChatWindow />

    </div>
  )
}

export default Home