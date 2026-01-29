import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const TypewriterEffect = ({ content, onComplete, onTyping }) => {
    const [displayedContent, setDisplayedContent] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < content.length) {
            const timeout = setTimeout(() => {
                const chunkSize = 5; // Add 5 characters at a time for speed
                const nextIndex = Math.min(currentIndex + chunkSize, content.length);
                setDisplayedContent(prev => prev + content.slice(currentIndex, nextIndex));
                setCurrentIndex(nextIndex);
                if (onTyping) onTyping(); // Trigger scroll
            }, 1); // Keep delay minimal

            return () => clearTimeout(timeout);
        } else {
            if (onComplete) onComplete();
        }
    }, [currentIndex, content, onComplete, onTyping]);

    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {displayedContent}
        </ReactMarkdown>
    );
};

export default TypewriterEffect;
