
import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    MathJax: any;
  }
}

interface MathRendererProps {
  content: string;
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const render = () => {
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([containerRef.current]).catch((err: any) =>
          console.debug('MathJax rendering pending...', err)
        );
      }
    };

    // Render lần đầu khi nội dung thay đổi
    render();

    // Sử dụng MutationObserver để phát hiện nếu nội dung bị thay đổi bởi React sau đó
    const observer = new MutationObserver(() => {
      render();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, characterData: true, subtree: true });
    }

    // Đặt thêm một timeout ngắn như một lớp bảo vệ cuối cùng
    const timeoutId = setTimeout(render, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [content]);

  return (
    <div 
      ref={containerRef} 
      className={`math-container ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default MathRenderer;
