"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const Contacts = () => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");

  const { data: session } = useSession();
  const currentUser = session?.user;
  const getContacts = async () => {
    try {
      const res = await fetch(
        search !== "" ? `/api/users/SearchContact/${search}` : "/api/users"
      );
      const data = await res.json();
      setContacts(data.filter((user) => user._id !== currentUser._id));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser) getContacts();
  }, [currentUser, search]);

  // Select Contact
  const [selectedContacts, setSelectedContacts] = useState([]);
  const isGroup = selectedContacts.length > 1;
  const handleSelect = (contact) => {
    if (selectedContacts.includes(contact)) {
      setSelectedContacts((prevSelectedContacts) =>
        prevSelectedContacts.filter(
          (prevSelectedContact) => prevSelectedContact !== contact
        )
      );
    } else {
      setSelectedContacts((prevSelectedContacts) => [
        ...prevSelectedContacts,
        contact,
      ]);
    }
  };

  const [name, setName] = useState("");

  const router = useRouter();
  //   create chat
  const createChat = async () => {
    const res = await fetch("/api/chats", {
      method: "POST",
      body: JSON.stringify({
        currentUserId: currentUser._id,
        members: selectedContacts.map((contact) => contact._id),
        isGroup,
        name,
      }),
    });
    const chat = await res.json();

    if (res.ok) {
      router.push(`/chats/${chat._id}`);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="create-chat-container">
      <input
        type="text"
        placeholder="Search Contact ..."
        className="input-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="contact-bar">
        <div className="contact-list">
          <p className="text-body-bold">Contacts</p>
          {contacts.map((contact, index) => (
            <div
              className="contact"
              key={index}
              onClick={() => handleSelect(contact)}
            >
              {selectedContacts.find((item) => item === contact) ? (
                <RadioButtonChecked />
              ) : (
                <RadioButtonUnchecked />
              )}
              <img
                src={contact.profileImage || "/assets/person.jpg"}
                alt="profile"
                className="profilePhoto"
              />
              <p className="text-base-bold">{contact.username}</p>
            </div>
          ))}
        </div>
        <div className="create-chat">
          {isGroup && (
            <>
              <div className="flex flex-col gap-1">
                <p className="text-body-bold">Group Chat Name</p>
                <input
                  type="text"
                  placeholder="Enter Group Name"
                  className="input-group-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-body-bold">Memebers</p>
                <div className="flex flex-wrap gap-3">
                  {selectedContacts.map((contact, index) => (
                    <p className="selected-contact" key={index}>
                      {contact.username}
                    </p>
                  ))}
                </div>
              </div>
            </>
          )}
          <button
            className="btn"
            onClick={createChat}
            disabled={selectedContacts.length === 0}
          >
            Start Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
