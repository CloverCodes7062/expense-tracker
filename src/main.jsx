import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css';
import './index.css'
import Background from './jsx/Background'
import ExpensesPieChart from './jsx/ExpensesPieChart'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Background>
      <ExpensesPieChart/>
    </Background>
  </React.StrictMode>,
)
