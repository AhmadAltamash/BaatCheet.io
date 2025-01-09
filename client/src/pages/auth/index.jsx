import Background from '@/assets/login2.png'
import Victory from '@/assets/victory.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store'

const Auth = () => {

  const navigate = useNavigate();
  const { setUserInfo } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const validateSignup = () => {
    if(!email.length){
      toast.error("Email is Required");
      return false
    }
    if(!password.length){
      toast.error("Password is Required");
      return false
    }
    if(password !== confirmPassword){
      toast.error("Passwords do not match");
      return false
    }
    return true;
  }

  const validateLogin = () => {
    if(!email.length){
      toast.error("Email is Required");
      return false
    }
    if(!password.length){
      toast.error("Password is Required");
      return false
    }
    return true;
  }

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
  
        if (response.data.user.id) {
          setUserInfo(response.data.user);
          if (response.data.user.profileSetup) navigate("/chat");
          else navigate("/profile");
        }
      } catch (error) {
        console.error("Login error:", error);
        if (error.response && error.response.status === 401) {
          alert("Invalid email or password.");
        } else {
          alert("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  const handleSubmit = async () => {
    if(validateSignup()){
      const response = await apiClient.post(SIGNUP_ROUTE, { email, password }, {withCredentials: true});

      if(response.status === 201){
        toast("Account Created Successfully");
        setUserInfo(response.data.user)
        navigate('/profile');
      }
    }
  }

  return (
    <div className="h-[100vh] w-[100%] flex items-center justify-center bg-[#1c1d25]">
      <div className="h-[80vh] bg-[#262731] border-2 border-[#1c1d25] text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex items-center justify-center flex-col">
          <div className="flex items-center justify-center">
            <h1 className="text-4xl font-bold md:text-6xl text-white">Welcome</h1>
            <img
              src={Victory}
              alt='victory'
              className='h-[80px] md:h-[100px]'
            />
          </div>
          <p className='capitalize font-medium text-center text-[1.1rem] md:text-xl p-2 text-white'>Fill in the details to get Started with the best Chat application</p>
          <div className='flex items-center justify-center w-full'>
          <Tabs className='w-3/4' defaultValue='login'>

            <TabsList className='bg-transparent rounded-none w-full'>
              <TabsTrigger value='login' className='data-[state=active]:bg-transparent text-white text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300' >Login</TabsTrigger>
              <TabsTrigger value='signup' className='data-[state=active]:bg-transparent text-white text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300'>Signup</TabsTrigger>
            </TabsList>

            <TabsContent value='login' className='flex flex-col gap-5 mt-4'>
              <Input
                placeholder='Email'
                type='email'
                className='rounded-full p-6 focus-visible:outline-purple-400 focus-visible:border-none focus-visible:outline-2 bg-gray-600/40 outline-0 border-none text-white placeholder:text-white'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder='Password'
                type='password'
                className='rounded-full p-6 focus-visible:outline-purple-400 focus-visible:border-none focus-visible:outline-2 bg-gray-600/40 outline-0 border-none text-white placeholder:text-white'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={handleLogin}
              className='rounded-full p-6 bg-purple-500 hover:bg-purple-600'>Login</Button>
            </TabsContent>
            <TabsContent value='signup' className='flex flex-col gap-5 mt-2'>
            <Input
                placeholder='Email'
                type='email'
                className='rounded-full p-6 focus-visible:outline-purple-400 focus-visible:border-none focus-visible:outline-2 bg-gray-600/40 outline-0 border-none text-white placeholder:text-white'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder='Password'
                type='password'
                className='rounded-full p-6 focus-visible:outline-purple-400 focus-visible:border-none focus-visible:outline-2 bg-gray-600/40 outline-0 border-none text-white placeholder:text-white'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                placeholder='Confirm Password'
                type='password'
                className='rounded-full p-6 focus-visible:outline-purple-400 focus-visible:border-none focus-visible:outline-2 bg-gray-600/40 outline-0 border-none text-white placeholder:text-white'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button onClick={handleSubmit}
              className='rounded-full p-6 bg-purple-500 hover:bg-purple-600'>Signup</Button>
            </TabsContent>
          </Tabs>
          </div>
        </div>
        <div className='hidden xl:flex justify-center items-center'>
          <img
            src={Background}
            alt='Background'
            className='h-[500px]'
          />
        </div>
      </div>
    </div>
  )
}

export default Auth
