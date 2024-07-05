import Chat from "@models/Chat";
import { connectToDB } from "@mongodb";
import User from "@models/User";
import Message from "@models/Message";
export async function GET(request, { params }) {
  try {
    await connectToDB();

    const { userId } = params;

    const allChats = await Chat.find({ members: userId })
      .sort({ lastMessageAt: -1 })
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

    return new Response(JSON.stringify(allChats), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to fetch all chats", { status: 500 });
  }
}
