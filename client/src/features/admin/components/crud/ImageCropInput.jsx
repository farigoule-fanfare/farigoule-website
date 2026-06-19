import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedAndCompressedImg } from "./cropImageHelper";

export default function ImageCropInput({
  name,
  onChange,
  aspect = 1,
  targetSize = 400,
}) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState("");

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      const croppedBlob = await getCroppedAndCompressedImg(
        imageSrc,
        croppedAreaPixels,
        targetSize,
      );

      const croppedFile = new File(
        [croppedBlob],
        fileName || "cropped-image.jpg",
        {
          type: "image/jpeg",
        },
      );

      const localUrl = URL.createObjectURL(croppedBlob);
      setPreviewUrl(localUrl);

      onChange(croppedFile);

      setImageSrc(null);
    } catch (error) {
      console.error("Erreur lors du recadrage de la photo :", error);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setImageSrc(null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <input
          type="file"
          name={name}
          accept="image/*"
          onChange={onFileChange}
          className="contentPage-input"
          style={{ width: "auto" }}
        />
        {previewUrl && (
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "0.8rem", display: "block" }}>
              Rendu final :
            </span>
            <img
              src={previewUrl}
              alt="Aperçu recadré"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "8px",
                objectFit: "cover",
                border: "1px solid #ccc",
                marginTop: "0.25rem",
              }}
            />
          </div>
        )}
      </div>

      {imageSrc && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "500px",
              height: "380px",
              backgroundColor: "#333",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>

          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              backgroundColor: "#fff",
              padding: "1rem",
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              boxSizing: "border-box",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <label
                htmlFor="zoom-slider"
                style={{ color: "#333", fontWeight: "bold" }}
              >
                Zoom :
              </label>
              <input
                id="zoom-slider"
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-label="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                style={{ flex: 1 }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
              }}
            >
              <button
                type="button"
                className="contentPage-button contentPage-button--cancel"
                onClick={handleCancel}
                style={{ margin: 0 }}
              >
                Annuler
              </button>
              <button
                type="button"
                className="contentPage-button contentPage-button--submit"
                onClick={handleConfirm}
                style={{ margin: 0 }}
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
