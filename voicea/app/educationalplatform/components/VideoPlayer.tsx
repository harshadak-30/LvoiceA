import React from "react";

const VideoPlayer = ({ videoUrl, onClose }: { videoUrl: string; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative p-4 bg-white rounded-lg shadow-lg">
        <video
          controls
          autoPlay
          width="700"
          height="400"
          style={{ borderRadius: "10px", background: "black" }}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 text-xl font-bold"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
