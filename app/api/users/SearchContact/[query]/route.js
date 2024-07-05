import { connectToDB } from "@mongodb";
import User from "@models/User";

export async function GET(request, { params }) {
  try {
    await connectToDB();
    const { query } = params;
    const searchContact = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });

    return new Response(JSON.stringify(searchContact), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to search contact", { status: 500 });
  }
}
