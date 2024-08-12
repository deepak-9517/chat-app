import axios from "axios";
const url = `https://api.cloudinary.com/v1_1/${
  import.meta.env.VITE_CLOUDINARY_NAME
}/auto/upload`;
// console.log("process", import.meta.env.VITE_CLOUDINARY_NAME);
const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chat-app-image");
    const res = await axios.post(url, formData);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export default uploadFile;
