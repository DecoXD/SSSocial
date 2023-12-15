/*eslint-disable*/
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { PostValidation } from "@/lib/validate"
import { Models } from "appwrite"
import { useCreatePost } from "@/lib/react-query/queriesAndMutations"
import { INewPost } from "@/types"
import { useUserContext } from "@/context/AuthContext"
import { useToast } from "../ui/use-toast"
import { ToastAction } from "../ui/toast"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { Loader } from "lucide-react"

type PostFormProps = {
  post?:Models.Document
}


const PostForm = ({post}:PostFormProps) => { //eslint-disable-line

  //react query mutate clojure to call  function PostCreate from appwrite api
  const {mutateAsync:postCreate,/*isLoading:isCreatingPost */} = useCreatePost()//eslint-disable-line
  const [posting,setPosting] = useState(false)
  //navigate
  const navigate = useNavigate()

  //get auth context
  const {user} = useUserContext()
  const {toast} = useToast()

  //shad-cn config
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post? post?.caption: '',
      file:[],
      location:post?post?.location : '',
      tags:post? post?.tags.join(','):''
    },
  })

  //Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {

    if(posting) return
    const data:INewPost = {userId:user.id,...values }

    setPosting(true)

    const newPost = await postCreate(data)

    setPosting(true)

    if(!newPost) {
      return toast({
        variant:'destructive',
        title:'',
        description:'ih, alguma coisa deu errado, resolve ai, senão, pode me chamar.',
        action: <ToastAction altText="Try again">Try again</ToastAction>
      })
    }
    setPosting(false)
    navigate('/')


  }


  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col max-w-5xl gap-9 w-full" >

        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl className="text-light-2">
                <Textarea className="shad-input " placeholder="discription..." {...field} maxLength={2200} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl className="text-light-2">
                <FileUploader
                fieldChange = {field.onChange}
                mediaUrl = {post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl className="text-light-2">
                <Input type="text" className="shad-input" placeholder="location" {...field} maxLength={2200} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags <span className="small-regular text-light-3">(separated by comma " , ")</span></FormLabel>
              <FormControl className="text-light-2">
                <Input required type="text" className="shad-input" placeholder="Example,Work,Life Style, Happy" {...field} maxLength={2200} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />



        <div className="flex gap-4 items-center justify-end">
        <Button className="shad-button_dark_4 p-6 " type="button">Cancel</Button>
        <Button className="shad-button_primary whitespace-nowrap p-6" type="submit">
          {posting? <Loader/> : 'Submit'}
        </Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm
