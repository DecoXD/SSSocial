import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { SignupValidation } from "@/lib/validate"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"

import { useState } from "react"
//toas
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"





const SignUpForm = () => {

  const {toast} = useToast()

  const [tries,setTries] = useState(0)
  //react-query
  const {mutateAsync:createUserAccount,isLoading:isCreatingUser} = useCreateUserAccount()
  const {mutateAsync:signInAccount,isLoading:isSigningIn} = useSignInAccount() //eslint-disable-line

  const navigate = useNavigate()
  //context
  const {checkAuthUser}  = useUserContext()

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name:'',
      username: "",
      email:"",
      password:""
    },
  })

  async function onSubmit(values: z.infer<typeof SignupValidation>) {

    const newUser =  await createUserAccount(values)
    const session = await signInAccount({email:values.email,password:values.password})



    if(!newUser || !session) {
      setTries(prev => prev <=3? prev + 1 : 3)

        const title = tries < 3? 'Você Errou!' : 'Oh My God Você Errou denovo'

        return toast({
        variant:'destructive',
        title,
        description:'é sério você precisa se cadastrar direito',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
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
          <h2 className="h3-bold md:h2-bold">Create a New Account.</h2>
          <p className="text-light-3 small-medium md:base-regular mt-2 text-center">to use SSRH Connection, please enter your account details</p>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full mt-4 text-dark-1">

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>name</FormLabel>
                    <FormControl>
                      <Input placeholder="digite seu nome" {...field} type="text" />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="digite seu nome de usuário" {...field} type="text"/>
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="digite seu email" {...field} type="email"/>
                    </FormControl>
                    <FormDescription>
                      This isnt your public display email.
                    </FormDescription>
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
                    <FormControl>
                      <Input placeholder="digite sua senha" {...field} type="password"/>
                    </FormControl>
                    <FormDescription>
                      This is your password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="shad-button_primary">
                {isCreatingUser || isSigningIn? (<div className="flex-center gap-2"> <Loader/> Loading...</div>):'Sign up'}
              </Button>
              <p className="text-small-regular text-light-2 text-center mt-2">
               if you have an account <Link className='text-primary-500 text-small-semibold ml-1' to={'/sign-in'}>Sign in</Link>
              </p>
          </form>
            </div>
          </Form>
  )
}

export default SignUpForm
