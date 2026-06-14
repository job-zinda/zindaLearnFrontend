// import EmojiPicker from "emoji-picker-react";
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import api from "../api/axios";
// import { useAlert } from "../context/AlertContext";
// import { getMediaUrl } from "../utils/media";
// import { connectSocket } from "../socket";
// import "./AdminChatPage.css";

// function getErrorMessage(error, fallback = "Something went wrong") {
//   return (
//     error?.response?.data?.msg ||
//     error?.response?.data?.error ||
//     error?.message ||
//     fallback
//   );
// }

// function getCurrentUserId() {
//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   return user?._id || user?.id || "";
// }

// function getRoomId(room) {
//   return room?._id || room?.id || room?.roomId;
// }

// function getSenderId(message) {
//   const sender = message?.senderId || message?.sender || message?.from;
//   return typeof sender === "object" ? sender?._id || sender?.id : sender;
// }

// function getText(message) {
//   return message?.text || message?.message || message?.content || "";
// }

// function isOwnMessage(message) {
//   return String(getSenderId(message)) === String(getCurrentUserId());
// }

// function isMessageRead(message) {
//   return message?.isRead === true || message?.read === true;
// }

// function getStudent(room) {
//   return room?.studentId || room?.student || null;
// }

// function getUserName(user, fallback = "Student") {
//   return user?.name || user?.email || fallback;
// }

// function formatTime(value) {
//   if (!value) return "";
//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return "";
//   return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// }

// function formatLastSeen(value) {
//   if (!value) return "Offline";
//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return "Offline";
//   return `Last seen ${date.toLocaleString()}`;
// }

// function getImageSrc(value) {
//   if (!value) return "";
//   const src = String(value);

//   if (
//     src.startsWith("data:image") ||
//     src.startsWith("http://") ||
//     src.startsWith("https://") ||
//     src.startsWith("blob:")
//   ) {
//     return src;
//   }

//   return getMediaUrl(src);
// }

// function isLink(value = "") {
//   return /^(https?:\/\/|www\.)/i.test(value);
// }

// function renderTextWithLinks(text = "") {
//   return String(text)
//     .split(/(\s+)/)
//     .map((part, index) => {
//       const clean = part.trim();

//       if (isLink(clean)) {
//         const href = clean.startsWith("http") ? clean : `https://${clean}`;

//         return (
//           <a
//             key={`${part}-${index}`}
//             href={href}
//             target="_blank"
//             rel="noreferrer"
//             className="admin-chat-link"
//           >
//             {part}
//           </a>
//         );
//       }

//       return part;
//     });
// }

// function getFileUrl(file) {
//   return getMediaUrl(file?.url || file?.path || file);
// }

// function getFileType(file) {
//   return file?.mimeType || file?.type || "";
// }

// function isImageFile(file) {
//   const type = getFileType(file);
//   const url = getFileUrl(file);
//   return type.startsWith("image/") || /\.(png|jpg|jpeg|webp|gif)$/i.test(url);
// }

// function isVideoFile(file) {
//   const type = getFileType(file);
//   const url = getFileUrl(file);
//   return type.startsWith("video/") || /\.(mp4|webm|mov)$/i.test(url);
// }

// function isAudioFile(file) {
//   const type = getFileType(file);
//   const url = getFileUrl(file);
//   return type.startsWith("audio/") || /\.(mp3|wav|webm|ogg)$/i.test(url);
// }

// function Avatar({ user, className = "admin-chat-avatar" }) {
//   const name = getUserName(user, "User");
//   const photo = user?.photo || user?.image || user?.avatar;
//   const src = getImageSrc(photo);

//   return (
//     <div className={className}>
//       {src ? <img src={src} alt={name} /> : <span>{name.charAt(0).toUpperCase()}</span>}
//     </div>
//   );
// }

// function MessageFile({ file }) {
//   const url = getFileUrl(file);
//   const name = file?.originalName || file?.filename || file?.name || "File";

//   if (!url) return null;

//   if (isImageFile(file)) {
//     return <img className="admin-chat-file-img" src={url} alt={name} />;
//   }

//   if (isVideoFile(file)) {
//     return <video className="admin-chat-file-video" src={url} controls />;
//   }

//   if (isAudioFile(file)) {
//     return <audio className="admin-chat-file-audio" src={url} controls />;
//   }

//   return (
//     <a className="admin-chat-file-link" href={url} target="_blank" rel="noreferrer">
//       📎 {name}
//     </a>
//   );
// }














// function ConnectCard({ message }) {
//   const navigate = useNavigate();
//   const card = message?.connectCard || {};
//   const text = getText(message);

//   function openTutorDetails() {
//     if (card?.tuterId) {
//       navigate(`/admin/tutors/${card.tuterId}`);
//     }
//   }

//   return (
//     <>
//       <div className="admin-connect-preview-image-card" onClick={openTutorDetails}>
//         {card?.image ? (
//           <img src={getImageSrc(card.image)} alt={card.name || "Tutor"} />
//         ) : (
//           <div className="admin-connect-preview-fallback">
//             {card?.name?.charAt(0)?.toUpperCase() || "T"}
//           </div>
//         )}

//         <div className="admin-connect-preview-overlay">
//           <h4>{card?.name || "Tutor Details"}</h4>
//           <p>{card?.qualification || "Qualification not added"}</p>
//           <span>Tap to view full tutor details</span>
//         </div>
//       </div>

//       {text ? (
//         <p className="admin-connect-request-text">
//           {renderTextWithLinks(text)}
//         </p>
//       ) : null}
//     </>
//   );
// }






// function MessageBubble({ message, onEdit, onDelete }) {
//   const own = isOwnMessage(message);
//   const read = isMessageRead(message);
//   const text = getText(message);
//   const files = message?.files || message?.attachments || [];
//   const messageType = message?.messageType || message?.type;

//   const isAutomatic =
//     messageType === "auto" ||
//     messageType === "connect_request" ||
//     message?.isAutomatic;

//   const hasFiles = Array.isArray(files) && files.length > 0;

