import React, { useEffect, useState } from "react";
import { Menu, RotateCw } from "lucide-react";
import Card from "./CommonComponents/Card";
import ProfileImage from "../assets/user.png";
import { GraphApi } from "../Api/Axios";
import { getDate, getDuration, getTime, showError } from "../lib/utils";
import { useLoader } from "../hooks/loader";
import CustomerInformation from "./CustomerInformation";

const SelfMessage = ({ chat }) => {
  return (
    <div className="text-black ml-auto p-2 flex flex-col">
      {/* Chats will go here */}
      <div className="flex gap-4">
        <div className="flex flex-col gap-4 items-end">
          {chat?.messages?.map((mess, j) => (
            <Card className="py-2 px-4 shadow-sm">{mess}</Card>
          ))}
        </div>
        <div className="mt-auto">
          <img alt="user" src={ProfileImage} className="h-10 w-10" />
        </div>
      </div>
      <div className="flex gap-2 justify-end mr-14 mt-2">
        <span>{chat?.sender} •</span>
        <span>Mar 05, 2:22 AM</span>
      </div>
    </div>
  );
};
const OthersMessage = ({ sender, chat }) => {
  return (
    <div className="text-black p-2 flex flex-col items-start">
      {/* Chats will go here */}
      <div className="flex gap-4">
        <div className="mt-auto">
          <img alt="user" src={ProfileImage} className="h-10 w-10" />
        </div>
        <div className="flex flex-col gap-4 items-start">
          {/* {chat?.messages?.map((mess, j) => (
            <Card className="py-2 px-4 shadow-sm">{mess}</Card>
        ))} */}
          <Card className="py-2 px-4 shadow-sm text-left max-w-[50%]">
            {chat?.message}
          </Card>
        </div>
      </div>

      <div className="flex gap-2 justify-end ml-16 mt-2">
        <span className="font-medium">{sender?.name} •</span>
        <span className="opacity-60">
          {getDate(chat?.time)}, {getTime(chat?.time)}
        </span>
      </div>
    </div>
  );
};

const ChatDock = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const profileId = localStorage.getItem("FB_PAGE_ID");
  useEffect(() => {
    console.log(chat);
    setMessages(chat?.messages);
  }, [chat]);

  return (
    <div className="flex flex-col w-[60%] relative bg-[#F6F6F6]">
      {/* Name of the customer goes here */}
      <div className="flex w-full p-3 border-b border-black">
        <h1 className="text-xl font-semibold opacity-65 ">
          {chat?.sender?.name}
        </h1>
      </div>

      {/* Chat goes here */}
      <div className="flex flex-col items-start gap-2 pb-20 relative  p-3 overflow-scroll h-[80%]">
        {messages?.map((data, i) => {
          if (chat?.sender?.id === profileId) {
            return <SelfMessage key={i} chat={data} />;
          } else {
            return <OthersMessage key={i} chat={data} sender={chat?.sender} />;
          }
        })}
      </div>

      {/* Send message */}
      <input
        className="w-[97%] absolute border border-primary rounded-md p-2 left-[50%] bottom-5 translate-x-[-50%]"
        placeholder="Message Ayanabha Misra"
      />
    </div>
  );
};

const ChatCustomers = ({ chats, selectAChat }) => {
  const lastMessageTime = (chat) => {
    const messages = chat?.messages;
    if (messages.length === 0) {
      return 0;
    }
    const lastChat = messages[messages?.length - 1];
    return getDuration(lastChat?.time);
  };

  const getLastMessage = (chat) => {
    const messages = chat?.messages;
    if (messages.length === 0) {
      return 0;
    }
    const lastChat = messages[messages?.length - 1];
    return lastChat?.message;
  };

  return (
    <div className="flex flex-col items-start">
      {chats?.map((chat, i) => {
        return (
          <div
            className="flex flex-col p-4 w-full border-b cursor-pointer  hover:bg-[#F6F6F6] transition-all duration-200"
            key={i}
            onClick={() => {
              selectAChat(chat);
            }}
          >
            <div className="flex w-full items-center gap-3">
              <input type="checkbox" className="h-4 w-4" />
              <div className="flex flex-col items-start w-[80%]">
                <span className="max-w-[100%] overflow-hidden text-left">
                  {chat?.sender?.name}
                </span>
                <span className="text-sm opacity-70">Facebook DM</span>
              </div>
              <span className="text-sm mb-4 opacity-60">
                {lastMessageTime(chat)}
              </span>
            </div>

            <div className="mr-auto">
              <span className="text-sm opacity-60">{getLastMessage(chat)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ChatPortal = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const loader = useLoader();

  const getAllMessages = async () => {
    loader.setLoading(true);
    try {
      //   const pageAccessToken = localStorage.getItem("FB_PAGE_ACCESS_TOKEN");
      const pageDetails = JSON.parse(localStorage.getItem("FB_PAGE_DETAILS"));
      const pageId = pageDetails?.id;
      const pageAccessToken = pageDetails?.pageAccessToken;
      if (!pageDetails || !pageAccessToken || pageAccessToken === "") {
        throw new Error(
          "Page access token not found ... please try reconnecting the page"
        );
      }
      const res = await GraphApi.get(`/${pageId}/conversations`, {
        params: {
          access_token: pageAccessToken,
        },
      });

      let convPromises = res?.data?.data?.map((conv) => {
        return GraphApi.get(`/${conv?.id}/messages`, {
          params: {
            access_token: pageAccessToken,
            fields: "from,message,created_time,email",
          },
        });
      });

      let conversations = await Promise.all(convPromises);
      let chatsLocal = [];
      console.log(JSON.stringify(conversations));

      conversations?.forEach((conv) => {
        const data = conv?.data;
        const personalInfo = data?.data[0]?.from;
        let messages = data?.data?.map((__chat) => {
          return {
            message: __chat?.message,
            time: __chat?.created_time,
            id: __chat?.id,
          };
        });
        chatsLocal.push({ sender: personalInfo, messages });
      });
      setChats(chatsLocal);
    } catch (error) {
      loader.setLoading(false);
      const errorCode = error?.response?.data?.error?.code;
      if (errorCode === 190) {
        showError(
          "Page access token has expired please ... reconnect to facebook page"
        );
        return;
      }
      showError(
        error?.message || "Failed to fetch messages ... please refresh the page"
      );
      return;
    }
    loader.setLoading(false);
  };

  const selectAChat = (chat) => {
    setSelectedChat(chat);
  };

  useEffect(() => {
    getAllMessages();
  }, []);

  return (
    <div className="flex w-full justify-between overflow-hidden">
      {/* Customers will be shown here */}
      <div className="flex flex-col min-w-[180px]  w-[20%] border-r">
        <div className="overflow-hidden border-b border-black flex items-center justify-between p-3 opacity-65 gap-10">
          <div className="flex items-center gap-2 ">
            <Menu className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Conversations</h1>
          </div>
          <RotateCw
            className="h-6 w-6 cursor-pointer"
            onClick={() => {
              getAllMessages();
            }}
          />
        </div>

        <ChatCustomers chats={chats} selectAChat={selectAChat} />
      </div>

      {selectedChat ? (
        <>
          {/* Main chat section */}
          <ChatDock chat={selectedChat} />
          {/* Personal Info */}

          <div className="w-[22%]">
            <CustomerInformation sender={selectedChat?.sender} />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ChatPortal;
