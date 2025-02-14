"use client";

import { useEffect, useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen";

import CloudinaryUploadWidget from "./CloudinaryUploadWidget";

const CloudinaryUpload = () => {
  // Configuration
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // State
  const [publicId, setPublicId] = useState("");

  // Cloudinary configuration
  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  // Upload Widget Configuration
  const uwConfig = {
    cloudName,
    uploadPreset,
    showAdvancedOptions: false,
    sources: ["local"],
    multiple: false,
    clientAllowedFormats: ["video"],
    maxChunkSize: 6000000,
    maxFileSize: 500000000,
  };

  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const loadCloudinaryScript = () => {
      //@ts-ignore
      if (window.cloudinary) {
        setScriptLoaded(true); // Script is already loaded
        return;
      }

      const script = document.createElement("script");
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.onload = () => setScriptLoaded(true);
      script.onerror = () => console.error("Failed to load Cloudinary script");
      document.body.appendChild(script);
    };

    loadCloudinaryScript();
  }, []);

  return (
    <div>
      <div>
        <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setPublicId} />
      </div>
    </div>
  );
};

export default CloudinaryUpload;