//   const canDelete = own && !isAutomatic && messageType !== "connect_card";
//   const canEdit = own && !isAutomatic && messageType !== "connect_card" && !hasFiles;

//   return (
//     <div className={`admin-chat-row ${own ? "admin-chat-row--own" : ""}`}>
//       <div
//         className={`admin-chat-bubble ${own
//             ? read
//               ? "admin-chat-bubble--own-read"
//               : "admin-chat-bubble--own-unread"
//             : ""
//           }`}
//       >
//         {own && (canEdit || canDelete) && (
//           <div className="admin-message-actions-hover">
//             {canEdit && (
//               <button type="button" title="Edit" onClick={() => onEdit(message)}>
//                 ✎
//               </button>
//             )}

//             {canDelete && (
//               <button type="button" title="Delete" onClick={() => onDelete(message)}>
//                 🗑
//               </button>
//             )}
//           </div>
//         )}

//         {messageType === "connect_card" ? (
//           <ConnectCard message={message} />
//         ) : isAutomatic ? (
//           <div className="admin-connect-auto">
//             <b>Connect Request</b>
//             <p>{renderTextWithLinks(text)}</p>
//           </div>
//         ) : (
//           text && <p className="admin-chat-text">{renderTextWithLinks(text)}</p>
//         )}

//         {hasFiles && (
//           <div className="admin-chat-files">
//             {files.map((file, index) => (
//               <MessageFile key={file?._id || index} file={file} />
//             ))}
//           </div>
//         )}

//         <div className="admin-chat-meta">
//           <span>{formatTime(message?.createdAt)}</span>
//           {own && <span>{read ? "✓✓ Read" : "✓ Sent"}</span>}
//         </div>
//       </div>
//     </div>
//   );
// }


// export default function AdminChatPage() {
//   const { showAlert } = useAlert();
//   const [searchParams, setSearchParams] = useSearchParams();

//   const [rooms, setRooms] = useState([]);
//   const [activeRoom, setActiveRoom] = useState(null);
//   const [messages, setMessages] = useState([]);

//   const [search, setSearch] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [mobileChatOpen, setMobileChatOpen] = useState(false);

//   const [text, setText] = useState("");
//   const [emojiOpen, setEmojiOpen] = useState(false);

//   const [loadingRooms, setLoadingRooms] = useState(true);
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [sending, setSending] = useState(false);

//   const [editingMessage, setEditingMessage] = useState(null);
//   const [pendingFiles, setPendingFiles] = useState([]);

//   const [recording, setRecording] = useState(false);
//   const [recordSeconds, setRecordSeconds] = useState(0);
//   const [voiceReady, setVoiceReady] = useState(false);

//   const fileInputRef = useRef(null);
//   const bottomRef = useRef(null);
//   const recorderRef = useRef(null);
//   const chunksRef = useRef([]);
//   const streamRef = useRef(null);
//   const recordTimerRef = useRef(null);
//   const sendingRef = useRef(false);
//   const activeRoomIdRef = useRef("");




//   const emojiPickerRef = useRef(null);




//   const activeRoomId = getRoomId(activeRoom);
//   const activeStudent = useMemo(() => getStudent(activeRoom), [activeRoom]);

//   useEffect(() => {
//     activeRoomIdRef.current = activeRoomId || "";
//   }, [activeRoomId]);

//   const filteredRooms = useMemo(() => {
//     const keyword = search.trim().toLowerCase();

//     if (!keyword) return rooms;

//     return rooms.filter((room) => {
//       const student = getStudent(room);
//       const name = getUserName(student, "").toLowerCase();
//       const email = String(student?.email || "").toLowerCase();
//       return name.includes(keyword) || email.includes(keyword);
//     });
//   }, [rooms, search]);

//   function appendUniqueMessage(newMessage) {
//     if (!newMessage?._id) return;

//     setMessages((prev) => {
//       const exists = prev.some(
//         (message) => String(message._id) === String(newMessage._id)
//       );

//       if (exists) return prev;
//       return [...prev, newMessage];
//     });
//   }

//   function scrollToBottom() {
//     setTimeout(() => {
//       bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, 80);
//   }

//   function formatRecordTime(seconds) {
//     const min = String(Math.floor(seconds / 60)).padStart(2, "0");
//     const sec = String(seconds % 60).padStart(2, "0");
//     return `${min}:${sec}`;
//   }

//   async function fetchRooms(options = {}) {
//     const { silent = false, preferredRoomId = activeRoomIdRef.current } = options;

//     try {
//       if (!silent) setLoadingRooms(true);

//       const { data } = await api.get("/chat/rooms");
//       const list = data?.rooms || data?.chatRooms || [];

//       setRooms(list);

//       const queryRoomId = searchParams.get("roomId");
//       const keepRoomId = preferredRoomId || queryRoomId || activeRoomIdRef.current;

//       const selected =
//         list.find((room) => String(getRoomId(room)) === String(keepRoomId)) ||
//         list.find((room) => String(getRoomId(room)) === String(queryRoomId)) ||
//         list[0] ||
//         null;

//       setActiveRoom(selected);

//       if (selected) {
//         const selectedId = getRoomId(selected);
//         activeRoomIdRef.current = selectedId;

//         if (String(queryRoomId) !== String(selectedId)) {
//           setSearchParams({ roomId: selectedId }, { replace: true });
//         }
//       }
//     } catch (err) {
//       showAlert(getErrorMessage(err, "Failed to load chat rooms"), "error");
//     } finally {
//       if (!silent) setLoadingRooms(false);
//     }
//   }

//   async function refreshRoomListOnly() {
//     try {
//       const keepRoomId = activeRoomIdRef.current;
//       const { data } = await api.get("/chat/rooms");
//       const list = data?.rooms || data?.chatRooms || [];

//       setRooms(list);

//       const updatedActiveRoom = list.find(
//         (room) => String(getRoomId(room)) === String(keepRoomId)
//       );

//       if (updatedActiveRoom) {
//         setActiveRoom(updatedActiveRoom);
//       }
//     } catch {
//       // silent refresh
//     }
//   }

//   async function fetchStudents(keyword = "") {
//     try {
//       const { data } = await api.get("/admin/student/all");
//       const students = data?.students || [];

