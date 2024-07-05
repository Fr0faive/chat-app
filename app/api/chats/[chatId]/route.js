import Chat from "@models/Chat";
import Message from "@models/Message";
import User from "@models/User";
import { connectToDB } from "@mongodb";

export async function GET(request, { params }) {
  try {
    await connectToDB();
    const { chatId } = params;
    const chat = await Chat.findById(chatId)
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

    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to fetch all chats", { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    await connectToDB();

    const { chatId } = params;
    const body = await request.json();
    const { currentUserId } = body;

    await Message.updateMany(
      { chat: chatId },
      { $addToSet: { seenBy: currentUserId } },
      { new: true }
    )
      .populate({
        path: "sender seenBy",
        model: User,
      })
      .exec();

    return new Response("Seen all messages by current user", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to update message", { status: 500 });
  }
}
