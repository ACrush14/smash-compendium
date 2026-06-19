import { createWorker } from 'tesseract.js';

async function testOCR() {
  const worker = await createWorker('eng');
  const { data: { text } } = await worker.recognize('teste_3ds_crop_4.jpg');
  console.log('--- RESULTADO DO OCR ---');
  console.log(text);
  console.log('------------------------');
  await worker.terminate();
}

testOCR();