//       const clean = keyword.trim().toLowerCase();

//       if (!clean) {
//         setSearchResults([]);
//         return;
//       }

//       const existingStudentIds = new Set(
//         rooms.map((room) => String(getStudent(room)?._id || getStudent(room)?.id))
//       );

//       const filtered = students.filter((student) => {
//         const name = String(student?.name || "").toLowerCase();
//         const email = String(student?.email || "").toLowerCase();
//         return name.includes(clean) || email.includes(clean);
//       });

//       setSearchResults(
//         filtered.map((student) => ({
//           student,
//           isNew: !existingStudentIds.has(String(student._id || student.id)),
//         }))
//       );
//     } catch (err) {
//       showAlert(getErrorMessage(err, "Failed to search students"), "error");
//     }
//   }

//   async function fetchMessages(roomId) {
//     if (!roomId) return;

//     try {
//       setLoadingMessages(true);


//       const { data } = await api.get(`/chat/messages/${roomId}`);
//       setMessages(data?.messages || []);
//       await api.patch(`/chat/read/${roomId}`);
//       scrollToBottom();
//     } catch (err) {
//       showAlert(getErrorMessage(err, "Failed to load messages"), "error");
//     } finally {
//       setLoadingMessages(false);
//     }
//   }

//   function selectRoom(room) {
//     const roomId = getRoomId(room);
//     activeRoomIdRef.current = roomId;
//     setActiveRoom(room);
//     setSearchParams({ roomId }, { replace: true });
//     setMessages([]);
//     setMobileChatOpen(true);
//   }

//   async function selectStudentFromSearch(student) {
//     try {
//       const studentId = student?._id || student?.id;
//       const { data } = await api.post(`/chat/admin-student-room/${studentId}`);
//       const room = data?.room || data?.chatRoom;

//       if (room) {
//         const roomId = getRoomId(room);
//         activeRoomIdRef.current = roomId;

//         setActiveRoom(room);
//         setSearchParams({ roomId }, { replace: true });
//         setSearch("");
//         setSearchResults([]);
//         setMessages([]);
//         setMobileChatOpen(true);

//         await fetchRooms({ silent: true, preferredRoomId: roomId });
//       }
//     } catch (err) {
//       showAlert(getErrorMessage(err, "Failed to open chat"), "error");
//     }
//   }

//   useEffect(() => {
//     fetchRooms();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);




//   useEffect(() => {
//     function handleOutsideClick(e) {
//       if (
//         emojiOpen &&
//         emojiPickerRef.current &&
//         !emojiPickerRef.current.contains(e.target)
//       ) {
//         setEmojiOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleOutsideClick);

//     return () => {
//       document.removeEventListener("mousedown", handleOutsideClick);
//     };
//   }, [emojiOpen]);



//   useEffect(() => {
//     if (!activeRoomId) return;

//     fetchMessages(activeRoomId);

//     const socket = connectSocket();

//     socket.emit("joinRoom", activeRoomId);
//     socket.emit("join_room", activeRoomId);

//     function handleNewMessage(message) {
//       const roomId = message?.roomId?._id || message?.roomId || message?.chatRoomId;

//       if (String(roomId) === String(activeRoomIdRef.current)) {
//         appendUniqueMessage(message);
//         api.patch(`/chat/read/${activeRoomIdRef.current}`).catch(() => { });
//         scrollToBottom();
//       }

//       refreshRoomListOnly();
//     }

//     function handleMessageDeleted(payload) {
//       const messageId = payload?.messageId || payload?._id;

//       setMessages((prev) =>
//         prev.filter((message) => String(message._id) !== String(messageId))
//       );

//       refreshRoomListOnly();
//     }

//     function handleMessageUpdated(updated) {
//       setMessages((prev) =>
//         prev.map((message) =>
//           String(message._id) === String(updated._id) ? updated : message
//         )
//       );

//       refreshRoomListOnly();
//     }

//     function handleChatListUpdated() {
//       refreshRoomListOnly();
//     }

//     socket.on("new_message", handleNewMessage);
//     socket.on("newMessage", handleNewMessage);
//     socket.on("messageDeleted", handleMessageDeleted);
//     socket.on("messageUpdated", handleMessageUpdated);
//     socket.on("chat_list_updated", handleChatListUpdated);

//     return () => {
//       socket.emit("leaveRoom", activeRoomId);
//       socket.emit("leave_room", activeRoomId);

//       socket.off("new_message", handleNewMessage);
//       socket.off("newMessage", handleNewMessage);
//       socket.off("messageDeleted", handleMessageDeleted);
//       socket.off("messageUpdated", handleMessageUpdated);
//       socket.off("chat_list_updated", handleChatListUpdated);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [activeRoomId]);

//   async function sendTextMessage() {
//     const roomIdToSend = activeRoomIdRef.current || activeRoomId;

//     if (!roomIdToSend || sendingRef.current) return;

//     const cleanText = text.trim();

//     if (!cleanText && pendingFiles.length === 0) return;

//     try {
//       sendingRef.current = true;
//       setSending(true);

//       if (editingMessage) {
//         const { data } = await api.patch(`/chat/message/${editingMessage._id}`, {
//           text: cleanText,
//           message: cleanText,
//         });

//         const updated = data?.message || data?.chatMessage;

//         setMessages((prev) =>
//           prev.map((message) =>
//             String(message._id) === String(editingMessage._id)
//               ? { ...message, ...updated, text: cleanText, message: cleanText }
//               : message
//           )
//         );

//         setEditingMessage(null);
//         setText("");
//         showAlert("Message updated", "success");
//         await refreshRoomListOnly();
//         return;
//       }

//       if (pendingFiles.length > 0) {
//         const filesToSend = [...pendingFiles];

//         setPendingFiles([]);
//         setVoiceReady(false);

//         const formData = new FormData();

//         if (cleanText) {
//           formData.append("text", cleanText);
//           formData.append("message", cleanText);
//         }

//         filesToSend.forEach((file) => {
//           formData.append("files", file);
//         });

//         const { data } = await api.post(
//           `/chat/file-message/${roomIdToSend}`,
//           formData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );

