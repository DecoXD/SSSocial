//zod
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { useForm } from "react-hook-form"
//shardcn
import { Button } from "@/components/ui/button"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
  //toast
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
//shared components
import Loader from "@/components/shared/Loader"
import { SigninValidation } from "@/lib/validate"
import { Link, useNavigate } from "react-router-dom"
//react hooks
import { useState } from "react"
//context
import { useUserContext } from "@/context/AuthContext"
//react-query
import {  useSignInAccount } from "@/lib/react-query/queriesAndMutations"





const SignInForm = () => {

  const {toast} = useToast()

  const [tries,setTries] = useState(0)
  //react-query

  const {mutateAsync:signInAccount,isLoading:isSigningIn} = useSignInAccount() //eslint-disable-line

  const navigate = useNavigate()
  //context
  const {checkAuthUser}  = useUserContext()

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email:"",
      password:""
    },
  })

  async function onSubmit(values: z.infer<typeof SigninValidation>) {

    const session = await signInAccount({email:values.email,password:values.password})
    console.log(tries)
    if(!session) {
      setTries(prev => prev >=3?  0 : prev + 1)

        const title = tries < 3? 'Você Errou!' : 'Oh My God Você Errou denovo'

        return toast({className:"bg-indigo-400",
        variant:'destructive',
        title,
        description:'é sério você precisa colocar os dados corretamente',
        action: <ToastAction altText="Try again" >Try again</ToastAction>,
          })
    }
    const isLoggedIn = await checkAuthUser()

    if(isLoggedIn){
      form.reset()
      navigate('/')
    } else{
      return toast({title:'sign-up failed please try again.'})
    }
  }

  return (
      <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
          <img src="/assets/images/logo.svg" alt="logo" />
          <h2 className="h3-bold md:h2-bold">Log in to your account.</h2>
          <p className="text-light-3 small-medium md:base-regular mt-2 text-center">to use SSRH Connection, please enter your account details</p>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full mt-4 ">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem >
                  <FormLabel>Email</FormLabel>
                  <FormControl className="text-dark-1" >
                    <Input placeholder="digite seu email" {...field} type="email"/>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>senha</FormLabel>
                  <FormControl className="text-dark-1">
                    <Input placeholder="digite sua senha" {...field} type="password"/>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="shad-button_primary">
              { isSigningIn? (<div className="flex-center gap-2"> <Loader/> Loading...</div>):'Sign in'}
            </Button>
            <p className="text-small-regular text-light-2 text-center mt-2">
              if you don't have an account <Link className='text-primary-500 text-small-semibold ml-1' to={'/sign-up'}>Sign up</Link>
            </p>
          </form>
            </div>
          </Form>
  )
}

export default SignInForm


