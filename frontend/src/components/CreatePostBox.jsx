import { useState } from "react";
import { X, Plus, ArrowLeft, Globe, Users, Heart, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { postRoute } from "../utils/routes";
import apiClient from "../utils/apiClient";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const visibilityOptions = [
  { value: "PUBLIC", label: "Public", description: "Anyone can see this post", icon: Globe },
  { value: "FOLLOWERS", label: "Followers", description: "Only your followers", icon: Users },
  { value: "CLOSE_FRIENDS", label: "Close Friends", description: "Only your close friends", icon: Heart },
];

const hideScrollbarStyle = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const CreatePostBox = ({ onClose }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [loading, setLoading] = useState(false);
  const [loadingCaption, setLoadingCaption] = useState(false);
  const [step, setStep] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- Handle caption generation ---
  const handleGenerateCaption = async () => {
    setLoadingCaption(true);
    try {
      const res = await apiClient.post(`${postRoute}/generate/caption`);
      if (res?.status === 200) setDescription(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate caption");
    } finally {
      setLoadingCaption(false);
    }
  };

  // --- Handle image selection ---
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
    setImageFiles((prev) => [...prev, ...files]);
  };

  // --- Handle image removal ---
  const handleRemoveImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    if (currentIndex >= imagePreviews.length - 1) {
      setCurrentIndex(Math.max(0, imagePreviews.length - 2));
    }
  };

  // --- Create post handler ---
  const handleCreatePost = async () => {
    if (imageFiles.length === 0) {
      toast.error("Please add at least one image.");
      return;
    }

    const formData = new FormData();
    imageFiles.forEach((file) => formData.append("postImages", file));
    formData.append("caption", description);
    formData.append("visibility", visibility);

    setLoading(true);
    try {
      const res = await apiClient.post(postRoute, formData);
      if (res?.status === 201) {
        toast.success(res.data.message);
        setImageFiles([]);
        setImagePreviews([]);
        setDescription("");
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{hideScrollbarStyle}</style>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 dark:bg-white/10 backdrop-blur-sm">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-foreground cursor-pointer"
        >
          <X size={25} />
        </button>

        {/* ✅ Keep file input outside animated div so it's always accessible */}
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageUpload}
        />

        {/* Main container */}
        <motion.div
          layout
          initial={{ width: 400 }}
          animate={{ width: step === 1 ? 400 : 700 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="relative shadow-xl flex bg-background h-[560px] rounded-xl"
        >
          {/* Left Side - Image Section (3 stacked divs: header, image, thumbnails) */}
          <div className="flex flex-col w-[400px] h-full">
            {/* 1. Top Bar - Fixed height (only when images are uploaded) */}
            {step === 1 && imagePreviews.length > 0 && (
              <div className="h-[45px] flex-shrink-0 border-b flex items-center justify-between px-3 bg-background">
                <div className="w-5" />

                <button
                  onClick={() => setStep(2)}
                  className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}

            {/* 2. Middle - Big Image (fills remaining space) */}
            <div className="flex-1 min-h-0 relative bg-gray-50 dark:bg-background flex items-center justify-center">
              {imagePreviews.length > 0 ? (
                <>
                  {/* Custom Carousel */}
                  <div className="w-full h-full flex items-center justify-center p-4 relative">
                    <img
                      src={imagePreviews[currentIndex]}
                      alt={`Preview ${currentIndex}`}
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />

                    {/* Navigation Buttons */}
                    <button
                      onClick={() =>
                        setCurrentIndex((prev) => Math.max(0, prev - 1))
                      }
                      disabled={currentIndex === 0}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full shadow-md"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentIndex((prev) =>
                          Math.min(imagePreviews.length - 1, prev + 1),
                        )
                      }
                      disabled={currentIndex === imagePreviews.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full shadow-md"
                    >
                      <ArrowLeft size={20} className="rotate-180" />
                    </button>
                  </div>
                </>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center cursor-pointer bg-blue-700 text-white font-medium px-5 py-2 rounded-md transition"
                >
                  Click to upload images
                </label>
              )}
            </div>

            {/* 2. Bottom - Thumbnail Strip - Fixed height */}
            {imagePreviews.length > 0 ? (
              <div className="h-28 flex-shrink-0 px-3 py-2 bg-background border-t border-gray-300 dark:border-gray-300 flex gap-2 items-center overflow-x-auto hide-scrollbar">
                {imagePreviews.map((src, index) => (
                  <div
                    key={index}
                    className="relative flex-shrink-0 cursor-pointer group"
                    onClick={() => setCurrentIndex(index)}
                  >
                    <img
                      src={src}
                      alt={`Thumbnail ${index}`}
                      className={`w-20 h-20 object-cover border-2 rounded-lg transition-all ${
                        index === currentIndex
                          ? "border-blue-500 dark:border-blue-400 opacity-100 shadow-md"
                          : "border-gray-300 dark:border-gray-600 opacity-70 group-hover:opacity-100 group-hover:border-blue-400 dark:group-hover:border-blue-500"
                      }`}
                    />
                  </div>
                ))}
                <label
                  htmlFor="image-upload"
                  className="flex-shrink-0 w-20 h-20 flex items-center justify-center bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  title="Add more images"
                >
                  <Plus
                    size={24}
                    className="text-gray-500 dark:text-gray-400"
                  />
                </label>
              </div>
            ) : null}
          </div>

          {/* Right Side - Caption Section */}
          {step === 2 && (
            <motion.div
              key="caption-box"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex flex-col w-[300px] p-4 border-l border-gray-300 dark:border-gray-300 bg-background"
            >
              {/* Caption Textarea */}
              <textarea
                placeholder="Add a caption..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex-1 border border-gray-300 dark:border-gray-300 rounded-lg p-2 resize-none outline-none text-sm text-foreground bg-background focus:border-blue-500 dark:focus:border-blue-400 transition miniScrollbar placeholder:text-gray-500"
              />

              {/* Visibility Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full mt-3 flex items-center justify-between border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors bg-background">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const opt = visibilityOptions.find(o => o.value === visibility);
                        const Icon = opt.icon;
                        return (
                          <>
                            <Icon size={16} className="text-blue-500" />
                            <span className="text-foreground">{opt.label}</span>
                          </>
                        );
                      })()}
                    </div>
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[268px] bg-background border border-gray-200 dark:border-gray-700 rounded-xl p-1">
                  {visibilityOptions.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <DropdownMenuItem
                        key={opt.value}
                        onClick={() => setVisibility(opt.value)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                          visibility === opt.value ? "bg-muted" : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={16} className="text-blue-500" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">{opt.label}</span>
                            <span className="text-xs text-gray-500">{opt.description}</span>
                          </div>
                        </div>
                        {visibility === opt.value && <Check size={16} className="text-blue-500" />}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Generate Caption Button */}
              <Button
                variant="outline"
                className="w-full mt-3 rounded-lg"
                disabled={loadingCaption}
                onClick={handleGenerateCaption}
              >
                {loadingCaption ? <Spinner /> : "Generate Caption ✨"}
              </Button>

              {/* Create Button */}
              <Button
                className="w-full mt-3 bg-blue-700 rounded-lg"
                disabled={loading}
                onClick={handleCreatePost}
              >
                {loading ? <Spinner /> : "Create Post"}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default CreatePostBox;
