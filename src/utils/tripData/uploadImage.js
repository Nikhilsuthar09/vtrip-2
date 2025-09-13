const getMimeType = (uri) => {
  const extension = uri.split(".").pop().toLowerCase();
  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    default:
      return "image/jpeg";
  }
};

export const uploadImageToCloudinary = async (imageUrl) => {
  if (!imageUrl) {
    return null;
  }
  try {
    const data = new FormData();
    data.append("file", {
      uri: imageUrl,
      type: getMimeType(imageUrl),
      name: `trip_${Date.now()}.${imageUrl.split(".").pop()}`,
    });
    data.append("upload_preset", "vtrip_uploads");
    data.append("cloud_name", "vtrip-cloud");

    data.append("folder", "vtrip/trips");
    data.append("quality", "auto");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/vtrip-cloud/image/upload",
      {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    if (json.secure_url) {
      return json.secure_url;
    } else {
      throw new Error("No secure_url in response");
    }
  } catch (e) {
    console.log("upload error", e);
    return null;
  }
};
export const uploadProfileImgToCloudinary = async (imageUrl, uid) => {
  if (!imageUrl) {
    return null;
  }
  try {
    const data = new FormData();
    data.append("file", {
      uri: imageUrl,
      type: getMimeType(imageUrl),
      name: `user_${uid}_${Date.now()}`,
    });
    data.append("upload_preset", "vtrip_uploads");
    data.append("cloud_name", "vtrip-cloud");

    data.append("folder", "vtrip/user");
    data.append("quality", "auto");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/vtrip-cloud/image/upload",
      {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    if (json.secure_url) {
      return json.secure_url;
    } else {
      throw new Error("No secure_url in response");
    }
  } catch (e) {
    console.log("upload error", e);
    return null;
  }
};
