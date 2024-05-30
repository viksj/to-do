import React from 'react';
import { createRoot } from 'react-dom/client'; // Importing createRoot from 'react-dom' is sufficient
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from './app';
// Remove redundant import of ReactDOM

export default function App() {
  return (
	<BrowserRouter>
		<Routes>
			<Route path='/' element={<Index />} />
		</Routes>
	</BrowserRouter>
  );
}

const root = document.getElementById('app');

// Checking if 'app' element exists before rendering the component
if (root) {
  createRoot(root).render(<App />);
}