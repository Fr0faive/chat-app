import Message from "@models/Message";
import { connectToDB } from "@mongodb";
import Chat from "@models/Chat";
import User from "@models/User";
import { pusherServer } from "@lib/Pusher";

export async function POST(request) {
  try {
    await connectToDB();
    const body = await request.json();
    const { chatId, currentUserId, text, photo } = body;
    const currentUser = await User.findById(currentUserId);
    const newMessage = await Message.create({
      chat: chatId,
      sender: currentUser,
      text,
      photo,
      seenBy: currentUserId,
    });
    const updateChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { messages: newMessage._id },
      },
      { $set: { lastMessageAt: newMessage.createdAt } },
      {
        new: true,
      }
    )
      .populate({
        path: "members",
        model: Message,
        populate: { path: "sender seenBy", model: "User" },
      })
      .populate({
        path: "members",
        model: "User",
      })
      .exec();

    await pusherServer.trigger(chatId, "new-message", newMessage);

    const lastMessage = updateChat.messages[updateChat.messages.length - 1];
    updateChat.members.forEach(async (member) => {
      try {
        await pusherServer.trigger(member._id.toString(), "update-chat", {
          id: chatId,
          messages: [lastMessage],
        });
      } catch (error) {
        console.log(error);
      }
    });

    return new Response(JSON.stringify(newMessage), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to send message", { status: 500 });
  }
}
