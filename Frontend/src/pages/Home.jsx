import React from "react";
import { PostCard } from "../components/index";
const dummyPost = {
  author: "John Doe",
  authorImage: "", // leave empty to show default icon
  timestamp: "2 hours ago",
  title: "Modern Apartment in City Center",
  location: "Lahore, Pakistan",
  description:
    "This spacious apartment offers a beautiful view of the city skyline with all modern amenities nearby.",
  images: ["https://source.unsplash.com/random/600x400?building"],
  likes: 12,
  dislikes: 1,
  comments: 5,
};

function Home() {
  return (
    <div className="p-2 bg-white/10 ">
      <PostCard post={dummyPost} />
    </div>
  );
}

export default Home;
