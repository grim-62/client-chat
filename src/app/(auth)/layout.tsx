'use client'
import { useWebSocket } from "@/hooks/use-web-socket";
import React, { useEffect, useRef } from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  

  useEffect(()=>{
   useWebSocket()
  },[])
  return (
    <div>
      {children}
    </div>
  );
};

export default layout;
