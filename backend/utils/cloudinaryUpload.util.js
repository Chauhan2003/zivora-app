import { v2 as cloudinary } from "cloudinary";
import path from "path";

/**
 * Upload a buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} fileName - The original file name
 * @returns {Promise<string>} The secure URL of the uploaded image
 */
export const uploadToCloudinary = async (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "zivora/posts",
          resource_type: "image",
          transformation: [
            { quality: "auto", fetch_format: "auto" }, // Auto-optimize images
          ],
          public_id: `${Date.now()}-${path.parse(fileName).name}`,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      )
      .end(fileBuffer);
  });
};

/**
 * Upload multiple buffers to Cloudinary
 * @param {Array} files - Array of file buffers with names
 * @returns {Promise<Array>} Array of secure URLs
 */
export const uploadMultipleToCloudinary = async (files) => {
  const uploadPromises = files.map((file) =>
    uploadToCloudinary(file.buffer, file.originalname)
  );
  return Promise.all(uploadPromises);
};

/**
 * Delete an image from Cloudinary
 * @param {string} imageUrl - The public URL of the image to delete
 * @returns {Promise<Object>} Deletion result
 */
export const deleteFromCloudinary = async (imageUrl) => {
  try {
    const publicId = imageUrl.split("/").pop().split(".")[0];
    const result = await cloudinary.uploader.destroy(`zivora/posts/${publicId}`);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};
