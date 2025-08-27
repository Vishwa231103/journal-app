import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { FiEdit, FiTrash2, FiGrid, FiList } from "react-icons/fi";

function JournalList({ onEditEntry, viewMode = "grid" }) {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "journals"),
      where("uid", "==", auth.currentUser.uid),
      orderBy("timestamp", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entriesData = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data(),
        date: doc.data().date || new Date().toISOString()
      }));
      setEntries(entriesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching journals: ", error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      try {
        await deleteDoc(doc(db, "journals", id));
      } catch (error) {
        console.error("Error deleting journal: ", error);
        alert("Failed to delete journal entry.");
      }
    }
  };

  const filteredEntries = entries.filter(entry => {
    // Filter by search term
    const matchesSearch = entry.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (entry.title && entry.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by selected filter
    let matchesFilter = true;
    if (filter !== "all") {
      const entryDate = new Date(entry.date);
      const today = new Date();
      
      if (filter === "today") {
        matchesFilter = entryDate.toDateString() === today.toDateString();
      } else if (filter === "week") {
        const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesFilter = entryDate >= oneWeekAgo;
      } else if (filter === "month") {
        const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        matchesFilter = entryDate >= oneMonthAgo;
      }
    }
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getMoodEmoji = (mood) => {
    const moodMap = {
      sad: "😢",
      unhappy: "😞",
      neutral: "😐",
      happy: "🙂",
      excited: "😄"
    };
    return moodMap[mood] || "📝";
  };

  if (loading) {
    return (
      <div className="journal-list-container">
        <div className="journal-list-header">
          <h2>Your Journals</h2>
        </div>
        <div className="journals-grid">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="journal-card loading">
              <div style={{height: "1.2rem", width: "40%", backgroundColor: "#444", marginBottom: "1rem", borderRadius: "4px"}}></div>
              <div style={{height: "4rem", backgroundColor: "#333", borderRadius: "4px"}}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="journal-list-container">
      <div className="journal-list-header">
        <h2>Your Journals</h2>
        <span className="entries-count">{filteredEntries.length} entries</span>
      </div>

      <div className="journal-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="filter-select"
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Entries</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="empty-state">
          <p>{searchTerm ? "No entries match your search." : "No entries yet."}</p>
          <p>{searchTerm ? "Try a different search term." : "Start writing!"}</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="journals-grid">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="journal-card">
              <h4>{formatDate(entry.date)}</h4>
              {entry.title && <h3 className="journal-title">{entry.title}</h3>}
              <p>{entry.text}</p>
              <div className="journal-card-footer">
                <span className="journal-mood">{getMoodEmoji(entry.mood)}</span>
                <div className="journal-actions">
                  <button onClick={() => onEditEntry(entry)} title="Edit entry">
                    <FiEdit />
                  </button>
                  <button onClick={() => handleDelete(entry.id)} title="Delete entry">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="journals-list">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="journal-card">
              <div className="journal-card-header">
                <h4>{formatDate(entry.date)}</h4>
                <span className="journal-mood">{getMoodEmoji(entry.mood)}</span>
              </div>
              {entry.title && <h3 className="journal-title">{entry.title}</h3>}
              <p>{entry.text}</p>
              <div className="journal-actions">
                <button onClick={() => onEditEntry(entry)} title="Edit entry">
                  <FiEdit /> Edit
                </button>
                <button onClick={() => handleDelete(entry.id)} title="Delete entry">
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JournalList;