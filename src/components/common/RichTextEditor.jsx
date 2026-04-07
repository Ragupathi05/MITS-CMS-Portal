// src/components/common/RichTextEditor.jsx
import { useRef, useEffect, useCallback } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link, Eraser } from 'lucide-react';
import styles from './RichTextEditor.module.css';

const ToolbarBtn = ({ title, onClick, children }) => (
  <button type="button" title={title} className={styles.toolbarBtn} onMouseDown={e => { e.preventDefault(); onClick(); }}>
    {children}
  </button>
);

export default function RichTextEditor({ value, onChange, placeholder = 'Write content here...' }) {
  const editorRef = useRef();
  const isInitialized = useRef(false);

  // Set initial HTML only once on mount — never again, to avoid cursor reset
  useEffect(() => {
    if (!isInitialized.current && editorRef.current) {
      editorRef.current.innerHTML = value || '';
      isInitialized.current = true;
    }
  }, []);

  const exec = useCallback((command, arg) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg || null);
    onChange(editorRef.current?.innerHTML || '');
  }, [onChange]);

  const handleInput = () => {
    onChange(editorRef.current?.innerHTML || '');
  };

  const addLink = () => {
    const url = prompt('Enter URL:');
    if (url) exec('createLink', url);
  };

  return (
    <div className={styles.editorRoot}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <ToolbarBtn title="Bold" onClick={() => exec('bold')}><Bold size={14} /></ToolbarBtn>
          <ToolbarBtn title="Italic" onClick={() => exec('italic')}><Italic size={14} /></ToolbarBtn>
          <ToolbarBtn title="Underline" onClick={() => exec('underline')}><Underline size={14} /></ToolbarBtn>
        </div>
        <div className={styles.toolbarDivider} />
        <div className={styles.toolbarGroup}>
          <ToolbarBtn title="Heading 2" onClick={() => exec('formatBlock', 'h2')}>H2</ToolbarBtn>
          <ToolbarBtn title="Heading 3" onClick={() => exec('formatBlock', 'h3')}>H3</ToolbarBtn>
          <ToolbarBtn title="Paragraph" onClick={() => exec('formatBlock', 'p')}>¶</ToolbarBtn>
        </div>
        <div className={styles.toolbarDivider} />
        <div className={styles.toolbarGroup}>
          <ToolbarBtn title="Bullet list" onClick={() => exec('insertUnorderedList')}><List size={14} /></ToolbarBtn>
          <ToolbarBtn title="Numbered list" onClick={() => exec('insertOrderedList')}><ListOrdered size={14} /></ToolbarBtn>
        </div>
        <div className={styles.toolbarDivider} />
        <div className={styles.toolbarGroup}>
          <ToolbarBtn title="Add link" onClick={addLink}><Link size={14} /></ToolbarBtn>
          <ToolbarBtn title="Clear formatting" onClick={() => exec('removeFormat')}><Eraser size={14} /></ToolbarBtn>
        </div>
      </div>
      <div
        ref={editorRef}
        className={styles.editorArea}
        contentEditable
        suppressContentEditableWarning
        dir="ltr"
        onInput={handleInput}
        data-placeholder={placeholder}
      />
    </div>
  );
}
