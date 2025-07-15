import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";

export default function NoteEditor() {
  const { id } = useParams();
  const [note, setNote] = useState({ title: "", content: "" });
  const [users, setUsers] = useState(0);
  const [saveStatus, setSaveStatus] = useState("Saved");

  const socketRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`https://notes-rdby.onrender.com/notes/${id}`);
        setNote(res.data);
      } catch (err) {
        console.error("Failed to fetch note:", err);
        setSaveStatus("Error loading note");
      }
    };

    fetchNote();

    const socket = io("https://notes-rdby.onrender.com/");
    socketRef.current = socket;

    socket.emit("join_note", id);

    socket.on("note_update", (content) => {
      setNote((prev) => ({ ...prev, content }));
    });

    socket.on("active_users", (count) => setUsers(count));

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const handleChange = (e) => {
    const content = e.target.value;
    setNote((prev) => ({ ...prev, content }));
    setSaveStatus("Saving...");

    socketRef.current?.emit("note_update", { noteId: id, content });

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      axios
        .put(`https://notes-rdby.onrender.com/notes/${id}`, { content })
        .then(() => setSaveStatus("Saved"))
        .catch((err) => {
          console.error("Save error:", err);
          setSaveStatus("Error saving");
        });
    }, 4000);
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "800px", margin: "auto" }}>
      <h2>{note.title || "Untitled Note"}</h2>
      <p>Active Users: {users}</p>
      <TextareaAutosize
        value={note.content}
        onChange={handleChange}
        minRows={10}
        style={{ width: "100%", fontSize: "1rem", padding: "0.5rem" }}
      />
      <p
        style={{
          marginTop: "0.5rem",
          fontStyle: "italic",
          color: saveStatus === "Error saving" ? "red" : "black",
        }}
      >
        {saveStatus}
      </p>
    </div>
  );
}
