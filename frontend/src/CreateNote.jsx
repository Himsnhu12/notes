import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateNote() {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const createNote = async () => {
    const res = await axios.post("http://localhost:5000/notes", {
      title,
      content: "",
    });
    navigate(`/note/${res.data._id}`);
  };

  return (
    <div>
      <h2>Create a New Note</h2>
      <input
        type="text"
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={createNote}>Create</button>
    </div>
  );
}
