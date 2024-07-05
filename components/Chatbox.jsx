import { format } from "date-fns";
import { useRouter } from "next/navigation";

const Chatbox = ({ chat, currentUser, currentChatId }) => {
  const otherMembers = chat?.members?.filter(
    (member) => member._id !== currentUser._id
  );
  const lastMessage =
    chat?.messages?.length > 0 && chat?.messages[chat?.messages.length - 1];

  const seen = lastMessage?.seenBy?.find(
    (member) => member?._id === currentUser?._id
  );

  const router = useRouter();
  return (
    <div
      className={`chat-box ${currentChatId === chat?._id ? "bg-blue-2" : ""}`}
      onClick={() => router.push(`/chats/${chat?._id}`)}
    >
      <div className="chat-info">
        {chat?.isGroup ? (
          <img
            src={chat?.groupPhoto || "/assets/group.png"}
            alt="groupPhoto"
            className="profilePhoto"
          />
        ) : (
          <img
            src={otherMembers[0].profileImage || "/assets/person.jpg"}
            alt="profile-Photo"
            className="profilePhoto"
          />
        )}
        <div className="flex flex-col gap-1">
          {chat?.isGroup ? (
            <p className="text-base-bold">{chat?.name}</p>
          ) : (
            <p className="text-base-bold">{otherMembers[0]?.username}</p>
          )}
          {!lastMessage && <p className="text-small-bold">Started Chat</p>}

          {lastMessage?.photo ? (
            lastMessage?.sender?._id === currentUser?._id ? (
              <p className="text-small-medium text-grey-3">You Sent a Photo</p>
            ) : (
              <p
                className={`${
                  seen ? "text-small-medium text-grey-3" : "text-small-bold"
                }`}
              >
                Received a Photo
              </p>
            )
          ) : (
            <p
              className={`last-message ${
                seen ? "text-small-medium text-grey-3" : "text-small-bold"
              }`}
            >
              {lastMessage?.text}
            </p>
          )}
        </div>
      </div>
      <div>
        <p className="text-base-light text-grey-1">
          {!lastMessage
            ? format(new Date(chat?.createdAt), "p")
            : format(new Date(chat?.lastMessageAt), "p")}
        </p>
      </div>
    </div>
  );
};

export default Chatbox;
