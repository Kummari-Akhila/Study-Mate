import React, { useState } from 'react';
import { Sparkles, FileText, BookOpen, Layers } from 'lucide-react';
import Error from '../components/Error';

const SAMPLE_NOTES = `Binary Search Tree

A BST is a binary tree where:
- Left child < Parent
- Right child > Parent

Operations:
Insertion - Adding nodes maintaining order
Deletion - Removing nodes and restructuring
Traversal - Inorder gives sorted keys
Searching - O(log n) average time complexity`;

const SAMPLE_OS_NOTES = `Operating System Concepts

Process: A program in execution. It is an active entity.
Thread: A lightweight subprocess. The smallest unit of execution. Shares memory.
Deadlock: A state where processes are blocked waiting for each other.
Semaphore: A variable or abstract data type used to control access to a common resource.
Paging: Memory management scheme that eliminates the need for contiguous physical memory.`;

export default function Home({ 
  onGenerate, 
  isLoading, 
  error, 
  onUseFallback, 
  onClearError 
}) {
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!notes.trim()) return;
    onGenerate(notes);
  };

  const loadSample = (sampleType) => {
    onClearError();
    if (sampleType === 'bst') {
      setNotes(SAMPLE_NOTES);
    } else {
      setNotes(SAMPLE_OS_NOTES);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '750px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ 
          fontFamily: 'var(--font-heading)', 
          fontSize: '2.75rem', 
          fontWeight: 800,
          color: 'var(--primary)',
          marginBottom: '0.5rem'
        }}>
          Transform Notes into Interactive Study Tools
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          Paste your exam syllabus, summaries, or quick revision logs, and let AI build custom flashcards and multiple-choice quizzes.
        </p>
      </div>

      {error && (
        <Error 
          message={error} 
          onRetry={() => onGenerate(notes)} 
          onUseFallback={onUseFallback} 
        />
      )}

      <form onSubmit={handleSubmit} className="glass-panel">
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="notes-input" className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileText size={16} />
            <span>Paste your notes here</span>
          </label>
          <textarea
            id="notes-input"
            className="textarea-notes"
            placeholder="Type or paste study text, definitions, formulas, or bullet points..."
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              if (error) onClearError();
            }}
            disabled={isLoading}
          />
        </div>

        {/* Preset sample helpers */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '0.75rem', 
          marginBottom: '2rem' 
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Or try a sample set:
          </span>
          <button 
            type="button" 
            onClick={() => loadSample('bst')} 
            className="btn btn-secondary" 
            style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
            disabled={isLoading}
          >
            🌳 Binary Search Trees
          </button>
          <button 
            type="button" 
            onClick={() => loadSample('os')} 
            className="btn btn-secondary" 
            style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
            disabled={isLoading}
          >
            💻 Operating Systems
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: '0.9rem 2.25rem', fontSize: '1.05rem', width: '100%', smWidth: 'auto' }}
            disabled={isLoading || !notes.trim()}
          >
            <Sparkles size={18} />
            <span>Generate Study Materials</span>
          </button>
        </div>
      </form>

      {/* Feature explanation showcase */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.5rem', 
        marginTop: '3.5rem' 
      }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ background: 'rgba(139,92,246,0.1)', padding: '0.5rem', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
            <Layers size={22} />
          </div>
          <div>
            <h4 style={{ marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>Interactive Flashcards</h4>
            <p style={{ fontSize: '0.85rem' }}>Review key terminology. Cards flip around to test memory, with swipe support on mobile devices.</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ background: 'rgba(45,212,191,0.1)', padding: '0.5rem', borderRadius: 'var(--radius-md)', color: 'var(--secondary)' }}>
            <BookOpen size={22} />
          </div>
          <div>
            <h4 style={{ marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>Multiple-Choice Quizzes</h4>
            <p style={{ fontSize: '0.85rem' }}>Challenge yourself under real testing constraints. Track your choices and review thorough answer explanations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
