

















































import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import { connectSocket } from "../socket";
import "./StudentChatPage.css";

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
  const parts = String(text).split(/(\s+)/);

  return parts.map((part, index) => {
    const clean = part.trim();

    if (isLink(clean)) {
      const href = clean.startsWith("http") ? clean : `https://${clean}`;

      return (
        <a
          key={`${part}-${index}`}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="student-chat-link"
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
  return type.startsWith("audio/") || /\.(mp3|wav|webm|ogg)$/i.test(url);
}

function MessageFile({ file }) {
  const url = getFileUrl(file);
  const name = file?.originalName || file?.filename || file?.name || "File";

  if (!url) return null;

  if (isImageFile(file)) {
    return <img className="student-chat-file-img" src={url} alt={name} />;
  }

  if (isVideoFile(file)) {
    return <video className="student-chat-file-video" src={url} controls />;
  }

  if (isAudioFile(file)) {
    return <audio className="student-chat-file-audio" src={url} controls />;
  }

  return (
    <a
      className="student-chat-file-link"
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

  const canDelete = own;
  const canEdit =
    own && !isAutomatic && messageType !== "connect_card" && !hasFiles;

  return (
    <div className={`student-chat-row ${own ? "student-chat-row--own" : ""}`}>
      <div
        className={`student-chat-bubble ${
          own
            ? read
              ? "student-chat-bubble--own-read"
              : "student-chat-bubble--own-unread"
            : ""
        }`}
      >
        {own && (canEdit || canDelete) && (
          <div className="student-message-actions-hover">
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
              className="student-connect-preview-image-card"
              onClick={() => {
                if (message?.connectCard?.tuterId) {
                  window.location.href = `/student/tutors/${message.connectCard.tuterId}`;
                }
              }}
            >
              {message?.connectCard?.image ? (
                <img
                  src={getMediaUrl(message.connectCard.image)}
                  alt={message.connectCard.name || "Tutor"}
                />
              ) : (
                <div className="student-connect-preview-fallback">
                  {message?.connectCard?.name?.charAt(0)?.toUpperCase() || "T"}
                </div>
              )}

              <div className="student-connect-preview-overlay">
                <h4>{message?.connectCard?.name || "Tutor Details"}</h4>
                <p>
                  {message?.connectCard?.qualification ||
                    "Qualification not added"}
                </p>
                <span>Tap to view full tutor details</span>
              </div>
            </div>

            {text ? (
              <p className="student-connect-request-text">
                {renderTextWithLinks(text)}
              </p>
            ) : null}
          </>
        ) : isAutomatic ? (
          <div className="student-connect-request-card">
            <b>Connect Request</b>
            <p>{renderTextWithLinks(text)}</p>
          </div>
        ) : (
          text && <p className="student-chat-text">{renderTextWithLinks(text)}</p>
        )}

        {hasFiles && (
          <div className="student-chat-files">
            {files.map((file, index) => (
              <MessageFile key={file?._id || index} file={file} />
            ))}
          </div>
        )}

        <div className="student-chat-meta">
          <span>
            {message?.createdAt
              ? new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </span>

          {own && <span>{read ? "✓✓ Read" : "✓ Sent"}</span>}
        </div>
      </div>
    </div>
  );
}

const emojis = ["😀", "😂", "😍", "👍", "🙏", "🔥", "❤️", "🎉", "😊", "😎"];

export default function StudentChatPage() {
  const { showAlert } = useAlert();
  const [searchParams] = useSearchParams();

  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);

  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [voiceReady, setVoiceReady] = useState(false);

  const [pendingFiles, setPendingFiles] = useState([]);

  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const recordTimerRef = useRef(null);
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  const activeRoomId = getRoomId(activeRoom);
  const admin = useMemo(() => getAdmin(activeRoom), [activeRoom]);
  const adminPhoto = getUserPhoto(admin);

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
    const { data } = await api.post("/chat/student-admin-room");
    return data?.room || data?.chatRoom || null;
  }

  async function fetchRooms() {
    try {
      setLoading(true);

      const { data } = await api.get("/chat/rooms");
      let list = data?.rooms || data?.chatRooms || [];
      const queryRoomId = searchParams.get("roomId");

      let selected =
        list.find((room) => String(getRoomId(room)) === String(queryRoomId)) ||
        list[0] ||
        null;

      if (!selected) {
        selected = await createOrGetDefaultRoom();
      }

      setActiveRoom(selected);
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to load chats"), "error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchMessages(roomId) {
    if (!roomId) return;

    try {
      const { data } = await api.get(`/chat/messages/${roomId}`);
      setMessages(data?.messages || []);
      await api.patch(`/chat/read/${roomId}`);
      scrollToBottom();
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to load messages"), "error");
    }
  }

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeRoomId) return;

    fetchMessages(activeRoomId);

    const socket = connectSocket();

    socket.emit("joinRoom", activeRoomId);
    socket.emit("join_room", activeRoomId);

    function handleNewMessage(message) {
      const roomId =
        message?.roomId?._id || message?.roomId || message?.chatRoomId;

      if (String(roomId) === String(activeRoomId)) {
        setMessages((prev) => {
          if (prev.some((m) => String(m._id) === String(message._id))) {
            return prev;
          }
          return [...prev, message];
        });

        api.patch(`/chat/read/${activeRoomId}`).catch(() => {});
        scrollToBottom();
      }
    }

    function handleMessageRead(payload) {
      const roomId = payload?.roomId || payload?.chatRoomId;

      if (String(roomId) === String(activeRoomId)) {
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
    }

    function handleMessageUpdated(updatedMessage) {
      setMessages((prev) =>
        prev.map((message) =>
          String(message._id) === String(updatedMessage._id)
            ? updatedMessage
            : message
        )
      );
    }

    socket.on("new_message", handleNewMessage);
    socket.on("newMessage", handleNewMessage);
    socket.on("message_read", handleMessageRead);
    socket.on("messageRead", handleMessageRead);
    socket.on("messageDeleted", handleMessageDeleted);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("messageUpdated", handleMessageUpdated);
    socket.on("message_updated", handleMessageUpdated);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("newMessage", handleNewMessage);
      socket.off("message_read", handleMessageRead);
      socket.off("messageRead", handleMessageRead);
      socket.off("messageDeleted", handleMessageDeleted);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("messageUpdated", handleMessageUpdated);
      socket.off("message_updated", handleMessageUpdated);
    };
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

  async function sendTextNow() {
    const { data } = await api.post(`/chat/message/${activeRoomId}`, {
      message: text.trim(),
      text: text.trim(),
      messageType: "text",
    });

    return data?.message || data?.chatMessage;
  }

  async function updateTextNow() {
    const { data } = await api.patch(`/chat/message/${editingMessage._id}`, {
      message: text.trim(),
      text: text.trim(),
    });

    return data?.message || data?.chatMessage;
  }

  async function sendMessage(e) {
    e.preventDefault();

    if (!activeRoomId || sending || recording) return;
    if (!text.trim() && pendingFiles.length === 0) return;

    try {
      setSending(true);

      let saved = null;

      if (editingMessage) {
        if (!text.trim()) return;

        saved = await updateTextNow();

        if (saved) {
          setMessages((prev) =>
            prev.map((message) =>
              String(message._id) === String(saved._id) ? saved : message
            )
          );
        } else {
          await fetchMessages(activeRoomId);
        }

        setEditingMessage(null);
        setText("");
        showAlert("Message updated", "success");
        return;
      }

      if (pendingFiles.length > 0) {
        saved = await sendFilesNow(pendingFiles);
      } else {
        saved = await sendTextNow();
      }

      if (saved) {
        setMessages((prev) => {
          if (prev.some((m) => String(m._id) === String(saved._id))) {
            return prev;
          }
          return [...prev, saved];
        });
      } else {
        await fetchMessages(activeRoomId);
      }

      setText("");
      setPendingFiles([]);
      setVoiceReady(false);
      setEmojiOpen(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      scrollToBottom();
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to send message"), "error");
    } finally {
      setSending(false);
    }
  }

  function handleFileSelect(files) {
    if (!files?.length) return;

    setEditingMessage(null);
    setVoiceReady(false);
    setPendingFiles(Array.from(files));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function startRecording() {
    try {
      setPendingFiles([]);
      setVoiceReady(false);
      setEditingMessage(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      chunksRef.current = [];
      recorderRef.current = recorder;
      streamRef.current = stream;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });

        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        if (blob.size > 0) {
          const file = new File([blob], `voice-${Date.now()}.webm`, {
            type: "audio/webm",
          });

          setPendingFiles([file]);
          setVoiceReady(true);
        }

        chunksRef.current = [];
      };

      recorder.start();
      setRecording(true);
      setRecordSeconds(0);

      recordTimerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      showAlert("Microphone permission denied", "error");
    }
  }

  function stopRecording() {
    if (recorderRef.current && recording) {
      recorderRef.current.stop();
    }

    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }

    setRecording(false);
  }

  function cancelRecording() {
    chunksRef.current = [];

    if (recorderRef.current && recording) {
      recorderRef.current.onstop = null;
      recorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }

    setRecording(false);
    setRecordSeconds(0);
    setVoiceReady(false);
    setPendingFiles([]);
  }

  function removePendingFile(index) {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
    setVoiceReady(false);
  }

  async function handleDelete(message) {
    try {
      await api.delete(`/chat/message/${message._id}`);

      setMessages((prev) =>
        prev.filter((item) => String(item._id) !== String(message._id))
      );

      showAlert("Message deleted", "success");
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to delete message"), "error");
    }
  }

  function handleEdit(message) {
    setEditingMessage(message);
    setText(getText(message));
    setPendingFiles([]);
    setVoiceReady(false);
  }

  if (loading) {
    return <div className="student-chat-state">Loading chats...</div>;
  }

  return (
    <div className="student-chat-page">
      <div className="student-chat-app">
        <div className="student-chat-header">
          <div className="student-chat-admin">
            <div className="student-chat-avatar">
              {adminPhoto ? (
                <img
                  src={adminPhoto}
                  alt={admin?.name || "Admin"}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span>{admin?.name?.charAt(0)?.toUpperCase() || "A"}</span>
              )}
            </div>

            <div>
              <h3>{admin?.name || "Admin"}</h3>
              <p className={admin?.isOnline ? "online" : ""}>
                {admin?.isOnline ? "Online" : formatLastSeen(admin?.lastSeen)}
              </p>
            </div>
          </div>
        </div>

        <div className="student-chat-body">
          {messages.length ? (
            messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="student-chat-no-message">
              Start chatting with admin
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {recording && (
          <div className="student-recording-panel">
            <button
              type="button"
              className="student-record-trash"
              onClick={cancelRecording}
            >
              🗑
            </button>

            <span className="student-record-dot"></span>
            <b>{formatRecordTime(recordSeconds)}</b>

            <div className="student-record-waves">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <button
              type="button"
              className="student-record-stop"
              onClick={stopRecording}
            >
              ■
            </button>
          </div>
        )}

        {pendingFiles.length > 0 && !recording && (
          <div className="student-selected-file-bar">
            <div className="student-selected-file-list">
              {pendingFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="student-selected-file-chip"
                >
                  <span>{voiceReady ? "🎙️" : "📎"}</span>
                  <b>{voiceReady ? "Voice message ready" : file.name}</b>
                  <button type="button" onClick={() => removePendingFile(index)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <form className="student-chat-inputbar" onSubmit={sendMessage}>
          <button
            type="button"
            className="student-chat-icon-btn"
            onClick={() => setEmojiOpen((prev) => !prev)}
          >
            😊
          </button>

          {emojiOpen && (
            <div className="student-emoji-box">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setText((prev) => prev + emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            className="student-chat-icon-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={recording || sending}
          >
            📎
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            onChange={(e) => handleFileSelect(e.target.files)}
          />

          <button
            type="button"
            className={`student-chat-icon-btn voice-btn ${
              recording ? "recording-active" : ""
            }`}
            onClick={recording ? stopRecording : startRecording}
            disabled={sending}
          >
            {recording ? "■" : "🎙️"}
          </button>

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={recording}
            placeholder={
              recording
                ? "Recording voice..."
                : editingMessage
                ? "Edit message..."
                : pendingFiles.length
                ? "Add caption..."
                : "Type a message...."
            }
          />

          {editingMessage && (
            <button
              type="button"
              className="student-chat-cancel-edit"
              onClick={() => {
                setEditingMessage(null);
                setText("");
              }}
            >
              ✕
            </button>
          )}

          <button
            type="submit"
            className="student-chat-send"
            disabled={
              sending || recording || (!text.trim() && pendingFiles.length === 0)
            }
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}