//         const newMessage = data?.message || data?.chatMessage;

//         if (newMessage) {
//           appendUniqueMessage(newMessage);
//         }

//         setText("");
//         scrollToBottom();
//         await refreshRoomListOnly();
//         return;
//       }

//       const { data } = await api.post(`/chat/message/${roomIdToSend}`, {
//         text: cleanText,
//         message: cleanText,
//         // messageType: emojis.includes(cleanText) ? "emoji" : "text",
//         messageType: "text",
//       });

//       const newMessage = data?.message || data?.chatMessage;

//       if (newMessage) {
//         appendUniqueMessage(newMessage);
//       }

//       setText("");
//       scrollToBottom();

//       await refreshRoomListOnly();
//     } catch (err) {
//       showAlert(getErrorMessage(err, "Failed to send message"), "error");
//     } finally {
//       setSending(false);
//       sendingRef.current = false;
//     }
//   }

//   function startEdit(message) {
//     setEditingMessage(message);
//     setText(getText(message));
//     setPendingFiles([]);
//     setVoiceReady(false);
//   }

//   async function deleteMessage(message) {
//     try {
//       await api.delete(`/chat/message/${message._id}`);

//       setMessages((prev) =>
//         prev.filter((item) => String(item._id) !== String(message._id))
//       );

//       await refreshRoomListOnly();
//       showAlert("Message deleted", "success");
//     } catch (err) {
//       showAlert(getErrorMessage(err, "Failed to delete message"), "error");
//     }
//   }

//   function handleFileSelect(event) {
//     const selectedFiles = Array.from(event.target.files || []);

//     if (selectedFiles.length > 0) {
//       setPendingFiles(selectedFiles);
//       setVoiceReady(false);
//       setEditingMessage(null);
//     }

//     event.target.value = "";
//   }

//   function removePendingFile(index) {
//     setPendingFiles((prev) => {
//       const next = prev.filter((_, i) => i !== index);

//       if (next.length === 0) {
//         setVoiceReady(false);
//       }

//       return next;
//     });
//   }

//   async function startRecording() {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

//       streamRef.current = stream;
//       chunksRef.current = [];

//       const recorder = new MediaRecorder(stream);
//       recorderRef.current = recorder;

//       recorder.ondataavailable = (event) => {
//         if (event.data && event.data.size > 0) {
//           chunksRef.current.push(event.data);
//         }
//       };

//       recorder.onstop = () => {
//         const blob = new Blob(chunksRef.current, { type: "audio/webm" });

//         if (blob.size > 0) {
//           const file = new File([blob], `voice_${Date.now()}.webm`, {
//             type: "audio/webm",
//           });

//           setPendingFiles([file]);
//           setVoiceReady(true);
//         }

//         streamRef.current?.getTracks().forEach((track) => track.stop());
//         streamRef.current = null;

//         clearInterval(recordTimerRef.current);
//       };

//       recorder.start();

//       setRecording(true);
//       setRecordSeconds(0);
//       setVoiceReady(false);
//       setPendingFiles([]);
//       setEditingMessage(null);

//       recordTimerRef.current = setInterval(() => {
//         setRecordSeconds((prev) => prev + 1);
//       }, 1000);
//     } catch (err) {
//       showAlert("Microphone permission denied or not available", "error");
//     }
//   }

//   function stopRecording() {
//     if (recorderRef.current && recorderRef.current.state !== "inactive") {
//       recorderRef.current.stop();
//     }

//     setRecording(false);
//   }

//   function cancelRecording() {
//     if (recorderRef.current && recorderRef.current.state !== "inactive") {
//       recorderRef.current.onstop = null;
//       recorderRef.current.stop();
//     }

//     streamRef.current?.getTracks().forEach((track) => track.stop());
//     streamRef.current = null;

//     clearInterval(recordTimerRef.current);

//     setRecording(false);
//     setRecordSeconds(0);
//     setPendingFiles([]);
//     setVoiceReady(false);
//   }

//   // function addEmoji(emoji) {
//   //   setText((prev) => `${prev}${emoji}`);
//   //   setEmojiOpen(false);
//   // }



//   function addEmoji(emoji) {
//     setText((prev) => `${prev}${emoji}`);
//   }



//   return (
//     <div className="admin-chat-page">
//       <div
//         className={`admin-chat-shell ${mobileChatOpen ? "admin-mobile-chat-open" : ""
//           }`}
//       >
//         <aside className="admin-chat-sidebar">
//           <div className="admin-chat-sidebar-head">
//             <h2>Chats</h2>
//           </div>

//           <div className="admin-chat-search-box">
//             <input
//               type="text"
//               placeholder="Search students..."
//               value={search}
//               onChange={(e) => {
//                 const value = e.target.value;
//                 setSearch(value);
//                 fetchStudents(value);
//               }}
//             />
//           </div>

//           <div className="admin-chat-room-list">
//             {loadingRooms ? (
//               <div className="admin-chat-list-state">Loading chats...</div>
//             ) : search.trim() && searchResults.length > 0 ? (
//               searchResults.map(({ student, isNew }) => (
//                 <button
//                   key={student._id || student.id}
//                   type="button"
//                   className="admin-chat-room-item"
//                   onClick={() => selectStudentFromSearch(student)}
//                 >
//                   <Avatar user={student} className="admin-chat-room-avatar" />

//                   <div className="admin-chat-room-info">
//                     <div className="admin-chat-room-top">
//                       <h4>{getUserName(student)}</h4>
//                       {isNew && <span>New</span>}
//                     </div>

//                     <p>{student.email}</p>
//                     <small>Tap to chat</small>
//                   </div>
//                 </button>
//               ))
//             ) : filteredRooms.length === 0 ? (
//               <div className="admin-chat-list-state">No chats found</div>
//             ) : (
//               filteredRooms.map((room) => {
//                 const roomId = getRoomId(room);
//                 const student = getStudent(room);
//                 const active = String(roomId) === String(activeRoomId);

