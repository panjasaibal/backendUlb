import { PrismaClient } from "@prisma/client";
import { config } from "./config";

class PrismaConnection{
    private static instance: PrismaConnection;
    private readonly prismaClient: PrismaClient;
    private isConnected: boolean = false;

    private constructor(){
        this.prismaClient = new PrismaClient({
            log: config.NODE_ENV === "developemnt"?
            ["query","warn", "error"]:["error"]
        });

    }

    public static getInstance():PrismaConnection{
        if(!this.instance){
            this.instance = new PrismaConnection();
        }
        return this.instance;
    }

    public getClient():PrismaClient{
        return this.prismaClient;
    }

    public async connect():Promise<void>{
        if(this.isConnected) return;
        await this.prismaClient.$connect();

        this.isConnected = true;
    }

    public async disconnect():Promise<void>{
        if(!this.isConnected) return;
        await this.prismaClient.$disconnect();

        this.isConnected = false;
    }
     
}

const prismaConnection = PrismaConnection.getInstance();
const prisma = prismaConnection.getClient();

export { prismaConnection, prisma, PrismaConnection };