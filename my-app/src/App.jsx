import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import IndexRouter from './router/IndexRouter'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'

import './App.css'

export default function App() {

	return (
		<BrowserRouter>
			<PersistGate loading={null} persistor={persistor}>
				<Provider store={store}>
					<IndexRouter />
				</Provider>
			</PersistGate>
		</BrowserRouter>
	)
}

