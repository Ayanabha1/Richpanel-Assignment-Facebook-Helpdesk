import React, { useEffect, useRef, useState } from "react";
import { Menu, RotateCw, SendHorizontal, ChevronDown } from "lucide-react";

import { Api, GraphApi } from "../Api/Axios";
import { getDate, getDuration, getTime, showError } from "../lib/utils";
import { useLoader } from "../hooks/loader";
import CustomerInformation from "./CustomerInformation";
import ChatCustomers from "./ChatCustomers";
import ChatDock from "./ChatDock";

const ChatPortal = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const loader = useLoader();
  const socketRef = useRef();

  const getClientDetails = async (chat) => {
    try {
      const pageDetails = localStorage.getItem("FB_PAGE_DETAILS");
      const pageDetailsParsed = JSON.parse(pageDetails ? pageDetails : "{}");
      if (!pageDetailsParsed.id) {
        throw new Error("Please connect to a facebook page");
      }

      const clientId = chat?.clientId;
      const res = await GraphApi.get(`/${clientId}`, {
        params: {
          access_token: pageDetailsParsed.pageAccessToken,
          fields: "name,first_name,last_name,profile_pic,email",
        },
      });
      const clientDetails = res.data;
      chat.client = clientDetails;
      return chat;
    } catch (error) {
      showError(error?.message);
    }
  };

  const updateChat = (clientId, senderId, message) => {
    console.log("Updating chat");

    const __chats = chats;
    console.log(__chats);
    let targetChat;
    __chats?.forEach((c) => {
      if (c.clientId === clientId) {
        c.messages.push({
          senderId: senderId,
          message: message,
          time: Date.now(),
        });
        targetChat = c;
        targetChat.version = Date.now();
      }
    });
    console.log(__chats);
    if (targetChat.clientId === selectedChat.clientId) {
      setSelectedChat(targetChat);
    }
    setChats([]);
  };

  const getAllMessages = async () => {
    try {
      loader.setLoading(true);
      const pageDetails = localStorage.getItem("FB_PAGE_DETAILS");
      const pageDetailsParsed = JSON.parse(pageDetails ? pageDetails : "{}");
      if (!pageDetailsParsed.id) {
        throw new Error("Please connect to a facebook page");
      }
      const res = await Api.get("/messages/getAllMessages", {
        params: { pageId: pageDetailsParsed.id },
      });

      const allChats = res.data.messages;

      // Fetch client details for each sender
      const allChatsNamedPromises = allChats?.map((chat) => {
        return getClientDetails(chat);
      });

      const __chats = await Promise.all(allChatsNamedPromises);
      setChats(__chats);
      // console.log(__chats);
    } catch (error) {
      loader.setLoading(false);
      showError(error?.message);
      return;
    }
    loader.setLoading(false);
  };
  const selectAChat = (chat) => {
    setSelectedChat(chat);
  };

  // Functions for socket connection and handling receive message

  const joinChat = (pageId) => {
    const payload = { action: "join-chat", pageId: pageId };
    socketRef.current.send(JSON.stringify(payload));
  };

  const handleReceiveMessage = (payload) => {
    console.log("Message received");
    if (!payload.senderId) {
      return;
    }
    const { senderId, pageId, message, created_at } = payload;
    updateChat(senderId, senderId, message);
  };

  const initSocket = () => {
    const ENDPOINT = import.meta.env.VITE_SOCKET_ENDPOINT;
    const __pageDetails = localStorage.getItem("FB_PAGE_DETAILS");
    let pageDetails = {};
    if (__pageDetails && __pageDetails !== "") {
      pageDetails = JSON.parse(__pageDetails);
      const pageId = pageDetails?.id;
      socketRef.current = new WebSocket(ENDPOINT);
      socketRef.current.onopen = () => {
        joinChat(pageId);
      };
      socketRef.current.onmessage = (res) => {
        const payload = JSON.parse(res.data);
        handleReceiveMessage(payload);
      };
    }
  };

  useEffect(() => {
    if (!socketRef.current) {
      initSocket();
    }
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
          <ChatDock chat={selectedChat} updateChat={updateChat} />
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