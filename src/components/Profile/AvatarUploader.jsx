import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { API_URL } from "../../config/config";

function AvatarUploader({ imageUrl, role, onImageUpdated  }) {
  const { authenticateUser } = useContext(AuthContext);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const token = localStorage.getItem("authToken");
      const uploadRes = await axios.post(`${API_URL}/upload/image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { url, public_id } = uploadRes.data;

      const endpoint =
        role === "provider"
          ? `${API_URL}/providers/image`
          : `${API_URL}/users/image`;

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
    } catch (error) {
      console.log(error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="avatar-uploader">
  <img src={imageUrl} alt="Profile avatar" />

  <label className="avatar-upload-button">
    Change photo
    <input
      type="file"
      accept="image/*"
      hidden
      onChange={handleFileSelect}
    />
  </label>

  {selectedFile && (
    <p className="avatar-file-info">
      Selected file: {selectedFile.name}
    </p>
  )}

  <button
    className="avatar-confirm-button"
    type="button"
    onClick={handleUpload}
    disabled={!selectedFile || isUploading}
  >
    {isUploading ? "Uploading..." : "Upload image"}
  </button>
</div>

  );
}

export default AvatarUploader;
