import { connectToDB } from "@mongodb";
import User from "@models/User";

export async function GET(request) {
  try {
    await connectToDB();
    const users = await User.find();
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to fetch all users", { status: 500 });
  }
}
