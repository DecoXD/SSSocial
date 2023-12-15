import './globals.css'
import { Routes,Route,Navigate } from 'react-router-dom'

import AuthLayout from './_auth/AuthLayout'
import SignInForm from './_auth/forms/SignInForm'
import SignUpForm from './_auth/forms/SignUpForm'
import RootLayout from './_root/RootLayout'
import { Toaster } from './components/ui/toaster'
import {Home,AllUsers,CreatePost,EditPost,Explore,PostDetails,Profile,Saved,UpdateProfile} from './_root/pages'//eslint-disable-line
import { useUserContext } from './context/AuthContext'

const App = () => {

  const {isAuthenticated} = useUserContext()
  console.log(isAuthenticated,'user')

  return (

    <main className='flex h-screen'>
      <Toaster/>
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout/>}>
          <Route path='/sign-in' element={<SignInForm/>}/>
          <Route path='/sign-up' element={<SignUpForm/>}/>
        </Route>

        {/* private routes */}

        <Route element={isAuthenticated? <RootLayout/> : <Navigate to={'/sign-in'}/>}>
          <Route index element={<Home/>}/>
          <Route path='/explore' element={<Explore/>}/>
          <Route path='/saved' element={<Saved/>}/>
          <Route path='/all-users' element={<AllUsers/>}/>
          <Route path='/create-post' element={<CreatePost/>}/>
          <Route path='/update-post/:id' element={<EditPost/>}/>
          <Route path='/post/:id' element={<PostDetails/>}/>
          <Route path='/profile/:id/*' element={<Profile/>}/>
          <Route path='/update-profile/:id' element={<UpdateProfile/>}/>
        </Route>
      </Routes>
    </main>

  )
}

export default App
