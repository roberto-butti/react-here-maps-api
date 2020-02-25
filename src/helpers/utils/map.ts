function toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
}

function toDegrees(radians: number): number {
    return radians * 180 / Math.PI;
}

/**
 * A bearing in a degrees between 0 and 360
 * 
 * @param startLat 
 * @param startLng 
 * @param destLat 
 * @param destLng 
 * @returns degrees
 * 
 */
export function bearing(startLat: number, startLng: number, destLat: number, destLng: number) {
    startLat = toRadians(startLat);
    startLng = toRadians(startLng);
    destLat = toRadians(destLat);
    destLng = toRadians(destLng);

    let y = Math.sin(destLng - startLng) * Math.cos(destLat);
    let x = Math.cos(startLat) * Math.sin(destLat) -
        Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    let brng = Math.atan2(y, x);
    brng = toDegrees(brng);
    return (brng + 360) % 360;
}