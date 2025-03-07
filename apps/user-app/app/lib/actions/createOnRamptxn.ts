"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";


export async function createOnRampTransation(provider: string, amount: number){
         const session = await getServerSession(authOptions)
         
         if(!session?.user || !session.user.id){
            return{
                message: "Unauthenticated user"
            }
         }
        const Token = (Math.random()*1000).toString();
        await prisma.onRampTransaction.create({
             data: {
                 provider,
                 status: "Processing",
                 token: Token,
                 startTime: new Date(),
                 userId: Number(session?.user?.id),
                 amount: amount * 100
             }
        })

        return {
            message: "Transaction created successfully",
            token: Token
        }
        
}