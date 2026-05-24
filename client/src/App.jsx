import { useState } from "react";
import axios from "axios";

function App() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [blog, setBlog] = useState("");
  const [loading, setLoading] = useState(false);

  const generateBlog = async () => {
    if (!topic.trim()) {
      alert("Please enter a blog topic first.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/generate", {
        topic,
        tone,
        length,
      });

      setBlog(response.data.blog);
    } catch (error) {
      setBlog(`Title: ${topic}\n\nThis is a ${tone.toLowerCase()} ${length.toLowerCase()} blog post about ${topic}.\n\nIntroduction:\n${topic} is an important topic in today's digital world. It affects people, businesses, and education in many ways.\n\nMain Points:\n1. It helps people save time.\n2. It improves productivity.\n3. It creates new opportunities for learning and innovation.\n\nConclusion:\nIn conclusion, ${topic} is a valuable subject that will continue to grow in importance in the future.`);
    }

    setLoading(false);
  };

  const downloadBlog = () => {
    const file = new Blob([blog], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "blog-post.txt";
    link.click();
  };

  return (
    <main className="page">
      <section className="card">
        <h1>AI-Powered Blog Generator</h1>
        <p className="subtitle">Enter a topic, choose tone and length, then generate an editable blog draft.</p>

        <label>Blog Topic or Title</label>
        <input
          type="text"
          placeholder="Example: Benefits of AI in Education"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <div className="row">
          <div>
            <label>Tone</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)}>
              <option>Professional</option>
              <option>Friendly</option>
              <option>Casual</option>
              <option>Funny</option>
              <option>Informative</option>
            </select>
          </div>

          <div>
            <label>Length</label>
            <select value={length} onChange={(e) => setLength(e.target.value)}>
              <option>Short</option>
              <option>Medium</option>
              <option>Long</option>
            </select>
          </div>
        </div>

        <button onClick={generateBlog} disabled={loading}>
          {loading ? "Generating..." : "Generate Blog"}
        </button>
      </section>

      <section className="card">
        <h2>Editable Post Preview</h2>
        <textarea
          placeholder="Your generated blog will appear here..."
          value={blog}
          onChange={(e) => setBlog(e.target.value)}
        />

        {blog && <button onClick={downloadBlog}>Download Blog</button>}
      </section>
    </main>
  );
}

export default App;
