import * as z from "zod"

export const SignupValidation = z.object({
  name: z.string().min(2,{message:'Too short'}).max(50,{message:'Too longer'}),
  username: z.string().min(2,{message:'Too short'}).max(50,{message:'Too longer'}),
  password:z.string().min(6,{message:'the password must contain at least 6 characters'}).max(20),
  email:z.string().email({message:'please input a valid email address'}),

})
