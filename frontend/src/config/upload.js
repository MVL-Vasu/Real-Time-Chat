const CloudinaryURL = `https://api.cloudinary.com/v1_1/dhdzriwzq/auto/upload`

const uploadMedia = async (file) => {
     const formData = new FormData();
     formData.append("file", file);
     formData.append("upload_preset", "chat-app-file");

     const response = await fetch(CloudinaryURL, {
          method: "POST",
          body: formData,
          headers: {
               "Accept": "application/json",
          },
     })

     const result = await response.json();

     return result;

}

// const uploadMedia = (file) => {
//      const formData = new FormData();
//      formData.append("file", file);
//      formData.append("upload_preset", "chat-app-file");

//      const xhr = new XMLHttpRequest();
//      xhr.open("POST", CloudinaryURL, true);

//      xhr.upload.onprogress = (event) => {
//           if (event.lengthComputable) {
//                const percentComplete = Math.round((event.loaded / event.total) * 100);
//                console.log(`Upload Progress: ${percentComplete}%`);
//                // Update progress state (if using a state management library or React state)
//                setProgress(percentComplete); // Assuming `setProgress` updates the progress bar
//           }
//      };

//      xhr.onload = () => {
//           if (xhr.status === 200) {
//                const response = JSON.parse(xhr.responseText);
//                toast.success("Video Updated Successfully");
//                console.log("Video URL:", response.secure_url);
//                setmessage({ ...message, videoUrl: response.secure_url }); // Update video URL
//           } else {
//                const error = JSON.parse(xhr.responseText);
//                toast.error(`Error: ${error.message}`);
//                console.error("Upload Error:", error);
//           }
//      };

//      xhr.onerror = () => {
//           toast.error("An error occurred during the upload.");
//           console.error("Upload Error:", xhr);
//      };

//      xhr.send(formData);
// };


export default uploadMedia;