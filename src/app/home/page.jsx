"use client";

import Note from "@/components/Note";
import useNoteStore from "@/store/Note";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { redirect, useRouter } from "next/navigation";

function Home() {
  const { notes, setNotes } = useNoteStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [fetchingToken, setFetchingToken] = useState(true);
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setToken(token);
    if (!token) {
      redirect("/login");
    }
    setFetchingToken(false);
  }, []);
  useEffect(() => {
    if (title && content) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [title, content]);
  useEffect(() => {
    async function fetchAllNotes() {
      try {
        const getNotesList = await axios.get(
          `${process.env.NEXT_PUBLIC_NOTES_API_URL}/get-notes`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        setNotes(getNotesList.data.data);
        toast.success(getNotesList.data.message);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.detail);
        } else {
          toast.error(error.message);
        }
      }
    }
    fetchAllNotes();
  }, []);
  async function handleAddNotes() {
    try {
      const newNote = {
        title,
        content,
      };
      const addNote = await axios.post(
        `${process.env.NEXT_PUBLIC_NOTES_API_URL}/create-note`,
        newNote,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (addNote) {
        newNote._id = addNote.data.id;
        toast.success(addNote.data.message);
        setNotes([...notes, newNote]);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.detail);
      } else {
        toast.error(error.message);
      }
    } finally {
      setTitle("");
      setContent("");
    }
  }
  if (fetchingToken) {
    return null;
  }

  async function handleLogout() {
    const token = localStorage.getItem("access_token");
    if(!token) {
      toast.error("You are not logged in");
      return;
    };
    localStorage.removeItem("access_token");
    toast.success("User logged out successfully");
    router.push("/login");
  }
  return (
    <div className="min-h-screen flex justify-center items-center gap-4 flex-col">
      {token && (
        <div className="flex justify-between w-[330px]">
          <section className="flex justify-end gap-2">
            <button
              className="button1 !p-2 bg-gray-800 !rounded-xl hover:bg-purple-800"
              onClick={() => {
                router.push("/");
              }}
            >
              Home
            </button>
            <button
              className="button1 !p-2 bg-gray-800 !rounded-xl hover:bg-purple-800"
              onClick={() => {
                router.push("/signup");
              }}
            >
              Signup
            </button>
          </section>
          <section className="flex justify-end gap-2">
            <button
              className="button1 !p-2 bg-purple-700 !rounded-xl hover:bg-gray-800"
              onClick={() => {
                router.push("/login");
              }}
            >
              Login
            </button>
            <button
              className="button1 !p-2 bg-purple-700 !rounded-xl hover:bg-gray-800"
              onClick={handleLogout}
            >
              Logout
            </button>
          </section>
        </div>
      )}
      <div
        className="bg-[#1a1a1a] rounded-lg flex flex-col justify-center text-black gap-2 overflow-hidden border-purple-950 border-2"
        style={{ boxShadow: "0px 0px 55px rgba(75,0,130, 1)" }}
      >
        <div className="bg-gray-800 flex justify-between">
          <div className="flex flex-col flex-1">
            <input
              type="text"
              placeholder="Enter your Note Title"
              className="placeholder:text-gray-400 p-4 bg-black text-gray-200 outline-none border-b-2 border-purple-950"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Enter your Note Content"
              rows={1}
              className="bg-black  text-gray-200 p-4 outline-none placeholder:text-gray-400 border-b-2 border-purple-950"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
          <button
            className="bg-black cursor-pointer hover:bg-[#1a1a1a] transition duration-200 p-4 border-l-2 border-b-2 border-purple-950 disabled:!text-gray-400 disabled:cursor-not-allowed !text-gray-300"
            onClick={handleAddNotes}
            disabled={isButtonDisabled}
          >
            Add Note
          </button>
        </div>
        <div className="p-2">
          {notes?.map((note) => (
            <Note
              key={note._id}
              title={note.title}
              content={note.content}
              id={note._id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
