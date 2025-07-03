/**
 * Calcule l’angle en degrés du bras de lecture.
 * @param {number} trackIdx   Index de la piste courante (0-based)
 * @param {number} total      Nombre total de pistes sur l’album
 * @returns {number}          Angle en degrés à appliquer au bras
 */
export function armAngleDeg(trackIdx, totalTracks) {
  // exemple simple : du bord extérieur (-25°) au centre (+20°)
  const start = 6;
  const end = 26;
  return start + ((end - start) * trackIdx) / (totalTracks - 1);
}
