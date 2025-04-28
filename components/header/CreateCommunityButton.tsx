"use client";
import React, { useState, useRef, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { Button } from "../ui/button";
import { createCommunity } from "@/actions/createCommunity";
import { useRouter } from "next/navigation";

function CreateCommunityButton() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();

  const router = useRouter()

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);

    const generateSlug = (text: string) => {
      return text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .slice(0, 21);
    };
    //Auto generate slug from name
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value));
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setErrorMessage("");
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreateCommunity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //Error validation
    if (!name.trim()) {
      setErrorMessage("Community Name is required");
      return;
    }

    if (!slug.trim()) {
      setErrorMessage("Community slug is required");
      return;
    }

    setErrorMessage("");

    startTransition(async () => {
      try {
        let imageBase64: string | null = null;
        let fileName: string | null = null;
        let fileType: string | null = null;

        if (imageFile) {
          const reader = new FileReader();
          imageBase64 = await new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(imageFile);
          });
          fileName = imageFile.name;
          fileType = imageFile.type;
        }

        //server action
        const result = await createCommunity(
          name.trim(),
          imageBase64,
          fileName,
          fileType,
          slug.trim(),
          description.trim() || undefined
        );

        console.log("Community Created 🤗:", result)
        //router.push(`/community/${result.subverse._id}`)

        if ("error" in result && result.error) {
          setErrorMessage(result.error);
        } else if ("subverse" in result && result.subverse) {
          setOpen(false);
          0;
          resetForm();
          //router.refresh();
        }
      } catch (error) {
        console.error("Failed to create community", error);
        setErrorMessage("Failed to create community");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={!user}
        className="w-full p-2 pl-5 flex items-center rounded-md cursor-pointer bg-blue-900 text-white hover:bg-red-700 transition-all duration-200 disabled:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4 mr-2" />
        {user ? "Create a community" : "Sign in to create community"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-blue-950">
            Create a Community
          </DialogTitle>
          <DialogDescription>
            Create a community or subverse to share ideas and get feedback
          </DialogDescription>
          <form onSubmit={handleCreateCommunity} className="space-y-4 mt-2">
            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-blue-600"
              >
                Community Name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="My Community"
                className="w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                value={name}
                onChange={handleNameChange}
                required
                minLength={3}
                maxLength={21}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="slug"
                className="text-sm font-medium text-blue-600"
              >
                Community Slug (URL)
              </label>
              <Input
                id="slug"
                name="slug"
                placeholder="my-community"
                className="w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                minLength={3}
                maxLength={21}
                pattern="^[\-a-z0-9]+$" 
                title="Lowercase letters, numbers, and hyphens only"
              />
              <p className="text-xs text-gray-500">
                This will be used in the URL e.g mileverse.app/community/
                {slug || "community-slug"}
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-blue-600"
              >
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="What is this community about?"
                className="w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-600">
                Community Image (optional)
              </label>

              {/* container must be relative to position the “×” */}
              <div className="relative w-full h-24">
                {imagePreview ? (
                  // wrap siblings in one parent
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Community Image Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full 
                         w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center w-full h-full
                         border-2 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <ImageIcon className="w-6 h-6 mb-2 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        Click to upload an image
                      </span>
                    </button>
                  </div>
                )}

                {/* only one hidden input, always mounted */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending || !user}
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending
                ? "Creating ..."
                : user
                  ? "Create Community"
                  : "Sign in to create a community"}
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCommunityButton;
