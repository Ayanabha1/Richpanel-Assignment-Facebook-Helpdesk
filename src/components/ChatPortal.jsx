import React, { useEffect, useRef, useState } from "react";
import { Menu, RotateCw, SendHorizontal, ChevronDown } from "lucide-react";
import Card from "./CommonComponents/Card";
import ProfileImage from "../assets/user.png";
import { Api, GraphApi } from "../Api/Axios";
import { getDate, getDuration, getTime, showError } from "../lib/utils";
import { useLoader } from "../hooks/loader";
import CustomerInformation from "./CustomerInformation";
import Button from "./CommonComponents/Button";
import axios from "axios";

const SelfMessage = ({ chat }) => {
  return (
    <div className="text-black text-left ml-auto p-2 flex flex-col items-end w-full">
      {/* Chats will go here */}
      <div className="flex gap-4 justify-end">
        <div className="flex flex-col gap-4  items-end max-w-[60%]">
          {chat?.messages?.map((mess, j) => (
            <Card key={j} className="py-2 px-4 shadow-sm">
              {mess}
            </Card>
          ))}
        </div>
        <div className="mt-auto">
          <img alt="user" src={ProfileImage} className="h-10 w-10" />
        </div>
      </div>
      <div className="flex gap-2 justify-end mr-14 mt-2 ">
        <span className="font-medium">{chat?.sender?.name} •</span>
        <span>
          {getDate(chat?.created_time)}, {getTime(chat?.created_time)}
        </span>
      </div>
    </div>
  );
};
const OthersMessage = ({ chat }) => {
  return (
    <div className="text-black text-left p-2 flex flex-col items-start w-full">
      {/* Chats will go here */}

      <div className="flex gap-4 w-full justify-start">
        <div className="mt-auto">
          <img alt="user" src={ProfileImage} className="h-10 w-10" />
        </div>
        <div className="flex flex-col gap-4 items-start  max-w-[60%]">
          {chat?.messages?.map((mess, j) => (
            <Card key={j} className="py-2 px-4 shadow-sm ">
              {mess}
            </Card>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-end ml-16 mt-2">
        <span className="font-medium">{chat?.sender?.name} •</span>
        <span className="opacity-60">
          {getDate(chat?.created_time)}, {getTime(chat?.created_time)}
        </span>
      </div>
    </div>
  );
};

const ChatDock = ({ chat }) => {
  const profileId = localStorage.getItem("FB_PAGE_ID");
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sender, setSender] = useState();
  const [showDonwBtn, setShowDonwBtn] = useState(false);

  const chatBoxRef = useRef();

  const getClientName = () => {
    const profileId = localStorage.getItem("FB_PAGE_ID");
    let senderChats = chat?.filter((c) => c?.sender?.id !== profileId);
    let sender = senderChats[0]?.sender;
    return setSender(sender);
  };

  const changeNewMessage = (e) => {
    setNewMessage(e.target.value);
  };

  const addNewMessage = (data) => {
    let __chats = chat;
    let lastChat = __chats[__chats.length - 1];
    if (lastChat?.sender?.id === data?.sender?.id) {
      lastChat?.messages?.push(data?.message);
      lastChat.created_time = new Date();
      __chats[__chats.length - 1] = lastChat;
    } else {
      __chats.push({
        sender: data?.sender,
        messages: [data?.message],
        created_time: new Date(),
      });
    }
  };

  const sendNewMessage = async () => {
    if (newMessage.trim() === "") {
      return;
    }
    const pageDetails = localStorage.getItem("FB_PAGE_DETAILS");
    setLoading(true);

    try {
      if (!pageDetails || pageDetails === "") {
        throw new Error(
          "Could not find page details ... please reconnect the facebook page"
        );
      }

      const pageDetailsParsed = JSON.parse(pageDetails);
      const pageAccessToken = pageDetailsParsed?.pageAccessToken;
      const pageId = pageDetailsParsed?.id;
      const dataToSend = {
        recipient: { id: sender?.id },
        messaging_type: "RESPONSE",
        message: { text: newMessage.trim() },
      };

      const res = await axios.post(
        `https://graph.facebook.com/v19.0/${pageId}/messages`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${pageAccessToken}`,
          },
        }
      );

      const data = {
        sender: {
          name: pageDetailsParsed.name,
          id: pageDetailsParsed.id,
        },
        message: newMessage,
      };
      // const savedMessageRes = await Api.post(
      //   "/fb/sendMessage",
      //   JSON.stringify(data)
      // );
      addNewMessage(data);
      setNewMessage("");
    } catch (error) {
      setLoading(false);
      const errorCode = error?.response?.data?.error?.code;

      if (errorCode === 190) {
        showError(
          "Page access token has expired please ... reconnect to facebook page"
        );
        return;
      }
      showError(error?.message);
    }
    handleShowBtnClick();
    setLoading(false);
  };

  const handleShowBtnClick = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current?.scrollHeight;
      setShowDonwBtn(false);
    }
  };

  useEffect(() => {
    getClientName();
  }, [chat]);

  return (
    <div className="flex flex-col w-[60%] relative bg-[#F6F6F6]">
      {/* Name of the customer goes here */}
      <div className="flex w-full p-3 border-b border-black">
        <h1 className="text-xl font-semibold opacity-65 ">{sender?.name}</h1>
      </div>

      {/* Chat goes here */}
      <div
        ref={chatBoxRef}
        className="flex flex-col items-start gap-2 pb-20 relative  p-3 overflow-scroll h-[80%]"
      >
        <button
          onClick={handleShowBtnClick}
          className={`fixed left-[50%] translate-x-[-50%] bottom-[80px] rounded-full shadow-[1px_1px_5px_rgba(0,0,0,0.5)] bg-white bg-opacity-50 transition-all duration-300 flex items-center justify-center active:shadow-none ${
            showDonwBtn ? "h-8 w-8 opacity-100" : "h-0 w-0 opacity-50"
          } `}
        >
          <ChevronDown color="rgba(0,0,0,0.6)" />
        </button>
        {chat?.map((data, i) => {
          if (data?.sender?.id === profileId) {
            return <SelfMessage key={i} chat={data} />;
          } else {
            return <OthersMessage key={i} chat={data} />;
          }
        })}
      </div>

      {/* Send message */}
      <form
        className="w-[97%] absolute left-[50%] bottom-5 translate-x-[-50%]"
        onSubmit={(e) => {
          e.preventDefault();
          sendNewMessage();
        }}
      >
        <input
          className="w-full border border-primary rounded-md p-2 "
          placeholder="Message Ayanabha Misra"
          value={newMessage}
          onChange={(e) => {
            changeNewMessage(e);
          }}
        />
        <Button
          className="absolute right-0 top-0"
          type="submit"
          loading={loading}
          disabled={loading}
        >
          <SendHorizontal />
        </Button>
      </form>
    </div>
  );
};

const ChatCustomers = ({ chats, selectAChat }) => {
  const lastMessageTime = (chat) => {
    const lastMessageGroup = chat[chat.length - 1];
    return getDuration(lastMessageGroup?.created_time);
  };

  const getLastMessage = (chat) => {
    const lastMessageGroup = chat[chat.length - 1];
    const lastMessage = lastMessageGroup?.messages.slice(-1);
    return lastMessage;
  };

  const getClientName = (chat) => {
    const profileId = localStorage.getItem("FB_PAGE_ID");
    let senderChats = chat?.filter((c) => c?.sender?.id !== profileId);
    let sender = senderChats[0]?.sender;
    return sender?.name;
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
                  {getClientName(chat)}
                </span>
                <span className="text-sm opacity-70">Facebook DM</span>
              </div>
              <span className="text-sm mb-4 opacity-60">
                {lastMessageTime(chat)}
              </span>
            </div>

            <div className="mr-auto text-left">
              <span className="text-sm opacity-60 text-left">
                {getLastMessage(chat)}
              </span>
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
  const socketRef = useRef();

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

      // console.log(res);

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

      conversations?.forEach((conv) => {
        const data = conv?.data;
        let sortedData = data?.data?.sort(
          (a, b) => new Date(a.created_time) - new Date(b.created_time)
        );

        let __chats = [
          {
            sender: sortedData[0]?.from,
            created_time: sortedData[0]?.created_time,
            messages: [sortedData[0]?.message],
          },
        ];

        sortedData?.forEach((item, i) => {
          if (i > 0) {
            let lastMessage = __chats[__chats.length - 1];
            if (item?.from?.id === lastMessage?.sender?.id) {
              __chats[__chats?.length - 1].messages.push(item?.message);
              __chats[__chats?.length - 1].created_time = item?.created_time;
            } else {
              __chats.push({
                sender: item?.from,
                created_time: item?.created_time,
                messages: [item?.message],
              });
            }
          }
        });
        chatsLocal.push(__chats);
      });
      setChats(chatsLocal);
      // console.log(chatsLocal);
      setSelectedChat(null);
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
    loader.setLoading(true);
    setSelectedChat([]);
    const timeoutId = setTimeout(() => {
      setSelectedChat(chat);
      loader.setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  };

  useEffect(() => {
    getAllMessages();
  }, []);

  const joinChat = (senderId) => {
    const payload = { action: "join-chat", sender: senderId };
    // socketRef.current.send(JSON.stringify(payload));
  };

  useEffect(() => {
    if (selectedChat?.length) {
      let ENDPOINT = import.meta.env.VITE_SOCKET_ENDPOINT;
      // console.log(ENDPOINT);
      let senderId = selectedChat[0]?.sender?.id;
      // console.log(senderId);

      // socketRef.current = new WebSocket(ENDPOINT);
      // socketRef.current.onopen = () => {
      //   joinChat(senderId);
      // };
      // socketRef.current.onmessage = (res) => {
      //   // const payload = JSON.parse(res.data);
      //   // const route = payload.action;
      //   console.log("Message received finally 🥹");
      // };
    }
  }, [selectedChat]);

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
            <CustomerInformation chat={selectedChat} />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ChatPortal;
