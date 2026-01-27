import { useEffect } from "react";

function Message({ type = "error", text, clearMessage, duration = 3000 }) {
  useEffect(() => {
    if (!text) return;

    const timer = setTimeout(() => {
      clearMessage(null);
    }, duration);

    return () => clearTimeout(timer);
  }, [text, duration, clearMessage]);

  if (!text) return null;

  return <p className={`message ${type}`}>{text}</p>;
}

export default Message;