//                 return (
//                   <button
//                     key={roomId}
//                     type="button"
//                     className={`admin-chat-room-item ${active ? "admin-chat-room-item--active" : ""
//                       }`}
//                     onClick={() => selectRoom(room)}
//                   >
//                     <Avatar user={student} className="admin-chat-room-avatar" />

//                     <div className="admin-chat-room-info">
//                       <div className="admin-chat-room-top">
//                         <h4>{getUserName(student)}</h4>
//                         <span>{formatTime(room?.lastMessageAt)}</span>
//                       </div>

//                       <p>{room?.lastMessage || "No messages yet"}</p>

//                       <small className={room?.studentOnline ? "online" : ""}>
//                         {room?.studentOnline
//                           ? "Online"
//                           : formatLastSeen(student?.lastSeen)}
//                       </small>
//                     </div>
//                   </button>
//                 );
//               })
//             )}
//           </div>
//         </aside>

//         <section className="admin-chat-main">
//           {!activeRoom ? (
//             <div className="admin-chat-empty">
//               <h2>Select a student</h2>
//               <p>Choose a chat to start messaging.</p>
//             </div>
//           ) : (
//             <div className="admin-chat-app">
//               <header className="admin-chat-header">
//                 <button
//                   type="button"
//                   className="admin-chat-mobile-back"
//                   onClick={() => setMobileChatOpen(false)}
//                 >
//                   ‹
//                 </button>

//                 <div className="admin-chat-user">
//                   <Avatar user={activeStudent} />

//                   <div>
//                     <h3>{getUserName(activeStudent)}</h3>
//                     <p className={activeRoom?.studentOnline ? "online" : ""}>
//                       {activeRoom?.studentOnline
//                         ? "Online"
//                         : formatLastSeen(activeStudent?.lastSeen)}
//                     </p>
//                   </div>
//                 </div>
//               </header>

//               <main className="admin-chat-body">
//                 {loadingMessages ? (
//                   <div className="admin-chat-no-message">Loading messages...</div>
//                 ) : messages.length === 0 ? (
//                   <div className="admin-chat-no-message">
//                     No messages yet. Send a message to this student.
//                   </div>
//                 ) : (
//                   messages.map((message) => (
//                     <MessageBubble
//                       key={message._id}
//                       message={message}
//                       onEdit={startEdit}
//                       onDelete={deleteMessage}
//                     />
//                   ))
//                 )}

//                 <div ref={bottomRef} />
//               </main>

//               {recording && (
//                 <div className="admin-recording-panel">
//                   <button
//                     type="button"
//                     className="admin-record-trash"
//                     onClick={cancelRecording}
//                   >
//                     🗑
//                   </button>

//                   <span className="admin-record-dot" />
//                   <b>{formatRecordTime(recordSeconds)}</b>

//                   <div className="admin-record-waves">
//                     {Array.from({ length: 8 }).map((_, index) => (
//                       <span key={index} />
//                     ))}
//                   </div>

//                   <button
//                     type="button"
//                     className="admin-record-stop"
//                     onClick={stopRecording}
//                   >
//                     ■
//                   </button>
//                 </div>
//               )}

//               {pendingFiles.length > 0 && !recording && (
//                 <div className="admin-selected-file-bar">
//                   <div className="admin-selected-file-list">
//                     {pendingFiles.map((file, index) => (
//                       <div
//                         key={`${file.name}-${index}`}
//                         className="admin-selected-file-chip"
//                       >
//                         <span>{voiceReady ? "🎙️" : "📎"}</span>
//                         <b>{voiceReady ? "Voice message ready" : file.name}</b>

//                         <button
//                           type="button"
//                           onClick={() => removePendingFile(index)}
//                         >
//                           ✕
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <footer className="admin-chat-inputbar">








//                 {emojiOpen && (
//                   <div
//                     className="admin-emoji-picker-wrap"
//                     ref={emojiPickerRef}
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <EmojiPicker
//                       theme="dark"
//                       width="100%"
//                       height={390}
//                       searchPlaceholder="Search emoji"
//                       previewConfig={{
//                         showPreview: false,
//                       }}
//                       skinTonesDisabled={false}
//                       lazyLoadEmojis={true}
//                       onEmojiClick={(emojiData) => {
//                         addEmoji(emojiData.emoji);
//                       }}
//                     />
//                   </div>
//                 )}






//                 <button
//                   type="button"
//                   className="admin-chat-icon-btn"
//                   onClick={() => setEmojiOpen((prev) => !prev)}
//                 >
//                   😊
//                 </button>

//                 <button
//                   type="button"
//                   className="admin-chat-icon-btn"
//                   onClick={() => fileInputRef.current?.click()}
//                   disabled={recording || sending}
//                 >
//                   📎
//                 </button>

//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   multiple
//                   hidden
//                   onChange={handleFileSelect}
//                 />

//                 <button
//                   type="button"
//                   className={`admin-chat-icon-btn ${recording ? "recording-active" : ""
//                     }`}
//                   onClick={recording ? stopRecording : startRecording}
//                   disabled={sending || pendingFiles.length > 0}
//                 >
//                   {recording ? "■" : "🎙️"}
//                 </button>

//                 <input
//                   type="text"
//                   placeholder={
//                     editingMessage
//                       ? "Edit message..."
//                       : pendingFiles.length > 0
//                         ? "Add caption..."
//                         : recording
//                           ? "Recording voice..."
//                           : "Type a message..."
//                   }
//                   value={text}
//                   onChange={(e) => setText(e.target.value)}
//                   disabled={recording}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       e.preventDefault();
//                       sendTextMessage();
//                     }
//                   }}
//                 />

//                 {editingMessage && (
//                   <button
//                     type="button"
//                     className="admin-chat-cancel-edit"
//                     onClick={() => {
//                       setEditingMessage(null);
//                       setText("");
//                     }}
//                   >
//                     ✕
//                   </button>
//                 )}

//                 <button
//                   type="button"
//                   className="admin-chat-send"
//                   onClick={sendTextMessage}
//                   disabled={
//                     sending ||
//                     recording ||
//                     (!text.trim() && pendingFiles.length === 0)
//                   }
//                 >
//                   ➤
//                 </button>
//               </footer>
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }






























































































































