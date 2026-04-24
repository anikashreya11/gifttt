import React, { useState, useRef, useEffect } from 'react';
import './DesignEditor.css';
import { FiType, FiUpload, FiTrash2, FiMove, FiBold, FiItalic } from 'react-icons/fi';

const fontFamilies = ['Playfair Display', 'Inter', 'Dancing Script', 'Montserrat', 'Georgia', 'Courier New'];
const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48];
const textColors = ['#1a1a1a', '#ffffff', '#e8709a', '#E8A0B4', '#BA7517', '#185FA5', '#3B6D11', '#D4527F', '#888888'];
const backgroundColors = ['#FFF0F5', '#FFF8F0', '#F0F5FF', '#F0FFF5', '#FFF0F0', '#F5F0FF', '#FFFBF0', '#F0FFFF', '#ffffff', '#1a1a1a'];

function DesignEditor({ onSave }) {
  const canvasRef = useRef(null);
  const [bgColor, setBgColor] = useState('#FFF0F5');
  const [bgImage, setBgImage] = useState(null);
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [newText, setNewText] = useState('');
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState('Playfair Display');
  const [textColor, setTextColor] = useState('#1a1a1a');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);

  const selectedElement = elements.find(e => e.id === selectedId);

  const addText = () => {
    if (!newText.trim()) return;
    const el = {
      id: Date.now(),
      type: 'text',
      content: newText,
      x: 80,
      y: 80,
      fontSize,
      fontFamily,
      color: textColor,
      bold,
      italic,
    };
    setElements(prev => [...prev, el]);
    setSelectedId(el.id);
    setNewText('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setBgImage(reader.result);
    reader.readAsDataURL(file);
  };

  const deleteSelected = () => {
    setElements(prev => prev.filter(e => e.id !== selectedId));
    setSelectedId(null);
  };

  const updateSelected = (key, value) => {
    setElements(prev => prev.map(e => e.id === selectedId ? { ...e, [key]: value } : e));
  };

  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    setSelectedId(id);
    setDragging(true);
    const el = elements.find(el => el.id === id);
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - el.x,
      y: e.clientY - rect.top - el.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging || !selectedId) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 40));
    const y = Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 20));
    setElements(prev => prev.map(el => el.id === selectedId ? { ...el, x, y } : el));
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <div className="design-editor">

      {/* Toolbar */}
      <div className="editor-toolbar">

        {/* Add Text */}
        <div className="toolbar-section">
          <p className="toolbar-label">Add Text</p>
          <div className="text-input-row">
            <input
              type="text"
              placeholder="Type something..."
              value={newText}
              onChange={e => setNewText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addText()}
              className="editor-input"
            />
            <button className="toolbar-btn primary" onClick={addText}>
              <FiType /> Add
            </button>
          </div>
        </div>

        {/* Font Controls */}
        <div className="toolbar-section">
          <p className="toolbar-label">Font</p>
          <div className="font-controls">
            <select
              value={selectedElement ? selectedElement.fontFamily : fontFamily}
              onChange={e => {
                setFontFamily(e.target.value);
                if (selectedElement) updateSelected('fontFamily', e.target.value);
              }}
              className="editor-select"
            >
              {fontFamilies.map(f => (
                <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
              ))}
            </select>
            <select
              value={selectedElement ? selectedElement.fontSize : fontSize}
              onChange={e => {
                setFontSize(Number(e.target.value));
                if (selectedElement) updateSelected('fontSize', Number(e.target.value));
              }}
              className="editor-select small"
            >
              {fontSizes.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              className={`toolbar-icon-btn ${(selectedElement ? selectedElement.bold : bold) ? 'active' : ''}`}
              onClick={() => {
                setBold(!bold);
                if (selectedElement) updateSelected('bold', !selectedElement.bold);
              }}
            >
              <FiBold />
            </button>
            <button
              className={`toolbar-icon-btn ${(selectedElement ? selectedElement.italic : italic) ? 'active' : ''}`}
              onClick={() => {
                setItalic(!italic);
                if (selectedElement) updateSelected('italic', !selectedElement.italic);
              }}
            >
              <FiItalic />
            </button>
          </div>
        </div>

        {/* Text Color */}
        <div className="toolbar-section">
          <p className="toolbar-label">Text Color</p>
          <div className="color-swatches">
            {textColors.map(c => (
              <div
                key={c}
                className={`color-swatch ${(selectedElement ? selectedElement.color : textColor) === c ? 'active' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => {
                  setTextColor(c);
                  if (selectedElement) updateSelected('color', c);
                }}
              />
            ))}
          </div>
        </div>

        {/* Background */}
        <div className="toolbar-section">
          <p className="toolbar-label">Background</p>
          <div className="color-swatches">
            {backgroundColors.map(c => (
              <div
                key={c}
                className={`color-swatch ${bgColor === c ? 'active' : ''}`}
                style={{ backgroundColor: c, border: c === '#ffffff' ? '1px solid #e0e0e0' : 'none' }}
                onClick={() => { setBgColor(c); setBgImage(null); }}
              />
            ))}
          </div>
          <label className="upload-bg-btn">
            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            <FiUpload /> Upload Background
          </label>
        </div>

        {/* Delete */}
        {selectedId && (
          <div className="toolbar-section">
            <button className="toolbar-btn danger" onClick={deleteSelected}>
              <FiTrash2 /> Delete Selected
            </button>
          </div>
        )}

      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="editor-canvas"
        style={{
          backgroundColor: bgImage ? 'transparent' : bgColor,
          backgroundImage: bgImage ? `url(${bgImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onMouseMove={handleMouseMove}
        onClick={() => setSelectedId(null)}
      >
        {elements.map(el => (
          <div
            key={el.id}
            className={`canvas-element ${selectedId === el.id ? 'selected' : ''}`}
            style={{ left: el.x, top: el.y }}
            onClick={e => { e.stopPropagation(); setSelectedId(el.id); }}
          >
            {el.type === 'text' && (
              <p
                style={{
                  fontFamily: el.fontFamily,
                  fontSize: el.fontSize,
                  color: el.color,
                  fontWeight: el.bold ? 'bold' : 'normal',
                  fontStyle: el.italic ? 'italic' : 'normal',
                  margin: 0,
                  cursor: 'move',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
                onMouseDown={e => handleMouseDown(e, el.id)}
              >
                {el.content}
              </p>
            )}
            {selectedId === el.id && (
              <div className="drag-hint"><FiMove /> drag to move</div>
            )}
          </div>
        ))}

        {elements.length === 0 && (
          <div className="canvas-placeholder">
            <p>Your design will appear here</p>
            <span>Add text or upload a background to get started</span>
          </div>
        )}
      </div>

      {/* Save Button */}
      <button className="save-design-btn btn-primary" onClick={() => onSave && onSave({ bgColor, bgImage, elements })}>
        Use This Design →
      </button>

    </div>
  );
}

export default DesignEditor;