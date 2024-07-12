import React from "react";
import background from "/landing_vid.mp4";

const VideoBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute top-1/2 left-1/2 w-full h-full object-cover transform -translate-x-1/2 -translate-y-1/2 z-[-1]"
      >
        <source src={background} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0"></div>
    </div>
  );
};

export default VideoBackground;
