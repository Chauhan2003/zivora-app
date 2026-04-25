import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDispatch, useSelector } from "react-redux";
import { userRoute } from "../utils/routes";
import { updateUser } from "../context/userSlice";
import apiClient from "../utils/apiClient";

const EditProfileImageBox = ({ onClose, currentImage, onSave }) => {
  const [imagePreview, setImagePreview] = useState(
    currentImage || "/profileImage.jpg"
  );
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("profileImage", imageFile);
      formData.append("fullName", currentUser?.fullName || "");

      const res = await apiClient.put(
        `${userRoute}/profile`,
        formData
      );

      if (res?.status === 200) {
        dispatch(updateUser({
          avatar: res?.data?.data?.avatar,
        }));
        onSave();
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 cursor-pointer"
      >
        <X size={25} />
      </button>

      {/* Box container */}
      <div className="border rounded-xl shadow-xl w-[400px] bg-white flex flex-col items-center p-6 gap-6">
        {/* Image preview */}
        <div className="relative">
          <div className="w-40 h-40 rounded-full overflow-hidden border">
            <img
              src={imagePreview}
              alt="Profile preview"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Upload input */}
          <label
            htmlFor="image-upload"
            className="absolute bottom-2 right-2 cursor-pointer bg-blue-700 p-2 rounded-full font-semibold"
          >
            <Pencil className="w-5 h-5 text-white" />
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* Save buttons */}
        <Button
          className="bg-blue-700 text-white cursor-pointer"
          onClick={handleSave}
          disabled={loading || !imageFile}
        >
          {loading ? <Spinner size="sm" /> : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default EditProfileImageBox;
