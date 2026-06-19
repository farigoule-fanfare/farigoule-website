const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (err) => reject(err));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

/**
 * Recadre une image et la compresse à une taille carrée cible (ex: 400x400px, JPEG 80%)
 * @param {string} imageSrc - URL ou base64 de l'image source
 * @param {object} pixelCrop - Coordonnées fournies par react-easy-crop
 * @param {number} targetSize - Largeur/hauteur de l'image de sortie
 * @returns {Promise<Blob>} Le fichier image compressé sous forme de Blob
 */
export async function getCroppedAndCompressedImg(
  imageSrc,
  pixelCrop,
  targetSize = 400,
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  canvas.width = targetSize;
  canvas.height = targetSize;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetSize,
    targetSize,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Erreur lors de la génération du Canvas"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      0.8, // Taux de compression JPEG
    );
  });
}
