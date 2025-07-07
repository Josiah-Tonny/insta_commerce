import React, { useState, useRef, useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import { FaRegThumbsUp, FaThumbsUp, FaTrash, FaCamera, FaReply } from "react-icons/fa";

// Helper: get initials from username
function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Mock API upvote
function mockUpvote(commentId, comments, setComments) {
  setComments((prev) =>
    prev.map((c) =>
      c.id === commentId
        ? { ...c, upvotes: c.upvotes + 1, upvoted: true }
        : { ...c, replies: c.replies ? c.replies.map((r) => (r.id === commentId ? { ...r, upvotes: r.upvotes + 1, upvoted: true } : r)) : c }
    )
  );
}

// Mock API delete
function mockDelete(commentId, comments, setComments) {
  setComments((prev) =>
    prev
      .filter((c) => c.id !== commentId)
      .map((c) => ({
        ...c,
        replies: c.replies ? c.replies.filter((r) => r.id !== commentId) : [],
      }))
  );
}

// Avatar component
function Avatar({ user }) {
  return user.avatar ? (
    <img
      src={user.avatar}
      alt={user.name}
      className="w-9 h-9 rounded-full object-cover border border-gray-200"
    />
  ) : (
    <div className="w-9 h-9 rounded-full bg-instaPink/20 flex items-center justify-center font-bold text-instaPink uppercase">
      {getInitials(user.name)}
    </div>
  );
}

// Single comment (with replies)
function CommentItem({
  comment,
  onReply,
  onUpvote,
  onDelete,
  isSeller,
  parentId = null,
  onMediaUpload,
  replyingTo,
  setReplyingTo,
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyMedia, setReplyMedia] = useState(null);

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() && !replyMedia) return;
    onReply(comment.id, replyText, replyMedia);
    setReplyText("");
    setReplyMedia(null);
    setShowReply(false);
    setReplyingTo(null);
  };

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100">
      <Avatar user={comment.user} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-instaPink">{comment.user.name}</span>
          <span className="text-xs text-gray-400">{comment.date}</span>
        </div>
        <div className="mt-1 text-gray-800 break-words">{comment.text}</div>
        {comment.media && (
          <img
            src={comment.media}
            alt="attachment"
            className="mt-2 w-32 h-32 object-cover rounded-lg border"
          />
        )}
        <div className="flex items-center gap-4 mt-2 text-sm">
          <button
            className={`flex items-center gap-1 ${comment.upvoted ? "text-instaPink" : "text-gray-500"} hover:text-instaPink transition`}
            onClick={() => onUpvote(comment.id)}
            disabled={comment.upvoted}
            aria-label="Upvote"
          >
            {comment.upvoted ? <FaThumbsUp /> : <FaRegThumbsUp />}
            <span>{comment.upvotes}</span>
          </button>
          <button
            className="flex items-center gap-1 text-gray-500 hover:text-instaPink transition"
            onClick={() => {
              setShowReply((v) => !v);
              setReplyingTo(comment.id);
            }}
            aria-label="Reply"
          >
            <FaReply />
            Reply
          </button>
          {isSeller && (
            <button
              className="flex items-center gap-1 text-red-500 hover:text-red-700 transition"
              onClick={() => onDelete(comment.id)}
              aria-label="Delete"
            >
              <FaTrash />
              Delete
            </button>
          )}
        </div>
        {/* Reply input */}
        {showReply && replyingTo === comment.id && (
          <form onSubmit={handleReply} className="flex items-center gap-2 mt-3">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 px-3 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-instaPink"
            />
            <label className="cursor-pointer text-instaPink">
              <FaCamera className="text-xl" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setReplyMedia(ev.target.result);
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
            </label>
            <button
              type="submit"
              className="bg-instaPink text-white px-4 py-2 rounded-full font-semibold hover:bg-instaPurple transition"
            >
              Post
            </button>
          </form>
        )}
        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-8 mt-2 border-l-2 border-instaPink/20 pl-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onUpvote={onUpvote}
                onDelete={onDelete}
                isSeller={isSeller}
                parentId={comment.id}
                onMediaUpload={onMediaUpload}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Main CommentSection
export default function CommentSection({
  comments: initialComments = [],
  isSeller = false,
  currentUser = { name: "You", avatar: null },
}) {
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState("");
  const [commentMedia, setCommentMedia] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);

  // Add new comment or reply
  const handleReply = useCallback(
    (parentId, text, media) => {
      const newComment = {
        id: Date.now() + Math.random(),
        user: currentUser,
        text,
        date: new Date().toISOString().slice(0, 10),
        upvotes: 0,
        upvoted: false,
        media,
        replies: [],
      };
      setComments((prev) =>
        parentId
          ? prev.map((c) =>
              c.id === parentId
                ? { ...c, replies: [...(c.replies || []), newComment] }
                : {
                    ...c,
                    replies: c.replies
                      ? c.replies.map((r) =>
                          r.id === parentId
                            ? { ...r, replies: [...(r.replies || []), newComment] }
                            : r
                        )
                      : [],
                  }
            )
          : [...prev, newComment]
      );
    },
    [currentUser]
  );

  // Upvote handler
  const handleUpvote = useCallback(
    (id) => mockUpvote(id, comments, setComments),
    [comments]
  );

  // Delete handler
  const handleDelete = useCallback(
    (id) => mockDelete(id, comments, setComments),
    [comments]
  );

  // Media upload for new comment
  const handleMediaUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setCommentMedia(ev.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Submit new comment
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim() && !commentMedia) return;
    handleReply(null, commentText, commentMedia);
    setCommentText("");
    setCommentMedia(null);
  };

  // Virtualized row renderer
  const Row = ({ index, style }) => (
    <div style={style}>
      <CommentItem
        comment={comments[index]}
        onReply={handleReply}
        onUpvote={handleUpvote}
        onDelete={handleDelete}
        isSeller={isSeller}
        onMediaUpload={handleMediaUpload}
        replyingTo={replyingTo}
        setReplyingTo={setReplyingTo}
      />
    </div>
  );

  // For <100 comments, render normally
  const renderComments = () =>
    comments.length > 100 ? (
      <List
        height={500}
        itemCount={comments.length}
        itemSize={140}
        width="100%"
        className="border rounded bg-white"
      >
        {Row}
      </List>
    ) : (
      <div>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onUpvote={handleUpvote}
            onDelete={handleDelete}
            isSeller={isSeller}
            onMediaUpload={handleMediaUpload}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
          />
        ))}
      </div>
    );

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow p-4">
      <div className="font-semibold text-gray-700 mb-2">Comments</div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-4">
        <Avatar user={currentUser} />
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-3 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-instaPink"
        />
        <label className="cursor-pointer text-instaPink">
          <FaCamera className="text-xl" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleMediaUpload}
          />
        </label>
        <button
          type="submit"
          className="bg-instaPink text-white px-4 py-2 rounded-full font-semibold hover:bg-instaPurple transition"
        >
          Post
        </button>
      </form>
      {commentMedia && (
        <div className="mb-4 ml-12">
          <img
            src={commentMedia}
            alt="attachment"
            className="w-24 h-24 object-cover rounded-lg border"
          />
        </div>
      )}
      <div className="max-h-[500px] overflow-y-auto">{renderComments()}</div>
    </div>
  );
}