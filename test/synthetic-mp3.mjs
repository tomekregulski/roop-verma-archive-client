// Optional local test tool only; application code never imports this module.
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

/** Encodes a quiet generated tone without reading any recording or provider. */
export async function syntheticMp3(encoderPath, seconds = 900) {
  if (!encoderPath || !path.isAbsolute(encoderPath))
    throw Error('An absolute path to the optional lamejs/lame.all.js is required');
  if (!Number.isInteger(seconds) || seconds < 1 || seconds > 2700)
    throw Error('Synthetic duration must be 1 to 2700 seconds');
  const scope = {};
  vm.runInNewContext(await readFile(encoderPath, 'utf8'), scope);
  const encoder = new scope.lamejs.Mp3Encoder(1, 22050, 64);
  const chunks = [];
  for (let frame = 0; frame < Math.ceil((seconds * 22050) / 1152); frame++) {
    const pcm = new Int16Array(1152);
    for (let sample = 0; sample < pcm.length; sample++)
      pcm[sample] = Math.round(
        400 * Math.sin(((frame * 1152 + sample) * 2 * Math.PI * 220) / 22050),
      );
    chunks.push(Buffer.from(encoder.encodeBuffer(pcm)));
  }
  chunks.push(Buffer.from(encoder.flush()));
  return Buffer.concat(chunks);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const media = await syntheticMp3(process.argv[2], Number(process.argv[4] || 900));
  if (!process.argv[3] || !path.isAbsolute(process.argv[3]))
    throw Error('An absolute output path is required');
  await writeFile(process.argv[3], media, { flag: 'wx' });
  console.log(
    JSON.stringify({
      bytes: media.length,
      sha256: createHash('sha256').update(media).digest('hex'),
    }),
  );
}
