export const hexStringToUint8Array = (hexString: string): Uint8Array =>
  new Uint8Array(
    hexString
      .replace(/^0x/i, '')
      .match(/.{1,2}/g)
      .map(byte => parseInt(byte, 16)),
  );

export const uint8ArrayToHexString = (bytes: Uint8Array): string =>
  '0x' + bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