import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import { connectSocket } from "../socket";
import "./AdminChatPage.css";

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
  return message?.isRead === true || message?.read === true;
}

function getStudent(room) {
  return room?.studentId || room?.student || null;
}

function getUserName(user, fallback = "Student") {
  return user?.name || user?.email || fallback;
}

function formatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatLastSeen(value) {
  if (!value) return "Offline";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Offline";
  return `Last seen ${date.toLocaleString()}`;
}

function getImageSrc(value) {
  if (!value) return "";
  const src = String(value).trim();

  if (
    src.startsWith("data:image") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("blob:")
  ) {
    return src;
  }

  return getMediaUrl(src);
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
            className="admin-chat-link"
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

function Avatar({ user, className = "admin-chat-avatar" }) {
  const name = getUserName(user, "User");
  const photo = user?.photo || user?.image || user?.avatar;
  const src = getImageSrc(photo);

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
    return <img className="admin-chat-file-img" src={url} alt={name} />;
  }

  if (isVideoFile(file)) {
    return <video className="admin-chat-file-video" src={url} controls />;
  }

  if (isAudioFile(file)) {
    return <audio className="admin-chat-file-audio" src={url} controls />;
  }

  return (
    <a className="admin-chat-file-link" href={url} target="_blank" rel="noreferrer">
      📎 {name}
    </a>
  );
}

function ConnectCard({ message }) {
  const navigate = useNavigate();
  const card = message?.connectCard || {};
  const text = getText(message);

  function openTutorDetails() {
    if (card?.tuterId) {
      navigate(`/admin/tutors/${card.tuterId}`);
    }
  }

  return (
    <>
      <div className="admin-connect-preview-image-card" onClick={openTutorDetails}>
        {card?.image ? (
          <img src={getImageSrc(card.image)} alt={card.name || "Tutor"} />
        ) : (
          <div className="admin-connect-preview-fallback">
            {card?.name?.charAt(0)?.toUpperCase() || "T"}
          </div>
        )}

        <div className="admin-connect-preview-overlay">
          <h4>{card?.name || "Tutor Details"}</h4>
          <p>{card?.qualification || "Qualification not added"}</p>
          <span>Tap to view full tutor details</span>
        </div>
      </div>

      {text ? (
        <p className="admin-connect-request-text">{renderTextWithLinks(text)}</p>
      ) : null}
    </>
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
    <div className={`admin-chat-row ${own ? "admin-chat-row--own" : ""}`}>
      <div
        className={`admin-chat-bubble ${
          own
            ? read
              ? "admin-chat-bubble--own-read"
              : "admin-chat-bubble--own-unread"
            : ""
        }`}
      >
        {own && (canEdit || canDelete) && (
          <div className="admin-message-actions-hover">
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
          <ConnectCard message={message} />
        ) : isAutomatic ? (
          <div className="admin-connect-auto">
            <b>Connect Request</b>
            <p>{renderTextWithLinks(text)}</p>
          </div>
        ) : (
          text && <p className="admin-chat-text">{renderTextWithLinks(text)}</p>
        )}

        {hasFiles && (
          <div className="admin-chat-files">
            {files.map((file, index) => (
              <MessageFile key={file?._id || index} file={file} />
            ))}
          </div>
        )}

        <div className="admin-chat-meta">
          <span>{formatTime(message?.createdAt)}</span>
          {own && <span>{read ? "✓✓ Read" : "✓ Sent"}</span>}
        </div>
      </div>
    </div>
  );
}

