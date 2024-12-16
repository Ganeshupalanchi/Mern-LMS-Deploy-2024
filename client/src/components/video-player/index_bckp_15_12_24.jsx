import React from "react";
import ReactPlayer from "react-player";

export default function VideoPlayer({ width = "100%", height = "100%", url }) {
  return (
    <div className="" style={{ width, height }}>
      <ReactPlayer url={url} width={"100%"} height={"100%"} controls={true} />
    </div>
  );
}
