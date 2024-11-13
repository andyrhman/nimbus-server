import crypto from 'crypto';

export function generateRandom6DigitNumber(): string {
    const randomBuffer = crypto.randomBytes(3); // 3 bytes = 24 bits, enough for 6 digits
    const randomInt = randomBuffer.readUIntBE(0, 3); // Read as an unsigned integer

    // Ensure the number is within the 6-digit range (0 to 999999)
    const max = 999999;
    const number = randomInt % (max + 1);

    // Format the number with leading zeros if necessary
    return number.toString().padStart(6, '0');
}
