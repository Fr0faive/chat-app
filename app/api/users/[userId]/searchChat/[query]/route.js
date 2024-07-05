import User from "@models/User";
import { connectToDB } from "@mongodb";
import Chat from "@models/Chat";
import Message from "@models/Message";

export async function GET(request, { params }) {
  try {
    await connectToDB();
    const { userId, query } = params;
    const searchedChats = await Chat.find({
      members: userId,
      name: { $regex: query, $options: "i" },
    })
      .populate({
        path: "members",
        model: User,
      })
      .populate({
        path: "messages",
        model: Message,
        populate: { path: "sender seenBy", model: User },
      })
      .exec();
    return new Response(JSON.stringify(searchedChats), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to fetch all chats", { status: 500 });
  }
}