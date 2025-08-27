import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import JournalEntry from "./components/JournalEntry";
import JournalList from "./components/JournalList";
import { auth } from "./firebase";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [activeEntry, setActiveEntry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'
  const [filter, setFilter] = useState("all"); // 'all', 'today', 'week', 'month'
  const [showHome, setShowHome] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setShowHome(false);
      } else {
        setUser(null);
        setShowHome(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleStart = () => {
    setShowHome(false);
  };

  const handleLogout = () => {
    auth.signOut();
    setUser(null);
    setEntries([]);
    setActiveEntry(null);
    setShowHome(true);
  };

  const addEntry = (newEntry) => {
    const entryWithId = {
      ...newEntry,
      id: Date.now().toString(),
      userId: user.uid,
      createdAt: new Date().toISOString()
    };
    setEntries([entryWithId, ...entries]);
    setActiveEntry(entryWithId);
  };

  const updateEntry = (updatedEntry) => {
    setEntries(entries.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    ));
    setActiveEntry(updatedEntry);
    setIsEditing(false);
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
    if (activeEntry && activeEntry.id === id) {
      setActiveEntry(null);
      setIsEditing(false);
    }
  };

  const filteredEntries = () => {
    const now = new Date();
    switch (filter) {
      case "today":
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return entries.filter(entry => new Date(entry.createdAt) >= today);
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return entries.filter(entry => new Date(entry.createdAt) >= weekAgo);
      case "month":
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return entries.filter(entry => new Date(entry.createdAt) >= monthAgo);
      default:
        return entries;
    }
  };

  // Show Home page if not logged in and showHome is true
  if (showHome && !user) {
    return <Home onStart={handleStart} />;
  }

  // Show Login page if not logged in but showHome is false
  if (!user) {
    return <Login setUser={setUser} />;
  }

  // Show Journal app if user is logged in
  return (
    <div className="app-container">
      <div className="journal-app">
        {/* Header */}
        <header className="app-header">
          <div className="header-content">
            <h1>My Journal</h1>
            <div className="user-info">
              <span>Welcome, {user.displayName || user.email}</span>
              <button onClick={handleLogout} className="btn btn-logout">
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="main-content">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="view-options">
              <h3>View Options</h3>
              <div className="view-buttons">
                <button 
                  className={viewMode === "list" ? "active" : ""}
                  onClick={() => setViewMode("list")}
                >
                  List View
                </button>
                <button 
                  className={viewMode === "grid" ? "active" : ""}
                  onClick={() => setViewMode("grid")}
                >
                  Grid View
                </button>
              </div>
              
              <div className="filter-options">
                <h3>Filter By</h3>
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Entries</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
            
            <div className="stats">
              <h3>Journal Stats</h3>
              <p>Total Entries: {entries.length}</p>
              <p>Filtered Entries: {filteredEntries().length}</p>
            </div>

            <div className="home-button-container">
              <button 
                onClick={() => setShowHome(true)}
                className="btn btn-home"
              >
                Back to Home
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="content-area">
            {/* Journal Entry Form */}
            <section className="journal-entry-section">
              <h2>{isEditing ? "Edit Entry" : "New Journal Entry"}</h2>
              <JournalEntry 
                onAddEntry={addEntry}
                onUpdateEntry={updateEntry}
                activeEntry={activeEntry}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
              />
            </section>

            {/* Journal List */}
            <section className="journal-list-section">
              <div className="section-header">
                <h2>Your Journal Entries</h2>
                {entries.length > 0 && (
                  <button 
                    className="btn btn-new"
                    onClick={() => {
                      setActiveEntry(null);
                      setIsEditing(false);
                    }}
                  >
                    New Entry
                  </button>
                )}
              </div>
              
              {filteredEntries().length > 0 ? (
                <JournalList 
                  entries={filteredEntries()}
                  onEditEntry={(entry) => {
                    setActiveEntry(entry);
                    setIsEditing(true);
                  }}
                  onDeleteEntry={deleteEntry}
                  onSelectEntry={setActiveEntry}
                  viewMode={viewMode}
                />
              ) : (
                <div className="empty-state">
                  <p>No journal entries found.</p>
                  <p>Start by writing your first entry!</p>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
