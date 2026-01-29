import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { API_URL } from "../../config/config";
import Message from "../Message/Message";
import Spinner from "../Spinner/Spinner";

function AvatarUploader({ imageUrl, role, onImageUpdated }) {
  const { authenticateUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setErrorMessage(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const token = localStorage.getItem("authToken");
      const uploadRes = await axios.post(
        `${API_URL}/api/upload/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const { url, public_id } = uploadRes.data;

      const endpoint =
        role === "provider"
          ? `${API_URL}/api/providers/image`
          : `${API_URL}/api/users/image`;

      await axios.put(
        endpoint,
        { image: { url, public_id } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      onImageUpdated({ url, public_id });
      await authenticateUser();
      setSelectedFile(null);
      setSuccessMessage("Upload successful");
    } catch (error) {
      console.log("Image upload error:", error);

      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Failed to upload image. ");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="avatar-uploader">
      <img src={imageUrl} alt="Profile avatar" />

      <label className="avatar-change-button">
        Change photo
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileSelect}
        />
      </label>

      {selectedFile && (
        <p className="avatar-file-info">Selected file: {selectedFile.name}</p>
      )}

      <div className="avatar-upload-actions">
        <button
          className={
            isUploading ? "avatar-upload-button hidden" : "avatar-upload-button"
          }
          type="button"
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
        >
          Upload image
        </button>

        {isUploading && (
          <Spinner size={16} text="Uploading..." color="var(--color-primary)" />
        )}
      </div>

      <Message
        type="success"
        text={successMessage}
        clearMessage={setSuccessMessage}
      />

      <Message
        type="error"
        text={errorMessage}
        clearMessage={setErrorMessage}
        duration={4000}
      />
    </div>
  );
}

export default AvatarUploader;
