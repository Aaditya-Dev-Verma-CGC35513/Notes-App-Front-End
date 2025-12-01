"use client";

import useNoteStore from "@/store/Note";
import { IconCheck, IconEdit, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

function Note({ title, content, id }) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const { notes, setNotes } = useNoteStore();
  const [newTitle, setNewTitle] = useState(title);
  const [newContent, setNewContent] = useState(content);
  async function handleDelete(id) {
    try {
      const deleteNote = await axios.delete(
        `${process.env.NEXT_PUBLIC_NOTES_API_URL}/delete-note/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      toast.success(deleteNote.data.message);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.detail);
      } else {
        toast.error(error.message);
      }
    }
  }
  async function handleUpdate(id) {
    try {
      const updatedNote = {
        title: newTitle,
        content: newContent,
      };
      const updateNote = await axios.patch(
        `${process.env.NEXT_PUBLIC_NOTES_API_URL}/update-note/${id}`,
        updatedNote,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      toast.success(updateNote.data.message);
      for (const note of notes) {
        if (note._id === id) {
          note.title = updatedNote.title;
          note.content = updatedNote.content;
        }
      }
      setNotes([...notes]);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.detail);
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsEditable((prev) => !prev);
    }
  }
  return (
    <div
      className={`flex justify-between w-full ${
        isCompleted ? "bg-green-300/80" : "bg-black text-gray-100"
      }
      } ${
        isEditable ? "bg-blue-300/20" : "bg-black"
      } px-4 py-2 rounded-lg transition duration-200 relative mt-2 `}
    >
      <div className="flex gap-4 z-10 ">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => setIsCompleted((prev) => !prev)}
          className={isEditable ? "pointer-events-none" : "cursor-pointer"}
        />
        {isEditable ? (
          <div className="flex flex-col flex-1 gap-2">
            <input
              type="text"
              placeholder="Enter your Note Title"
              className="bg-black text-gray-300 p-4 outline-none rounded-lg"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <textarea
              placeholder="Enter your Note Content"
              rows={1}
              className="bg-black text-gray-300 p-4 outline-none rounded-lg"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            ></textarea>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <h1 className={`${isCompleted ? "line-through" : ""}`}>{title}</h1>
            <p className={`${isCompleted ? "line-through" : ""}`}>{content}</p>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <IconCheck
          className={`${
            isEditable
              ? "block cursor-pointer "
              : isCompleted
              ? "pointer-events-none hidden cursor-not-allowed"
              : "hidden cursor-pointer "
          } icon`}
          size={23}
          color="green"
          onClick={() => handleUpdate(id)}
        />
        <IconEdit
          className={`${
            isEditable
              ? "hidden cursor-pointer "
              : isCompleted
              ? "pointer-events-none block cursor-not-allowed"
              : "block cursor-pointer "
          } icon`}
          size={23}
          color="green"
          onClick={() => setIsEditable((prev) => !prev)}
        />
        <IconTrash
          className={`icon ${
            isCompleted || isEditable
              ? "pointer-events-none cursor-not-allowed"
              : " cursor-pointer "
          }`}
          size={23}
          color="red"
          onClick={() => handleDelete(id)}
        />
      </div>
      <div
        className={`absolute h-0.5 border-2 border-red-700 w-[95%] self-center place-self-center inset-0 ${
          isCompleted ? "opacity-100" : "opacity-0"
        } transition duration-200`}
      ></div>
    </div>
  );
}

export default Note;
