'use server'

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client"


export async function P2PTransfer(to: string, amount: number){

      const session = await getServerSession(authOptions)
      
     if(!session?.user || !session?.user?.id){
          return{
              message: "Unauthenticated user"
          }
      }

     const From = session?.user?.id;
     if(!From){
         return{
            message: "unauthenticated user"
         }
     }
     const ToUser = await prisma.user.findFirst({
        where: {
            number: to,
        }
     })

     if(!ToUser){
        return{
            message: "User not found"
        }
     }

     //funtion to transfer money from user1 to user2
     await prisma.$transaction(async (tx) => {
         const FromBalance = await tx.balance.findFirst({
            where:{
                userId: Number(From)
            }
         })

         if(!FromBalance || FromBalance.amount < amount){
            return{
                message: "Insufficient Balance"
            }
         }
         await new Promise(r => 
             setTimeout(r, 4000)
         )
         await tx.balance.update({
            where: {
                userId: Number(From)
            }, 
            data: {
                 amount : {
                     decrement: amount
                 }
            }
         })

         await tx.balance.update({
            where: {
                userId: Number(ToUser.id)
            }, 
             data: {
                 amount : {
                    increment: amount
                 }
             }
         })

     })

     return {
        message: "Transaction created successfully"
     }

}