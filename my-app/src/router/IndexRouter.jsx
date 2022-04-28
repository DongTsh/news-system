import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Login from '../page/Login/Login'
import NewsSandBox from '../page/NewsSandBox/NewsSandBox'

export default function IndexRouter() {



	return (
		<Routes>
			<Route path='/login' element={<Login />}/>
			<Route path='*' element={
				localStorage.getItem('token') ?
				<NewsSandBox /> :
				<Navigate to='/login' />}
			/>
		</Routes>
	)
}
