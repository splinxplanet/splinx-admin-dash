const uploadImage = async (imageFile, apiUrl, token) => {
    if (!imageFile || !(imageFile instanceof File)) return imageFile;
  
    const formData = new FormData();
    formData.append("image", imageFile);
  
    const response = await fetch(`${apiUrl}/advert/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  
    if (!response.ok) {
      console.error("Upload failed response");
      throw new Error("Image upload failed");
    }
  
    const data = await response.json();
    return data.imageUrl || data.url || data.filePath;
  };

export default uploadImage;
// This function uploads an image file to a specified API endpoint and returns the URL of the uploaded image.
  