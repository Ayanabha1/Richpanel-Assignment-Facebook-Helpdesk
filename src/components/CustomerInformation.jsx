import React, { useEffect, useState } from "react";
import UserImageDefault from "../assets/user.png";
import Button from "./CommonComponents/Button";
import { PhoneCall, User } from "lucide-react";
import Card from "./CommonComponents/Card";
import { showError } from "../lib/utils";
import { GraphApi } from "../Api/Axios";
const CustomerInformation = ({ sender }) => {
  const [data, setData] = useState({});
  //   const getProfileData = async () => {
  //     try {
  //       const pageAccessToken = localStorage.getItem("FB_PAGE_ACCESS_TOKEN");
  //       if (!pageAccessToken || pageAccessToken === "") {
  //         throw new Error(
  //           "User access token not found ... please try connecting to a facebook page"
  //         );
  //       }
  //       const res = await GraphApi.get(`/${sender?.id}`, {
  //         params: {
  //           access_token: pageAccessToken,
  //         },
  //         fields: "first_name,last_name,picture,email",
  //       });
  //       setData(res?.data);
  //     } catch (error) {
  //       showError("Could not fetch profile information");
  //     }
  //   };
  //   useEffect(() => {
  //     getProfileData();
  //   }, []);

  return (
    <div className="flex flex-col w-full h-full border-l">
      <div className="flex flex-col gap-2 w-full items-center p-10 border-b">
        <img
          src={UserImageDefault}
          alt="User"
          className="w-20 h-20 items-center"
        />
        <h1 className="text-xl font-medium mt-3">{sender?.name}</h1>
        <div className="flex items-center gap-2 opacity-60">
          <div className="h-2 w-2 bg-black rounded-full"></div>
          <span>Offilne</span>
        </div>
        <div className="flex mt-2 gap-4">
          <Button className="bg-white font-medium border shadow">
            <div className="flex items-center gap-1">
              <PhoneCall className="h-4 w-4" color="black" />{" "}
              <span className="text-black">Call</span>
            </div>
          </Button>
          <Button className="bg-white font-medium border shadow">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" color="black" />{" "}
              <span className="text-black">Profile</span>
            </div>
          </Button>
        </div>
      </div>

      <div className="flex justify-center bg-[#EFF2F7] h-full py-10 px-3">
        <Card className="px-3 py-3 w-full">
          <div className="flex flex-col items-start w-[95%] overflow-hidden">
            <h1 className="text-lg font-medium mb-3">Customer details</h1>
            <div className="flex flex-col w-full">
              <div className="flex justify-between gap-2">
                <span className="opacity-60">Email</span>
                <span className="font-medium">example@gmail.com</span>
              </div>
              <div className="flex w-full justify-between gap-2">
                <span className="opacity-60">First Name</span>
                <span className="font-medium">
                  {sender?.name?.split(" ")[0]}
                </span>
              </div>
              <div className="flex w-full justify-between gap-2">
                <span className="opacity-60">Last Name</span>
                <span className="font-medium">
                  {sender?.name?.split(" ")[1]}
                </span>
              </div>
            </div>
            <a
              target="_blank"
              href={`https://facebook.com/${sender?.id}`}
              className="mt-4 text-[#2E6797] text-lg font-medium"
            >
              View more details
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CustomerInformation;
