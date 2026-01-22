"use client";

import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";

type GalleryItem = {
  _id: string;
  title: string;
  description: string;
  aspectRatio: "9:16" | "16:9";
  mediaType: "image" | "video";
  createdAt: string;
};

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "16:9">("16:9");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const token = localStorage.getItem("admin-token");

  const fetchGallery = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/gallery", {
        cache: "no-store",
      });
      const data = await res.json();
      setGallery(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAspectRatio("16:9");
    setImage(null);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return alert("Title and description required");
    if (!image && !editingId) return alert("Please select a file");

    setLoading(true);

    try {
      let res;
      if (editingId) {
        res = await fetch(
          `http://localhost:5000/api/gallery/${editingId}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, aspectRatio }),
          }
        );
      } else {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("aspectRatio", aspectRatio);
        if (image) formData.append("image", image);

        res = await fetch("http://localhost:5000/api/gallery", {
          method: "POST",
          headers: {

            'Authorization': `Bearer ${token}`
          },
          body: formData,
        });
      }

      if (!res.ok) throw new Error("Failed");
      alert(editingId ? "Gallery updated" : "Media uploaded");
      resetForm();
      fetchGallery();
    } catch (err) {
      console.error(err);
      alert("Error submitting");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/gallery/${id}`,
        {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`
          },
        }
      );
      if (!res.ok) throw new Error("Delete failed");
      fetchGallery();
    } catch (err) {
      console.error(err);
      alert("Error deleting");
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingId(item._id);
    setTitle(item.title);
    setDescription(item.description);
    setAspectRatio(item.aspectRatio);
  };

  return (
    <>
      {/* ✅ Admin Navbar */}
      <AdminNavbar />

      <div className="min-h-screen bg-muted px-4 py-12">
        <div className="max-w-3xl mx-auto bg-background p-6 rounded-xl shadow-lg space-y-6">
          <h1 className="text-2xl font-bold text-center">
            {editingId ? "Edit Gallery Item" : "Upload Media"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-3 py-2"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Aspect Ratio
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="16:9"
                    checked={aspectRatio === "16:9"}
                    onChange={(e) =>
                      setAspectRatio(e.target.value as "16:9")
                    }
                  />
                  <span>16:9 (Landscape)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="9:16"
                    checked={aspectRatio === "9:16"}
                    onChange={(e) =>
                      setAspectRatio(e.target.value as "9:16")
                    }
                  />
                  <span>9:16 (Portrait)</span>
                </label>
              </div>
            </div>

            {!editingId && (
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) =>
                  setImage(e.target.files?.[0] || null)
                }
                required
              />
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold"
              >
                {loading
                  ? "Processing..."
                  : editingId
                    ? "Update"
                    : "Upload"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Gallery Grid */}
        <div className="mt-12 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div
              key={item._id}
              className="bg-background border rounded-xl shadow-sm overflow-hidden"
            >
              {item.mediaType === "video" ? (
                <video
                  src={`http://localhost:5000/api/gallery/${item._id}/image`}
                  controls
                  className={`w-full object-cover ${item.aspectRatio === "9:16"
                    ? "aspect-[9/16]"
                    : "aspect-video"
                    }`}
                />
              ) : (
                <img
                  src={`http://localhost:5000/api/gallery/${item._id}/image`}
                  alt={item.title}
                  className={`w-full object-cover ${item.aspectRatio === "9:16"
                    ? "aspect-[9/16]"
                    : "aspect-video"
                    }`}
                />
              )}

              <div className="p-3 space-y-2">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.aspectRatio} •{" "}
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
