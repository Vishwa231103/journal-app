import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { db, auth } from "../firebase";
import { addDoc, collection, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { FiSave, FiType, FiCalendar, FiXCircle, FiEdit2, FiTag } from "react-icons/fi";
import "./JournalEntry.css";

function JournalEntry({ onAddEntry, onUpdateEntry, activeEntry, isEditing, setIsEditing }) {
  const [date, setDate] = useState(new Date());
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("neutral");
  const [tags, setTags] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Update character count when text changes
  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  // Pre-fill form when editing
  useEffect(() => {
    if (activeEntry && isEditing) {
      setDate(activeEntry.date ? new Date(activeEntry.date) : new Date());
      setText(activeEntry.text || "");
      setTitle(activeEntry.title || "");
      setMood(activeEntry.mood || "neutral");
      setTags(activeEntry.tags ? activeEntry.tags.join(", ") : "");
    }
  }, [activeEntry, isEditing]);

  // Reset form if not editing
  useEffect(() => {
    if (!isEditing && !activeEntry) {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, activeEntry]);

  const resetForm = () => {
    setDate(new Date());
    setText("");
    setTitle("");
    setMood("neutral");
    setTags("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!text.trim()) {
      alert("Journal entry cannot be empty!");
      return;
    }

    setIsSaving(true);

    try {
      const entryData = {
        uid: auth.currentUser.uid,
        title: title.trim() || null,
        text: text.trim(),
        date: date.toISOString(),
        mood,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
        timestamp: serverTimestamp(),
      };

      if (isEditing && activeEntry?.id) {
        // Update existing entry
        await updateDoc(doc(db, "journals", activeEntry.id), entryData);
        if (onUpdateEntry) {
          onUpdateEntry({ ...entryData, id: activeEntry.id });
        }
      } else {
        // Create new entry
        const docRef = await addDoc(collection(db, "journals"), entryData);
        if (onAddEntry) {
          onAddEntry({ ...entryData, id: docRef.id });
        }
      }

      resetForm();
    } catch (error) {
      console.error("Error saving journal entry: ", error);
      alert("Failed to save journal entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    if (setIsEditing) {
      setIsEditing(false);
    }
  };

  return (
    <div className="journal-entry-container">
      {/* Header */}
      <div className="journal-entry-header">
        <h2>{isEditing ? "✏️ Edit Journal Entry" : "📝 New Journal Entry"}</h2>
        {isEditing && (
          <button
            onClick={handleCancelEdit}
            className="btn btn-cancel"
            disabled={isSaving}
          >
            <FiXCircle /> Cancel Edit
          </button>
        )}
      </div>

      {/* Title */}
      <div className="form-group">
        <label htmlFor="title" className="form-label">
          <FiType /> Title (optional)
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your entry a title..."
          className="form-input"
          disabled={isSaving}
        />
      </div>

      {/* Date */}
      <div className="form-group">
        <label htmlFor="date" className="form-label">
          <FiCalendar /> Date
        </label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          className="form-input"
          disabled={isSaving}
          dateFormat="MMMM d, yyyy"
        />
      </div>

      {/* Mood */}
      <div className="form-group">
        <label className="form-label">How are you feeling?</label>
        <div className="mood-selector">
          {[
            { emoji: "😢", mood: "sad" },
            { emoji: "😞", mood: "unhappy" },
            { emoji: "😐", mood: "neutral" },
            { emoji: "🙂", mood: "happy" },
            { emoji: "😄", mood: "excited" },
          ].map((m) => (
            <button
              key={m.mood}
              type="button"
              className={`mood-btn ${mood === m.mood ? "selected" : ""}`}
              onClick={() => setMood(m.mood)}
              disabled={isSaving}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Text */}
      <div className="form-group">
        <label htmlFor="text" className="form-label">
          Your Journal Entry
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your thoughts and feelings..."
          className="form-textarea"
          rows="6"
          disabled={isSaving}
        />
        <div className="char-count">{charCount} characters</div>
      </div>

      {/* Tags */}
      <div className="form-group">
        <label htmlFor="tags" className="form-label">
          <FiTag /> Tags (comma separated)
        </label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., work, family, goals"
          className="form-input"
          disabled={isSaving}
        />
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button
          onClick={handleSave}
          className="btn btn-primary"
          disabled={isSaving || !text.trim()}
        >
          {isSaving ? (
            "Saving..."
          ) : (
            <>
              {isEditing ? <FiEdit2 /> : <FiSave />}
              {isEditing ? " Update Entry" : " Save Entry"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default JournalEntry;
