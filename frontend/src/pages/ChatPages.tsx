import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
  LogOut,
  PlusCircle,
  Image,
  Paperclip,
  X,
} from "lucide-react";
import AuthService from "@/services/authService";
import { IOtherUser, IProfile } from "@/types/auth";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";

// Interfaces
interface IMessage {
  receiverId: string;
  senderId: string;
  content: string;
  fileUrl?: string;
  timestamp?: string;
}

interface ChatProps {}

const ChatSystem: React.FC<ChatProps> = () => {
  // State management
  const [activeChat, setActiveChat] = useState<boolean>(true);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [profileData, setProfileData] = useState<IProfile>({
    _id: "",
    username: "",
  });
  const [otherUsers, setOtherUsers] = useState<IOtherUser[]>([]);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Record<string, IMessage[]>>({});
  const [socket, setSocket] = useState<Socket | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(
    null
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io("http://localhost:5000");
    setSocket(socketInstance);

    socketInstance.on("receivePrivateMessage", (message: IMessage) => {
      if (!message.senderId || !message.receiverId) return;

      setMessages((prev) => {
        const updated = {
          ...prev,
          [message.senderId]: [
            ...(prev[message.senderId] || []),
            { ...message, timestamp: new Date().toISOString() },
          ],
        };
        localStorage.setItem("chatMessages", JSON.stringify(updated));
        return updated;
      });
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const [profile, others] = await Promise.all([
          AuthService.profileService(token),
          AuthService.OtherUserDataService(token),
        ]);

        setProfileData(profile);
        setOtherUsers(others);

        // Load saved messages
        const savedMessages = localStorage.getItem("chatMessages");
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        navigate("/");
      }
    };

    loadInitialData();
  }, [navigate]);

  // Join private chat room
  useEffect(() => {
    if (profileData._id && otherUsers[selectedIndex]?._id && socket) {
      const roomData = {
        senderId: profileData._id,
        receiverId: otherUsers[selectedIndex]._id,
      };
      socket.emit("joinPrivateRoom", roomData);
    }
  }, [profileData._id, otherUsers, selectedIndex, socket]);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedIndex]);

  // File upload handler
  const uploadFile = async (): Promise<string | null> => {
    if (!selectedFile) return null;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.post(
        "http://localhost:5000/api/chat/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.fileUrl;
    } catch (error) {
      console.error("File upload failed:", error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Message sending handler
  const sendMessage = async () => {
    if (!message.trim() && !selectedFile) return;

    const receiverId = otherUsers[selectedIndex]?._id;
    if (!profileData._id || !receiverId) return;

    let fileUrl = null;
    if (selectedFile) {
      fileUrl = await uploadFile();
    }

    const messageData: IMessage = {
      senderId: profileData._id,
      receiverId,
      content: message,
      timestamp: new Date().toISOString(),
      ...(fileUrl && { fileUrl }),
    };

    // Update local messages
    setMessages((prev) => {
      const updated = {
        ...prev,
        [receiverId]: [...(prev[receiverId] || []), messageData],
      };
      localStorage.setItem("chatMessages", JSON.stringify(updated));
      return updated;
    });

    // Send via socket
    socket?.emit("sendPrivateMessage", messageData);

    // Clear input states
    setMessage("");
    setSelectedFile(null);
    setSelectedFilePreview(null);
  };

  // File selection handlers
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setSelectedFilePreview(previewUrl);
    }
  };

  const clearSelectedFile = () => {
    if (selectedFilePreview) {
      URL.revokeObjectURL(selectedFilePreview);
    }
    setSelectedFile(null);
    setSelectedFilePreview(null);
  };

  // Utility function for time formatting
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter users based on search
  const filteredUsers = otherUsers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 border-r bg-white flex flex-col">
        {/* Profile Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 ring-2 ring-blue-500">
                <AvatarFallback className="bg-blue-500 text-white">
                  {profileData.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {profileData.username}
                </h3>
                <p className="text-sm text-gray-500">Online</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations"
              className="pl-9 bg-gray-50"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((user, index) => (
            <div
              key={user._id}
              onClick={() => {
                setActiveChat(true);
                setSelectedIndex(index);
              }}
              className={`p-3 cursor-pointer transition-colors duration-150 hover:bg-gray-50 ${
                selectedIndex === index ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gray-200">
                    {user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-gray-900 truncate">
                      {user.username}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {messages[user._id]?.slice(-1)[0]?.timestamp &&
                        formatTime(messages[user._id].slice(-1)[0].timestamp!)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {messages[user._id]?.slice(-1)[0]?.content ||
                      "Start a conversation"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {activeChat && otherUsers[selectedIndex] && (
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b flex justify-between items-center bg-white">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gray-200">
                  {otherUsers[selectedIndex].username
                    .substring(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {otherUsers[selectedIndex].username}
                </h3>
                <p className="text-sm text-green-500">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <Phone className="h-5 w-5 text-gray-600" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <Video className="h-5 w-5 text-gray-600" />
              </Button>
              <Popover>
                <PopoverTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-600" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/");
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages[otherUsers[selectedIndex]._id]?.map((msg, index) => {
              console.log(msg.fileUrl);
              const isOwnMessage = msg.senderId === profileData._id;
              return (
                <div
                  key={index}
                  className={`flex items-end space-x-2 ${
                    isOwnMessage ? "justify-end" : ""
                  }`}
                >
                  {!isOwnMessage && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-200">
                        {otherUsers[selectedIndex].username
                          .substring(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-md px-4 py-2 rounded-2xl ${
                      isOwnMessage
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-white text-gray-900 rounded-bl-none shadow-sm"
                    }`}
                  >
                    {msg.content && <p className="mb-2">{msg.content}</p>}
                    {msg.fileUrl && (
                      <div className="relative mb-2">
                        <img
                          src={`http://localhost:5000${msg.fileUrl}`} 
                          alt="File"
                          className="max-w-xs rounded-lg"
                          style={{ maxHeight: "200px" }}
                        />
                      </div>
                    )}

                    <span
                      className={`text-xs ${
                        isOwnMessage ? "text-blue-100" : "text-gray-500"
                      } mt-1 inline-block`}
                    >
                      {msg.timestamp && formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Message Input Area */}
          <div className="p-4 border-t bg-white">
            {selectedFilePreview && (
              <div className="mb-4 relative inline-block">
                <img
                  src={selectedFilePreview}
                  alt="Selected file preview"
                  className="max-h-32 rounded-lg border border-gray-200"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 bg-white rounded-full shadow-md"
                  onClick={clearSelectedFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-600"
                onClick={handleFileSelect}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button
                onClick={sendMessage}
                disabled={isUploading || (!message.trim() && !selectedFile)}
              >
                {isUploading ? "Uploading..." : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSystem;
