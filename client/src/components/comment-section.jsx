import React, { useEffect } from "react";
import { useState } from "react";

function CommentSection() {
    const [comment, setComment] = useState("");
    const [refresh, setRefresh] = useState(false);
    const [comments, setComments] = useState([
        { content: "This is a comment", username: "user1", timestamp: "2021-01-01", id : 1 },
        { content: "This is a comment", username: "user2", timestamp: "2021-01-06", id : 45 },
        { content: "This is a comment", username: "user1", timestamp: "2021-01-03", id : 78 },
        { content: "This is a comment", username: "user1", timestamp: "2021-01-23", id : 100 },
    ]);
    const [newComment, setNewComment] = useState("");
    // id, imbdb_id, username, content, timestamp
    useEffect(() => {
        console.log('comments  fetched again')
    }, [refresh])
    const handleSubmit = (e) => {
        e.preventDefault();
        // send to db
        setRefresh(!refresh);
        setNewComment("");
    };
    const deleteCommment = (id) => {
        
    }

return (
    <div className="CommentSection">
    <h2 className="text-2xl mb-4">Comments</h2>
    <form>
        <textarea
        className="border p-2 mb-2 w-full text-black"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        />
    <button className="bg-blue-500 text-white p-2" onClick={(e) => handleSubmit(e)}>Submit</button>
    </form>
    <div className="comments">
        {comments.map((comment, index) => (
        <div key={index} className="border-b p-2">
            {comment.content} {comment.username} {comment.timestamp} <button onClick={() => deleteCommment(comment.id)}>delete</button>
            <div>{comment.id}</div>
        </div>
        ))}
    </div>
    </div>
);
}

export default CommentSection;