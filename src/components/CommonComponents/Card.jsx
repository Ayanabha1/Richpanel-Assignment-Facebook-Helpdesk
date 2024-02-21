import React from "react";

const Card = ({ children }) => {
  return (
    <div className="p-10 px-14 bg-white w-fit h-fit rounded-lg">{children}</div>
  );
};

export default Card;
