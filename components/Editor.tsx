
import React, { useState, useRef, useEffect } from 'react';
import { Writing } from '../types';
import { checkGrammar } from '../services/geminiService';
import { SparklesIcon } from './Icons';

interface EditorProps {
    writing: Writing | null;
    onSave: (writing: Writing) => void;
    onClose: () => void;
    currentUser: any;
}

export const Editor: React.FC<EditorProps> = ({ writing: initialWriting, onSave, onClose, currentUser }) => {
    const [title, setTitle] = useState(initialWriting?.title || 'Untitled');
    const [content, setContent] = useState(initialWriting?.content || '');
    const [isPublished, setIsPublished] = useState(initialWriting?.isPublished || false);
    const [template, setTemplate] = useState<Writing['template']>(initialWriting?.template || 'blank');
    const [fontFamily, setFontFamily] = useState<Writing['fontFamily']>(initialWriting?.fontFamily || 'serif');
    const [backgroundColor, setBackgroundColor] = useState(initialWriting?.backgroundColor || '#ffffff');
    
    const [isSaving, setIsSaving] = useState(false);
    const [grammarSuggestion, setGrammarSuggestion] = useState<string | null>(null);
    const [isCheckingGrammar, setIsCheckingGrammar] = useState(false);
    
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const suggestionRef = useRef<HTMLDivElement>(null);

    const fontClasses: Record<Writing['fontFamily'], string> = {
        serif: 'font-serif',
        sans: 'font-sans',
        mono: 'font-mono',
    };

    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            e.preventDefault();
            alert("Copy-pasting is disabled to ensure originality.");
        };
        const editorNode = editorRef.current;
        if (editorNode) {
            editorNode.addEventListener('paste', handlePaste);
        }
        return () => {
            if (editorNode) {
                editorNode.removeEventListener('paste', handlePaste);
            }
        };
    }, []);
    
    const handleSave = () => {
        setIsSaving(true);
        const savedWriting: Writing = {
            ...(initialWriting?.id ? initialWriting : { 
                id: `writing-${Date.now()}`, 
                authorId: currentUser.id, 
                createdAt: new Date(), 
                stats: { views: 0, upvotes: 0, downvotes: 0 },
                comments: [],
            }),
            title,
            content,
            isPublished,
            template: template as Writing['template'],
            fontFamily: fontFamily as Writing['fontFamily'],
            backgroundColor,
            updatedAt: new Date(),
        };
        setTimeout(() => {
            onSave(savedWriting);
            setIsSaving(false);
        }, 1000);
    };

    const handleGrammarCheck = async () => {
        const selectedText = editorRef.current?.value.substring(
            editorRef.current.selectionStart,
            editorRef.current.selectionEnd
        );
        if (!selectedText || selectedText.trim().length === 0) {
            alert("Please select some text to check.");
            return;
        }

        setIsCheckingGrammar(true);
        setGrammarSuggestion(null);
        const suggestion = await checkGrammar(selectedText);
        setGrammarSuggestion(suggestion);
        setIsCheckingGrammar(false);
    };

    const applySuggestion = () => {
        if (!grammarSuggestion || !editorRef.current) return;
        const start = editorRef.current.selectionStart;
        const end = editorRef.current.selectionEnd;
        const newContent = content.substring(0, start) + grammarSuggestion + content.substring(end);
        setContent(newContent);
        setGrammarSuggestion(null);
    };
    
    const insertMarkdown = (type: 'link' | 'image') => {
        const editor = editorRef.current;
        if (!editor) return;
        
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const selectedText = content.substring(start, end);

        let markdown;
        if(type === 'link') {
            markdown = `[${selectedText || 'link text'}](url)`;
        } else {
            markdown = `![${selectedText || 'alt text'}](image_url)`;
        }
        
        const newContent = content.substring(0, start) + markdown + content.substring(end);
        setContent(newContent);
        editor.focus();
        // Move cursor to url part
        setTimeout(() => editor.setSelectionRange(start + markdown.length - 4, start + markdown.length-1), 0);
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[95vh] flex flex-col">
                <header className="p-4 border-b flex justify-between items-center flex-wrap gap-2">
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        className="font-serif text-2xl font-bold focus:outline-none flex-grow"
                        placeholder="Untitled"
                    />
                    <div className="flex items-center space-x-4">
                        <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                            {isSaving ? 'Saving...' : 'Save & Close'}
                        </button>
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                    </div>
                </header>
                
                {/* Toolbar */}
                <div className="p-2 border-b bg-gray-50 flex items-center space-x-4 text-sm">
                    <div>
                        <label className="mr-2 font-medium text-gray-600">Template:</label>
                        {/* FIX: Cast e.target.value to the correct type to resolve TypeScript error. */}
                        <select value={template} onChange={e => setTemplate(e.target.value as Writing['template'])} className="rounded border-gray-300 text-sm">
                            <option value="blank">Blank</option>
                            <option value="article">Article</option>
                            <option value="report">Report</option>
                            <option value="note">Note</option>
                        </select>
                    </div>
                     <div>
                        <label className="mr-2 font-medium text-gray-600">Font:</label>
                        {/* FIX: Cast e.target.value to the correct type to resolve TypeScript error. */}
                        <select value={fontFamily} onChange={e => setFontFamily(e.target.value as Writing['fontFamily'])} className="rounded border-gray-300 text-sm">
                            <option value="serif">Serif</option>
                            <option value="sans">Sans</option>
                            <option value="mono">Mono</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="bg-color" className="mr-2 font-medium text-gray-600">BG:</label>
                        <input id="bg-color" type="color" value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} className="w-8 h-8"/>
                    </div>
                    <div className="border-l pl-4 flex space-x-2">
                        <button onClick={() => insertMarkdown('link')} className="px-3 py-1 bg-white border rounded hover:bg-gray-100">Add Link</button>
                        <button onClick={() => insertMarkdown('image')} className="px-3 py-1 bg-white border rounded hover:bg-gray-100">Add Image</button>
                    </div>
                </div>

                <div className="flex-grow p-6 relative" style={{ backgroundColor }}>
                    <textarea 
                        ref={editorRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className={`w-full h-full resize-none border-0 focus:ring-0 text-lg leading-relaxed bg-transparent ${fontClasses[fontFamily]}`}
                        placeholder="Start writing your masterpiece..."
                    />
                    {grammarSuggestion && (
                         <div ref={suggestionRef} className="absolute bottom-16 left-1/2 -translate-x-1/2 w-3/4 bg-white shadow-lg rounded-lg p-4 border border-blue-200 z-10">
                            <p className="text-sm text-gray-600 mb-2">AI Suggestion:</p>
                            <p className="font-mono p-2 bg-blue-50 rounded text-blue-800 text-sm">{grammarSuggestion}</p>
                            <div className="flex justify-end space-x-2 mt-3">
                                <button onClick={applySuggestion} className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Apply</button>
                                <button onClick={() => setGrammarSuggestion(null)} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">Dismiss</button>
                            </div>
                        </div>
                    )}
                </div>
                <footer className="p-4 border-t bg-gray-50 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                        <p>Verified Timestamp: { (initialWriting?.updatedAt ? new Date(initialWriting.updatedAt) : new Date()).toLocaleString() }</p>
                        <p className="font-bold text-red-600">No Copy-Paste Allowed</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={handleGrammarCheck} disabled={isCheckingGrammar} className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 disabled:opacity-50">
                            <SparklesIcon className="w-5 h-5"/>
                            <span>{isCheckingGrammar ? 'Checking...' : 'Grammar Check'}</span>
                        </button>
                        <div className="flex items-center">
                            <span className="mr-2 text-sm font-medium text-gray-700">Publish:</span>
                             <label htmlFor="publish-toggle" className="flex items-center cursor-pointer">
                                <div className="relative">
                                  <input type="checkbox" id="publish-toggle" className="sr-only" checked={isPublished} onChange={() => setIsPublished(!isPublished)} />
                                  <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isPublished ? 'translate-x-full !bg-blue-600' : ''}`}></div>
                                </div>
                              </label>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};
