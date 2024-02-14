import dbConnect from "@/lib/database";
import {User} from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
//import { sendEmail } from "@/helpers/mailer";

dbConnect();

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const {username, email, password} = reqBody;

        console.log(reqBody);

        // Check if user already exists
        const user = await User.findOne({email});

        if(user){
            return NextResponse.json({error: "User already exists"}, {status: 400});
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save new user
        const savedUser = await newUser.save();
        console.log(savedUser);

        // Send verification email
        // await sendEmail({email, emailType: "VERIFY", userId: savedUser._id});

        // Return success response
        return NextResponse.json({
            message: "User created successfully",
            success: true,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email
            }
        });
    } catch (error: any) {
        // Return error response
        return NextResponse.json({error: error.message}, {status: 500});
    }
}
