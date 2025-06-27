import React, { useState, useRef } from "react";
import { ImagePlus, X, User } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APIS } from "../../../config/Config";

const CreatePostForm = ({
  currentUser,
  profile,
  onClose,
  postToEdit,
  isEditMode,
}) => {
  const [form, setForm] = useState({
    title: postToEdit?.title || "",
    propertyType: postToEdit?.propertyType || "",
    location: postToEdit?.location || "",
    description: postToEdit?.description || "",
    images: postToEdit?.media || [],
  });

  const [isEdit] = useState(isEditMode);

  // console.log(profile)

  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const { mutate: createPostMutate } = useMutation({
    mutationFn: async (formData) => {
      // eslint-disable-next-line no-useless-catch
      try {
        const res = await APIS.createPost(formData);
        if (res.status === 400) {
          throw new Error(
            "Your post appears to violate our community guidelines (e.g., adult or harmful content). Please review and edit your content."
          );
        }
        return res;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (newPost) => {
      queryClient.setQueryData(["HomePosts", currentUser?.id], (oldData) => {
        if (!oldData) return [newPost];
        return [newPost, ...oldData];
      });
    },
  });

  const { mutate: updatePostMutate } = useMutation({
    mutationFn: async ({ postId, formData }) => {
      // eslint-disable-next-line no-useless-catch
      try {
        const res = await APIS.updatePost(postId, formData);
        if (res.status === 400) {
          throw new Error(
            "Your post appears to violate our community guidelines (e.g., adult or harmful content). Please review and edit your content."
          );
        }
        return res;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: ["HomePosts"] });
      queryClient.setQueryData(["HomePosts"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((post) =>
              post._id === updatedPost._id ? updatedPost : post
            ),
          })),
        };
      });
    },
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "images") {
      const newImages = Array.from(files).map((file) => ({ file }));
      setForm({ ...form, images: [...form.images, ...newImages] });

      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const removeImage = (index) => {
    const newImages = [...form.images];
    newImages.splice(index, 1);
    setForm({ ...form, images: newImages });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("owner", currentUser?.id);
    formData.append("title", form.title);
    formData.append("propertyType", form.propertyType);
    formData.append("description", form.description);
    formData.append("location", form.location);

    if (isEdit) {
      formData.append("postId", postToEdit._id);
      const existingFiles = form.images
        .filter((img) => img.url)
        .map((img) => img.url);
      formData.append("existingFiles", existingFiles);

      // Append new files
      form.images.forEach((item) => {
        if (item.file) {
          formData.append(`files`, item.file);
        }
      });

      updatePostMutate({ postId: postToEdit._id, formData });
    } else {
      form.images.forEach((item) => {
        if (item.file) {
          formData.append(`files`, item.file);
        }
      });
      createPostMutate(formData);
    }
  };

  const handleCancel = () => {
    setForm({
      title: "",
      propertyType: "",
      location: "",
      description: "",
      images: [],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white max-w-2xl w-full rounded-xl shadow-xl p-6 overflow-y-auto max-h-[calc(100vh-4rem)] relative">
        {/* Top-right close button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center overflow-hidden">
            {profile?.image ? (
              <img
                src={profile?.image}
                alt={profile?.user_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold text-base">
              {profile?.user_name}
            </h3>
            <p className="text-gray-500 text-xs">Posting publicly</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="Give your post a descriptive title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Property Type & Location */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type <span className="text-red-500">*</span>
              </label>
              <select
                name="propertyType"
                value={form.propertyType}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select property type</option>
                <option>Apartment</option>
                <option>House</option>
                <option>Condo</option>
                <option>Townhouse</option>
                <option>Studio</option>
                <option>Commercial</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                placeholder="Property location"
                value={form.location}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              placeholder="Share your experience with the property..."
              value={form.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images (Optional)
            </label>

            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-100 transition text-sm font-medium">
              <ImagePlus className="w-5 h-5" />
              Upload Images
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleChange}
                className="hidden"
              />
            </label>

            {/* Preview: Desktop + Mobile Scroll */}
            {form.images.length > 0 && (
              <div className="mt-4">
                {/* Desktop Grid */}
                <div className="hidden sm:grid sm:grid-cols-3 gap-4">
                  {form.images.map((img, index) => (
                    <div
                    key={index}
                    className="relative group border border-gray-300 rounded-lg overflow-hidden"
                    >
                      <img
                        src={img.url ? img.url : URL.createObjectURL(img.file)} // Handle both URLs and files
                        alt={`Preview ${index}`}
                        className="object-cover w-full h-32"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Mobile Scroll */}
                <div className="sm:hidden flex gap-4 overflow-x-auto pb-2 mt-2">
                  {form.images.map((img, index) => (
                    <div
                      key={index}
                      className="relative min-w-[120px] h-28 rounded-lg border border-gray-300 overflow-hidden group"
                    >
                      <img
                        src={img.url ? img.url : URL.createObjectURL(img.file)}
                        alt={`Preview ${index}`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Share Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostForm;
