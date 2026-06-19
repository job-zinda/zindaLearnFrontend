import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import { connectSocket } from "../socket";
import "./TutorChatPage.css";

function getErrorMessage(error, fallback = "Something went wrong") {
  return (
    error?.response?.data?.msg ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

function getCurrentUserId() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user?._id || user?.id || "";
}

function getRoomId(room) {
  return room?._id || room?.id || room?.roomId;
}

function getSenderId(message) {
  const sender = message?.senderId || message?.sender || message?.from;
  return typeof sender === "object" ? sender?._id || sender?.id : sender;
}

function getText(message) {
  return message?.text || message?.message || message?.content || "";
}

function isOwnMessage(message) {
  return String(getSenderId(message)) === String(getCurrentUserId());
}

function isMessageRead(message) {
  if (message?.isRead === true || message?.read === true) return true;

  const currentId = getCurrentUserId();

  if (Array.isArray(message?.readBy)) {
    return message.readBy.some(
      (id) => String(id?._id || id) !== String(currentId)
    );
  }

  return false;
}

function getAdmin(room) {
  if (room?.adminId && typeof room.adminId === "object") return room.adminId;
  if (room?.admin && typeof room.admin === "object") return room.admin;
  if (room?.adminDetails && typeof room.adminDetails === "object") {
    return room.adminDetails;
  }
  if (room?.createdBy && room?.createdBy?.role === "admin") return room.createdBy;

  if (Array.isArray(room?.participants)) {
    return room.participants.find(
      (user) =>
        String(user?.role || "").toLowerCase() === "admin" ||
        String(user?.userType || "").toLowerCase() === "admin"
    );
  }

  return null;
}





function getStudent(room) {
  if (room?.studentId && typeof room.studentId === "object") return room.studentId;
  if (room?.student && typeof room.student === "object") return room.student;
  if (room?.studentDetails && typeof room.studentDetails === "object") {
    return room.studentDetails;
  }

  if (Array.isArray(room?.participants)) {
    return room.participants.find(
      (user) =>
        String(user?.role || "").toLowerCase() === "student" ||
        String(user?.userType || "").toLowerCase() === "student"
    );
  }

  return null;
}

// function getChatPartner(room) {
//   if (room?.roomType === "student_tutor") {
//     return getStudent(room);
//   }

//   // return getAdmin(room);
//    return getChatPartner(room)
// }




function getChatPartner(room) {
  if (room?.roomType === "student_tutor") {
    return getStudent(room);
  }

  return getAdmin(room);
}





function getChatPartnerFallback(room) {
  return room?.roomType === "student_tutor" ? "Student" : "Admin";
}





function getUserName(user, fallback = "Admin") {
  return user?.name || user?.email || fallback;
}

function getImageSrc(value) {
  if (!value) return "";

  const src = String(value).trim();

  if (
    src.startsWith("data:image") ||
    src.startsWith("blob:") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  ) {
    return src;
  }

  return getMediaUrl(src);
}

function getUserPhoto(user) {
  return (
    getImageSrc(user?.photo) ||
    getImageSrc(user?.profilePhoto) ||
    getImageSrc(user?.profileImage) ||
    getImageSrc(user?.image) ||
    getImageSrc(user?.avatar) ||
    getImageSrc(user?.profilePic)
  );
}

function formatTime(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatLastSeen(value) {
  if (!value) return "Offline";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Offline";

  return `Last seen ${date.toLocaleString()}`;
}

function isLink(value = "") {
  return /^(https?:\/\/|www\.)/i.test(value);
}

function renderTextWithLinks(text = "") {
  return String(text)
    .split(/(\s+)/)
    .map((part, index) => {
      const clean = part.trim();

      if (isLink(clean)) {
        const href = clean.startsWith("http") ? clean : `https://${clean}`;

        return (
          <a
            key={`${part}-${index}`}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="tutor-admin-chat-link"
          >
            {part}
          </a>
        );
      }

      return part;
    });
}

function getFileUrl(file) {
  return getMediaUrl(file?.url || file?.path || file);
}

function getFileType(file) {
  return file?.mimeType || file?.type || "";
}

function isImageFile(file) {
  const type = getFileType(file);
  const url = getFileUrl(file);
  return type.startsWith("image/") || /\.(png|jpg|jpeg|webp|gif)$/i.test(url);
}

function isVideoFile(file) {
  const type = getFileType(file);
  const url = getFileUrl(file);
  return type.startsWith("video/") || /\.(mp4|webm|mov)$/i.test(url);
}

function isAudioFile(file) {
  const type = getFileType(file);
  const url = getFileUrl(file);
  return type.startsWith("audio/") || /\.(mp3|wav|webm|ogg|m4a)$/i.test(url);
}

function Avatar({ user, className = "tutor-admin-chat-avatar" }) {
  const name = getUserName(user, "Admin");
  const src = getUserPhoto(user);

  return (
    <div className={className}>
      {src ? (
        <img src={src} alt={name} />
      ) : (
        <span>{name.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}

function MessageFile({ file }) {
  const url = getFileUrl(file);
  const name = file?.originalName || file?.filename || file?.name || "File";

  if (!url) return null;

  if (isImageFile(file)) {
    return <img className="tutor-admin-chat-file-img" src={url} alt={name} />;
  }

  if (isVideoFile(file)) {
    return <video className="tutor-admin-chat-file-video" src={url} controls />;
  }

  if (isAudioFile(file)) {
    return <audio className="tutor-admin-chat-file-audio" src={url} controls />;
  }

  return (
    <a
      className="tutor-admin-chat-file-link"
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      📎 {name}
    </a>
  );
}

function MessageBubble({ message, onEdit, onDelete }) {
  const own = isOwnMessage(message);
  const read = isMessageRead(message);
  const text = getText(message);
  const files = message?.files || message?.attachments || [];
  const messageType = message?.messageType || message?.type;

  const isAutomatic =
    messageType === "auto" ||
    messageType === "connect_request" ||
    message?.isAutomatic;

  const hasFiles = Array.isArray(files) && files.length > 0;

  const canDelete = own && !isAutomatic && messageType !== "connect_card";
  const canEdit =
    own && !isAutomatic && messageType !== "connect_card" && !hasFiles;

  return (
    <div className={`tutor-admin-chat-row ${own ? "tutor-admin-chat-row--own" : ""}`}>
      <div
        className={`tutor-admin-chat-bubble ${
          own
            ? read
              ? "tutor-admin-chat-bubble--own-read"
              : "tutor-admin-chat-bubble--own-unread"
            : ""
        }`}
      >
        {own && (canEdit || canDelete) && (
          <div className="tutor-admin-message-actions-hover">
            {canEdit && (
              <button type="button" title="Edit" onClick={() => onEdit(message)}>
                ✎
              </button>
            )}

            {canDelete && (
              <button type="button" title="Delete" onClick={() => onDelete(message)}>
                🗑
              </button>
            )}
          </div>
        )}

        {messageType === "connect_card" ? (
          <>
            <div
              className="tutor-admin-connect-preview-image-card"
              onClick={() => {
                if (message?.connectCard?.tuterId) {
                  window.location.href = `/tutor/tutors/${message.connectCard.tuterId}`;
                }
              }}
            >
              {message?.connectCard?.image ? (
                <img
                  src={getMediaUrl(message.connectCard.image)}
                  alt={message.connectCard.name || "Tutor"}
                />
              ) : (
                <div className="tutor-admin-connect-preview-fallback">
                  {message?.connectCard?.name?.charAt(0)?.toUpperCase() || "T"}
                </div>
              )}

              <div className="tutor-admin-connect-preview-overlay">
                <h4>{message?.connectCard?.name || "Tutor Details"}</h4>
                <p>
                  {message?.connectCard?.qualification ||
                    "Qualification not added"}
                </p>
                <span>Tap to view full tutor details</span>
              </div>
            </div>

            {text ? (
              <p className="tutor-admin-connect-request-text">
                {renderTextWithLinks(text)}
              </p>
            ) : null}
          </>
        ) : isAutomatic ? (
          <div className="tutor-admin-connect-auto">
            <b>Connect Request</b>
            <p>{renderTextWithLinks(text)}</p>
          </div>
        ) : (
          text && (
            <p className="tutor-admin-chat-text">
              {renderTextWithLinks(text)}
            </p>
          )
        )}

        {hasFiles && (
          <div className="tutor-admin-chat-files">
            {files.map((file, index) => (
              <MessageFile key={file?._id || index} file={file} />
            ))}
          </div>
        )}

        <div className="tutor-admin-chat-meta">
          <span>{formatTime(message?.createdAt)}</span>
          {own && <span>{read ? "✓✓ Read" : "✓ Sent"}</span>}
        </div>
      </div>
    </div>
  );
}

export default function TutorChatPage() {
  const { showAlert } = useAlert();
  const [searchParams, setSearchParams] = useSearchParams();

  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  const [search, setSearch] = useState("");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const [text, setText] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);

  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const [editingMessage, setEditingMessage] = useState(null);
  const [pendingFiles, setPendingFiles] = useState([]);

  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [voiceReady, setVoiceReady] = useState(false);

  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const recordTimerRef = useRef(null);
  const sendingRef = useRef(false);
  const activeRoomIdRef = useRef("");
  const emojiPickerRef = useRef(null);

  const activeRoomId = getRoomId(activeRoom);
  // const activeAdmin = useMemo(() => getAdmin(activeRoom), [activeRoom]);

  const activePartner = useMemo(() => getChatPartner(activeRoom), [activeRoom]);

  useEffect(() => {
    activeRoomIdRef.current = activeRoomId || "";
  }, [activeRoomId]);

  const filteredRooms = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return rooms;

    return rooms.filter((room) => {
      // const admin = getAdmin(room);
       const admin = getChatPartner(room)
      const name = getUserName(admin, "").toLowerCase();
      const email = String(admin?.email || "").toLowerCase();

      return name.includes(keyword) || email.includes(keyword);
    });
  }, [rooms, search]);

  function appendUniqueMessage(newMessage) {
    if (!newMessage?._id) return;

    setMessages((prev) => {
      const exists = prev.some(
        (message) => String(message._id) === String(newMessage._id)
      );

      if (exists) return prev;
      return [...prev, newMessage];
    });
  }

  function scrollToBottom() {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }

  function formatRecordTime(seconds) {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  }

  async function createOrGetDefaultRoom() {
    const { data } = await api.post("/chat/tutor-admin-room");
    return data?.room || data?.chatRoom || null;
  }

  async function fetchRooms(options = {}) {
    const { silent = false, preferredRoomId = activeRoomIdRef.current } = options;

    try {
      if (!silent) setLoadingRooms(true);

      const { data } = await api.get("/chat/rooms");
      let list = data?.rooms || data?.chatRooms || [];

      if (!list.length) {
        const createdRoom = await createOrGetDefaultRoom();
        if (createdRoom) list = [createdRoom];
      }

      setRooms(list);

      const queryRoomId = searchParams.get("roomId");
      const shouldOpenChat = searchParams.get("open") === "chat";
      const keepRoomId = preferredRoomId || queryRoomId || activeRoomIdRef.current;

      const selected =
        list.find((room) => String(getRoomId(room)) === String(keepRoomId)) ||
        list.find((room) => String(getRoomId(room)) === String(queryRoomId)) ||
        null;

      if (selected) {
        setActiveRoom(selected);
        activeRoomIdRef.current = getRoomId(selected);

        if (shouldOpenChat) {
          setMobileChatOpen(true);
        }
      }
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to load chat rooms"), "error");
    } finally {
      if (!silent) setLoadingRooms(false);
    }
  }

  async function refreshRoomListOnly() {
    try {
      const keepRoomId = activeRoomIdRef.current;
      const { data } = await api.get("/chat/rooms");
      let list = data?.rooms || data?.chatRooms || [];

      if (!list.length) {
        const createdRoom = await createOrGetDefaultRoom();
        if (createdRoom) list = [createdRoom];
      }

      setRooms(list);

      const updatedActiveRoom = list.find(
        (room) => String(getRoomId(room)) === String(keepRoomId)
      );

      if (updatedActiveRoom) {
        setActiveRoom(updatedActiveRoom);
      }
    } catch {
      // silent refresh
    }
  }

  async function fetchMessages(roomId) {
    if (!roomId) return;

    try {
      setLoadingMessages(true);

      const { data } = await api.get(`/chat/messages/${roomId}`);
      setMessages(data?.messages || []);

      await api.patch(`/chat/read/${roomId}`);

      scrollToBottom();
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to load messages"), "error");
    } finally {
      setLoadingMessages(false);
    }
  }

  function openChatView(room) {
    const roomId = getRoomId(room);

    activeRoomIdRef.current = roomId;
    setActiveRoom(room);
    setSearchParams({ roomId }, { replace: true });
    setMessages([]);
    setMobileChatOpen(true);
  }

  function goBackToList() {
    setMobileChatOpen(false);
    setEmojiOpen(false);
    setEditingMessage(null);
  }

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (
        emojiOpen &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target)
      ) {
        setEmojiOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [emojiOpen]);

  useEffect(() => {
    if (!activeRoomId) return;

    fetchMessages(activeRoomId);

    const socket = connectSocket();

    socket.emit("joinRoom", activeRoomId);
    socket.emit("join_room", activeRoomId);

    function handleNewMessage(message) {
      const roomId =
        message?.roomId?._id || message?.roomId || message?.chatRoomId;

      if (String(roomId) === String(activeRoomIdRef.current)) {
        appendUniqueMessage(message);
        api.patch(`/chat/read/${activeRoomIdRef.current}`).catch(() => {});
        scrollToBottom();
      }

      refreshRoomListOnly();
    }

    function handleMessageRead(payload) {
      const roomId = payload?.roomId || payload?.chatRoomId;

      if (String(roomId) === String(activeRoomIdRef.current)) {
        setMessages((prev) =>
          prev.map((message) => ({
            ...message,
            isRead: true,
          }))
        );
      }
    }

    function handleMessageDeleted(payload) {
      const messageId = payload?.messageId || payload?._id;

      setMessages((prev) =>
        prev.filter((message) => String(message._id) !== String(messageId))
      );

      refreshRoomListOnly();
    }

    function handleMessageUpdated(updatedMessage) {
      setMessages((prev) =>
        prev.map((message) =>
          String(message._id) === String(updatedMessage._id)
            ? updatedMessage
            : message
        )
      );

      refreshRoomListOnly();
    }

    function handleChatListUpdated() {
      refreshRoomListOnly();
    }

    socket.on("new_message", handleNewMessage);
    socket.on("newMessage", handleNewMessage);
    socket.on("message_read", handleMessageRead);
    socket.on("messageRead", handleMessageRead);
    socket.on("messageDeleted", handleMessageDeleted);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("messageUpdated", handleMessageUpdated);
    socket.on("message_updated", handleMessageUpdated);
    socket.on("chat_list_updated", handleChatListUpdated);

    return () => {
      socket.emit("leaveRoom", activeRoomId);
      socket.emit("leave_room", activeRoomId);

      socket.off("new_message", handleNewMessage);
      socket.off("newMessage", handleNewMessage);
      socket.off("message_read", handleMessageRead);
      socket.off("messageRead", handleMessageRead);
      socket.off("messageDeleted", handleMessageDeleted);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("messageUpdated", handleMessageUpdated);
      socket.off("message_updated", handleMessageUpdated);
      socket.off("chat_list_updated", handleChatListUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoomId]);

  async function sendFilesNow(filesToSend) {
    if (!activeRoomId || !filesToSend?.length) return null;

    const formData = new FormData();

    filesToSend.forEach((file) => {
      formData.append("files", file);
    });

    if (text.trim() && !editingMessage) {
      formData.append("message", text.trim());
      formData.append("text", text.trim());
    }

    const { data } = await api.post(
      `/chat/file-message/${activeRoomId}`,
      formData
    );

    return data?.message || data?.chatMessage;
  }

  async function sendMessage(e) {
    e?.preventDefault?.();

    if (sendingRef.current) return;
    if (!activeRoomId) return;

    const cleanText = text.trim();
    const hasFiles = pendingFiles.length > 0;

    if (!cleanText && !hasFiles && !voiceReady) return;

    try {
      sendingRef.current = true;
      setSending(true);

      if (editingMessage) {
        const { data } = await api.patch(`/chat/message/${editingMessage._id}`, {
          text: cleanText,
          message: cleanText,
          content: cleanText,
        });

        const updated = data?.message || data?.chatMessage || data?.updatedMessage;

        if (updated) {
          setMessages((prev) =>
            prev.map((message) =>
              String(message._id) === String(updated._id) ? updated : message
            )
          );
        }

        setEditingMessage(null);
        setText("");
        return;
      }

      if (hasFiles) {
        const newMessage = await sendFilesNow(pendingFiles);

        if (newMessage) {
          appendUniqueMessage(newMessage);
        }

        setText("");
        setPendingFiles([]);
        scrollToBottom();
        refreshRoomListOnly();
        return;
      }

      const { data } = await api.post(`/chat/message/${activeRoomId}`, {
        text: cleanText,
        message: cleanText,
        content: cleanText,
      });

      const newMessage = data?.message || data?.chatMessage;

      if (newMessage) {
        appendUniqueMessage(newMessage);
      }

      setText("");
      scrollToBottom();
      refreshRoomListOnly();
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to send message"), "error");
    } finally {
      setSending(false);
      sendingRef.current = false;
    }
  }

  function startEdit(message) {
    setEditingMessage(message);
    setText(getText(message));
    setEmojiOpen(false);
  }

  async function deleteMessage(message) {
    try {
      await api.delete(`/chat/message/${message._id}`);

      setMessages((prev) =>
        prev.filter((item) => String(item._id) !== String(message._id))
      );

      refreshRoomListOnly();
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to delete message"), "error");
    }
  }

  function cancelEdit() {
    setEditingMessage(null);
    setText("");
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setPendingFiles((prev) => [...prev, ...files]);

    e.target.value = "";
  }

  function removePendingFile(index) {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function stopStream() {
    streamRef.current?.getTracks?.().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function clearRecordingTimer() {
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
  }

  async function startRecording() {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        return showAlert("Voice recording is not supported", "error");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], `voice-${Date.now()}.webm`, {
          type: "audio/webm",
        });

        setPendingFiles((prev) => [...prev, file]);
        setVoiceReady(true);
        setRecording(false);
        clearRecordingTimer();
        stopStream();
      };

      recorder.start();
      setRecording(true);
      setVoiceReady(false);
      setRecordSeconds(0);

      recordTimerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to start recording"), "error");
      setRecording(false);
      clearRecordingTimer();
      stopStream();
    }
  }

  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
  }

  function cancelRecording() {
    chunksRef.current = [];
    clearRecordingTimer();
    setRecording(false);
    setRecordSeconds(0);
    setVoiceReady(false);

    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.onstop = null;
      recorderRef.current.stop();
    }

    stopStream();
  }

  const canSend =
    Boolean(text.trim()) ||
    pendingFiles.length > 0 ||
    Boolean(editingMessage);

  return (
    <div className="tutor-admin-chat-page">
      <div className="tutor-admin-chat-layout">
        <aside
          className={`tutor-admin-chat-admin-panel ${
            mobileChatOpen ? "tutor-admin-chat-admin-panel--hide-mobile" : ""
          }`}
        >
          <div className="tutor-admin-chat-panel-card">
            <div className="tutor-admin-chat-search-box">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search admin..."
              />
            </div>

            <div className="tutor-admin-chat-room-list">
              {loadingRooms ? (
                <div className="tutor-admin-chat-list-state">
                  Loading chats...
                </div>
              ) : filteredRooms.length ? (
                filteredRooms.map((room) => {
                  const roomId = getRoomId(room);
                  // const admin = getAdmin(room);
                  const admin = getChatPartner(room)
                  const name = getUserName(admin, "Admin");
                  const lastMessage =
                    room?.lastMessage?.text ||
                    room?.lastMessage?.message ||
                    room?.lastMessage?.content ||
                    room?.lastMessage ||
                    "Tap to chat with admin";

                  return (
                    <button
                      key={roomId}
                      type="button"
                      className={`tutor-admin-chat-room-item ${
                        String(activeRoomId) === String(roomId)
                          ? "tutor-admin-chat-room-item--active"
                          : ""
                      }`}
                      onClick={() => openChatView(room)}
                    >
                      <Avatar
                        user={admin}
                        className="tutor-admin-chat-room-avatar"
                      />

                      <div className="tutor-admin-chat-room-info">
                        <div className="tutor-admin-chat-room-top">
                          <h4>{name}</h4>
                          <span>
                            {formatTime(
                              room?.lastMessage?.createdAt ||
                                room?.updatedAt ||
                                room?.createdAt
                            )}
                          </span>
                        </div>

                        <p>
                          {typeof lastMessage === "string"
                            ? lastMessage
                            : "New message"}
                        </p>

                        <small className={admin?.isOnline ? "online" : ""}>
                          {admin?.isOnline
                            ? "Online"
                            : formatLastSeen(admin?.lastSeen)}
                        </small>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="tutor-admin-chat-list-state">
                  No admin chat found
                </div>
              )}
            </div>
          </div>
        </aside>

        <section
          className={`tutor-admin-chat-detail-panel ${
            mobileChatOpen ? "tutor-admin-chat-detail-panel--open-mobile" : ""
          }`}
        >
          <div className="tutor-admin-chat-detail-card">
            {activeRoom ? (
              <div className="tutor-admin-chat-app">
                <header className="tutor-admin-chat-header">
                  <button
                    type="button"
                    className="tutor-admin-chat-mobile-back"
                    onClick={goBackToList}
                  >
                    ‹
                  </button>

                  <div className="tutor-admin-chat-user">
                    {/* <Avatar user={activeAdmin} />

                    <div>
                      <h3>{getUserName(activeAdmin, "Admin")}</h3>
                      <p className={activeAdmin?.isOnline ? "online" : ""}>
                        {activeAdmin?.isOnline
                          ? "Online"
                          : formatLastSeen(activeAdmin?.lastSeen)}
                      </p>
                    </div> */}





<Avatar user={activePartner} />

<div>
  <h3>{getUserName(activePartner, getChatPartnerFallback(activeRoom))}</h3>
  <p className={activePartner?.isOnline ? "online" : ""}>
    {activePartner?.isOnline
      ? "Online"
      : formatLastSeen(activePartner?.lastSeen)}
  </p>
</div>



                  </div>
                </header>

                <main className="tutor-admin-chat-body">
                  {loadingMessages ? (
                    <div className="tutor-admin-chat-no-message">
                      Loading messages...
                    </div>
                  ) : messages.length ? (
                    messages.map((message) => (
                      <MessageBubble
                        key={message._id}
                        message={message}
                        onEdit={startEdit}
                        onDelete={deleteMessage}
                      />
                    ))
                  ) : (
                    <div className="tutor-admin-chat-no-message">
                  No messages yet. Send a message.
                    </div>
                  )}

                  <div ref={bottomRef} />
                </main>

                {pendingFiles.length > 0 && (
                  <div className="tutor-admin-selected-file-bar">
                    <div className="tutor-admin-selected-file-list">
                      {pendingFiles.map((file, index) => (
                        <div
                          className="tutor-admin-selected-file-chip"
                          key={`${file.name}-${index}`}
                        >
                          <b>{file.name}</b>
                          <button
                            type="button"
                            onClick={() => removePendingFile(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {recording && (
                  <div className="tutor-admin-recording-panel">
                    <button
                      type="button"
                      className="tutor-admin-record-trash"
                      onClick={cancelRecording}
                    >
                      🗑
                    </button>

                    <span className="tutor-admin-record-dot" />

                    <div className="tutor-admin-record-waves">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>

                    <b>{formatRecordTime(recordSeconds)}</b>

                    <button
                      type="button"
                      className="tutor-admin-record-stop"
                      onClick={stopRecording}
                    >
                      ■
                    </button>
                  </div>
                )}

                <form
                  className="tutor-admin-chat-inputbar"
                  onSubmit={sendMessage}
                >
                  {emojiOpen && (
                    <div
                      className="tutor-admin-emoji-picker-wrap"
                      ref={emojiPickerRef}
                    >
                      <EmojiPicker
                        theme="dark"
                        onEmojiClick={(emojiData) => {
                          setText((prev) => prev + emojiData.emoji);
                        }}
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    className="tutor-admin-chat-icon-btn"
                    onClick={() => setEmojiOpen((prev) => !prev)}
                  >
                    😊
                  </button>

                  <button
                    type="button"
                    className="tutor-admin-chat-icon-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📎
                  </button>

                  <button
                    type="button"
                    className={`tutor-admin-chat-icon-btn ${
                      recording ? "recording-active" : ""
                    }`}
                    onClick={recording ? stopRecording : startRecording}
                  >
                    🎙
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    hidden
                    onChange={handleFileChange}
                  />

                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={
                      editingMessage ? "Edit message..." : "Type a message..."
                    }
                  />

                  {editingMessage && (
                    <button
                      type="button"
                      className="tutor-admin-chat-cancel-edit"
                      onClick={cancelEdit}
                    >
                      ×
                    </button>
                  )}

                  <button
                    type="submit"
                    className="tutor-admin-chat-send"
                    disabled={sending || !canSend}
                  >
                    ➤
                  </button>
                </form>
              </div>
            ) : (
              <div className="tutor-admin-chat-empty">
                <div>
                  <h2>Select Admin</h2>
                  <p>Choose admin profile to start chatting.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}