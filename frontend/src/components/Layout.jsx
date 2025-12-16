import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import ChatWindow from './ChatWindow'
import ChatList from './ChatList'
import { getAllUsers } from '../services/user.service'
import { useDispatch, useSelector } from 'react-redux'
import { setAllUsers } from '../redux/features/layoutSlice'

const Layout = () => {

  const {allUser} = useSelector((state)=> state.layout)
  
  let dispatch = useDispatch()

  useEffect(()=>{
      const getUsers = async ()=>{
        try {
          let response = await getAllUsers()
          if (response.status === "success") {
            dispatch(setAllUsers(response.data))
          }
        } catch (error) {
          console.error(error)
        }
      }
      getUsers()
  },[])
    
  return (
    <>
            <ChatList contacts={allUser} />
          </>
  )
}

export default Layout