export default function AdminChatPage() {
  const { showAlert } = useAlert();
  const [searchParams, setSearchParams] = useSearchParams();

  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
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
  const activeStudent = useMemo(() => getStudent(activeRoom), [activeRoom]);

  useEffect(() => {
    activeRoomIdRef.current = activeRoomId || "";
  }, [activeRoomId]);

  const filteredRooms = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return rooms;

    return rooms.filter((room) => {
      const student = getStudent(room);
      const name = getUserName(student, "").toLowerCase();
      const email = String(student?.email || "").toLowerCase();
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

  async function fetchRooms(options = {}) {
    const { silent = false, preferredRoomId = activeRoomIdRef.current } = options;

    try {
      if (!silent) setLoadingRooms(true);

      const { data } = await api.get("/chat/rooms");
      const list = data?.rooms || data?.chatRooms || [];

      setRooms(list);

      const queryRoomId = searchParams.get("roomId");
      const keepRoomId = preferredRoomId || queryRoomId || activeRoomIdRef.current;

      const selected =
        list.find((room) => String(getRoomId(room)) === String(keepRoomId)) ||
        list.find((room) => String(getRoomId(room)) === String(queryRoomId)) ||
        list[0] ||
        null;

      setActiveRoom(selected);

      if (selected) {
        const selectedId = getRoomId(selected);
        activeRoomIdRef.current = selectedId;

        if (String(queryRoomId) !== String(selectedId)) {
          setSearchParams({ roomId: selectedId }, { replace: true });
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
      const list = data?.rooms || data?.chatRooms || [];

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

  async function fetchStudents(keyword = "") {
    try {
      const { data } = await api.get("/admin/student/all");
      const students = data?.students || [];
      const clean = keyword.trim().toLowerCase();

      if (!clean) {
        setSearchResults([]);
        return;
      }

      const existingStudentIds = new Set(
        rooms.map((room) => String(getStudent(room)?._id || getStudent(room)?.id))
      );

      const filtered = students.filter((student) => {
        const name = String(student?.name || "").toLowerCase();
        const email = String(student?.email || "").toLowerCase();
        return name.includes(clean) || email.includes(clean);
      });

      setSearchResults(
        filtered.map((student) => ({
          student,
          isNew: !existingStudentIds.has(String(student._id || student.id)),
        }))
      );
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to search students"), "error");
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

  async function selectStudentFromSearch(student) {
    try {
      const studentId = student?._id || student?.id;
      const { data } = await api.post(`/chat/admin-student-room/${studentId}`);
      const room = data?.room || data?.chatRoom;

      if (room) {
        const roomId = getRoomId(room);
        activeRoomIdRef.current = roomId;

        setActiveRoom(room);
        setSearchParams({ roomId }, { replace: true });
        setSearch("");
        setSearchResults([]);
        setMessages([]);
        setMobileChatOpen(true);

        await fetchRooms({ silent: true, preferredRoomId: roomId });
      }
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to open chat"), "error");
    }
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
      const roomId = message?.roomId?._id || message?.roomId || message?.chatRoomId;

      if (String(roomId) === String(activeRoomIdRef.current)) {
        appendUniqueMessage(message);
        api.patch(`/chat/read/${activeRoomIdRef.current}`).catch(() => {});
        scrollToBottom();
      }

      refreshRoomListOnly();
    }

    function handleMessageDeleted(payload) {
      const messageId = payload?.messageId || payload?._id;

      setMessages((prev) =>
        prev.filter((message) => String(message._id) !== String(messageId))
      );

      refreshRoomListOnly();
    }

    function handleMessageUpdated(updated) {
      setMessages((prev) =>
        prev.map((message) =>
          String(message._id) === String(updated._id) ? updated : message
        )
      );

      refreshRoomListOnly();
    }

    function handleChatListUpdated() {
      refreshRoomListOnly();
    }

    socket.on("new_message", handleNewMessage);
    socket.on("newMessage", handleNewMessage);
    socket.on("messageDeleted", handleMessageDeleted);
    socket.on("messageUpdated", handleMessageUpdated);
    socket.on("chat_list_updated", handleChatListUpdated);

    return () => {
      socket.emit("leaveRoom", activeRoomId);
      socket.emit("leave_room", activeRoomId);

      socket.off("new_message", handleNewMessage);
      socket.off("newMessage", handleNewMessage);
      socket.off("messageDeleted", handleMessageDeleted);
      socket.off("messageUpdated", handleMessageUpdated);
      socket.off("chat_list_updated", handleChatListUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoomId]);

  async function sendTextMessage() {
    const roomIdToSend = activeRoomIdRef.current || activeRoomId;

    if (!roomIdToSend || sendingRef.current) return;

    const cleanText = text.trim();

    if (!cleanText && pendingFiles.length === 0) return;

    try {
      sendingRef.current = true;
      setSending(true);

      if (editingMessage) {
        const { data } = await api.patch(`/chat/message/${editingMessage._id}`, {
          text: cleanText,
          message: cleanText,
        });

        const updated = data?.message || data?.chatMessage;

        setMessages((prev) =>
          prev.map((message) =>
            String(message._id) === String(editingMessage._id)
              ? { ...message, ...updated, text: cleanText, message: cleanText }
              : message
          )
        );

        setEditingMessage(null);
        setText("");
        showAlert("Message updated", "success");
        await refreshRoomListOnly();
        return;
      }

      if (pendingFiles.length > 0) {
        const filesToSend = [...pendingFiles];

        setPendingFiles([]);
        setVoiceReady(false);

        const formData = new FormData();

        if (cleanText) {
          formData.append("text", cleanText);
          formData.append("message", cleanText);
        }

        filesToSend.forEach((file) => {
          formData.append("files", file);
        });

        const { data } = await api.post(
          `/chat/file-message/${roomIdToSend}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const newMessage = data?.message || data?.chatMessage;

        if (newMessage) {
          appendUniqueMessage(newMessage);
        }

        setText("");
        scrollToBottom();
        await refreshRoomListOnly();
        return;
      }

      const { data } = await api.post(`/chat/message/${roomIdToSend}`, {
        text: cleanText,
        message: cleanText,
        messageType: "text",
      });

      const newMessage = data?.message || data?.chatMessage;

      if (newMessage) {
        appendUniqueMessage(newMessage);
      }

      setText("");
      scrollToBottom();
      await refreshRoomListOnly();
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
    setPendingFiles([]);
    setVoiceReady(false);
  }

  async function deleteMessage(message) {
    try {
      await api.delete(`/chat/message/${message._id}`);

      setMessages((prev) =>
        prev.filter((item) => String(item._id) !== String(message._id))
      );

      await refreshRoomListOnly();
      showAlert("Message deleted", "success");
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to delete message"), "error");
    }
  }

  function handleFileSelect(event) {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length > 0) {
      setPendingFiles(selectedFiles);
      setVoiceReady(false);
      setEditingMessage(null);
    }

    event.target.value = "";
  }

  function removePendingFile(index) {
    setPendingFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);

      if (next.length === 0) {
        setVoiceReady(false);
      }

      return next;
    });
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });

        if (blob.size > 0) {
          const file = new File([blob], `voice_${Date.now()}.webm`, {
            type: "audio/webm",
          });

          setPendingFiles([file]);
          setVoiceReady(true);
        }

        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        clearInterval(recordTimerRef.current);
      };

      recorder.start();

      setRecording(true);
      setRecordSeconds(0);
      setVoiceReady(false);
      setPendingFiles([]);
      setEditingMessage(null);

      recordTimerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      showAlert("Microphone permission denied or not available", "error");
    }
  }

  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }

    setRecording(false);
  }

  function cancelRecording() {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.onstop = null;
      recorderRef.current.stop();
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    clearInterval(recordTimerRef.current);

    setRecording(false);
    setRecordSeconds(0);
    setPendingFiles([]);
    setVoiceReady(false);
  }

  function addEmoji(emoji) {
    setText((prev) => `${prev}${emoji}`);
  }

  return (
    <div className="admin-chat-page">
      <div className="admin-chat-layout">
        <aside
          className={`admin-chat-student-panel ${
            mobileChatOpen ? "admin-chat-student-panel--hide-mobile" : ""
          }`}
        >
          <div className="admin-chat-panel-card">
            <div className="admin-chat-sidebar-head">
              <h2>Chats</h2>
            </div>

            <div className="admin-chat-search-box">
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);
                  fetchStudents(value);
                }}
              />
            </div>

            <div className="admin-chat-room-list">
              {loadingRooms ? (
                <div className="admin-chat-list-state">Loading chats...</div>
              ) : search.trim() && searchResults.length > 0 ? (
                searchResults.map(({ student, isNew }) => (
                  <button
                    key={student._id || student.id}
                    type="button"
                    className="admin-chat-room-item"
                    onClick={() => selectStudentFromSearch(student)}
                  >
                    <Avatar user={student} className="admin-chat-room-avatar" />

                    <div className="admin-chat-room-info">
                      <div className="admin-chat-room-top">
                        <h4>{getUserName(student)}</h4>
                        {isNew && <span>New</span>}
                      </div>

                      <p>{student.email}</p>
                      <small>Tap to chat</small>
                    </div>
                  </button>
                ))
              ) : filteredRooms.length === 0 ? (
                <div className="admin-chat-list-state">No chats found</div>
              ) : (
                filteredRooms.map((room) => {
                  const roomId = getRoomId(room);
                  const student = getStudent(room);
                  const active = String(roomId) === String(activeRoomId);

                  return (
                    <button
                      key={roomId}
                      type="button"
                      className={`admin-chat-room-item ${
                        active ? "admin-chat-room-item--active" : ""
                      }`}
                      onClick={() => openChatView(room)}
                    >
                      <Avatar user={student} className="admin-chat-room-avatar" />

                      <div className="admin-chat-room-info">
                        <div className="admin-chat-room-top">
                          <h4>{getUserName(student)}</h4>
                          <span>{formatTime(room?.lastMessageAt)}</span>
                        </div>

                        <p>{room?.lastMessage || "No messages yet"}</p>

                        <small className={room?.studentOnline ? "online" : ""}>
                          {room?.studentOnline
                            ? "Online"
                            : formatLastSeen(student?.lastSeen)}
                        </small>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </aside>

        <section
          className={`admin-chat-detail-panel ${
            mobileChatOpen ? "admin-chat-detail-panel--open-mobile" : ""
          }`}
        >
          <div className="admin-chat-detail-card">
            {!activeRoom ? (
              <div className="admin-chat-empty">
                <h2>Select a student</h2>
                <p>Choose a chat to start messaging.</p>
              </div>
            ) : (
              <div className="admin-chat-app">
                <header className="admin-chat-header">
                  <button
                    type="button"
                    className="admin-chat-mobile-back"
                    onClick={goBackToList}
                  >
                    ‹
                  </button>

                  <div className="admin-chat-user">
                    <Avatar user={activeStudent} />

                    <div>
                      <h3>{getUserName(activeStudent)}</h3>
                      <p className={activeRoom?.studentOnline ? "online" : ""}>
                        {activeRoom?.studentOnline
                          ? "Online"
                          : formatLastSeen(activeStudent?.lastSeen)}
                      </p>
                    </div>
                  </div>
                </header>

                <main className="admin-chat-body">
                  {loadingMessages ? (
                    <div className="admin-chat-no-message">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="admin-chat-no-message">
                      No messages yet. Send a message to this student.
                    </div>
                  ) : (
                    messages.map((message) => (
                      <MessageBubble
                        key={message._id}
                        message={message}
                        onEdit={startEdit}
                        onDelete={deleteMessage}
                      />
                    ))
                  )}

                  <div ref={bottomRef} />
                </main>

                {recording && (
                  <div className="admin-recording-panel">
                    <button
                      type="button"
                      className="admin-record-trash"
                      onClick={cancelRecording}
                    >
                      🗑
                    </button>

                    <span className="admin-record-dot" />
                    <b>{formatRecordTime(recordSeconds)}</b>

                    <div className="admin-record-waves">
                      {Array.from({ length: 8 }).map((_, index) => (
                        <span key={index} />
                      ))}
                    </div>

                    <button
                      type="button"
                      className="admin-record-stop"
                      onClick={stopRecording}
                    >
                      ■
                    </button>
                  </div>
                )}

                {pendingFiles.length > 0 && !recording && (
                  <div className="admin-selected-file-bar">
                    <div className="admin-selected-file-list">
                      {pendingFiles.map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="admin-selected-file-chip"
                        >
                          <span>{voiceReady ? "🎙️" : "📎"}</span>
                          <b>{voiceReady ? "Voice message ready" : file.name}</b>

                          <button
                            type="button"
                            onClick={() => removePendingFile(index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <footer className="admin-chat-inputbar">
                  {emojiOpen && (
                    <div
                      className="admin-emoji-picker-wrap"
                      ref={emojiPickerRef}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <EmojiPicker
                        theme="dark"
                        width="100%"
                        height={390}
                        searchPlaceholder="Search emoji"
                        previewConfig={{
                          showPreview: false,
                        }}
                        skinTonesDisabled={false}
                        lazyLoadEmojis
                        onEmojiClick={(emojiData) => {
                          addEmoji(emojiData.emoji);
                        }}
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    className="admin-chat-icon-btn"
                    onClick={() => setEmojiOpen((prev) => !prev)}
                  >
                    😊
                  </button>

                  <button
                    type="button"
                    className="admin-chat-icon-btn"
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
                    onChange={handleFileSelect}
                  />

                  <button
                    type="button"
                    className={`admin-chat-icon-btn ${
                      recording ? "recording-active" : ""
                    }`}
                    onClick={recording ? stopRecording : startRecording}
                    disabled={sending || pendingFiles.length > 0}
                  >
                    {recording ? "■" : "🎙️"}
                  </button>

                  <input
                    type="text"
                    placeholder={
                      editingMessage
                        ? "Edit message..."
                        : pendingFiles.length > 0
                        ? "Add caption..."
                        : recording
                        ? "Recording voice..."
                        : "Type a message..."
                    }
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={recording}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sendTextMessage();
                      }
                    }}
                  />

                  {editingMessage && (
                    <button
                      type="button"
                      className="admin-chat-cancel-edit"
                      onClick={() => {
                        setEditingMessage(null);
                        setText("");
                      }}
                    >
                      ✕
                    </button>
                  )}

                  <button
                    type="button"
                    className="admin-chat-send"
                    onClick={sendTextMessage}
                    disabled={
                      sending ||
                      recording ||
                      (!text.trim() && pendingFiles.length === 0)
                    }
                  >
                    ➤
                  </button>
                </footer>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}