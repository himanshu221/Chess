import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Landing } from './screens/Landing'
import { Game } from './screens/Game'
import { Login } from './screens/Login'
import { RecoilRoot } from 'recoil'


function App(){
  return (
    <RecoilRoot>
      <Main />
    </RecoilRoot>
  )
}
function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/game/:gameId' element={<Game />}/>
      </Routes>
    </BrowserRouter>    
  )
}

export default App
