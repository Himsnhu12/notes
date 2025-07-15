import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateNote from "./CreateNote";
import NoteEditor from "./NoteEditor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateNote />} />
        <Route path="/note/:id" element={<NoteEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
