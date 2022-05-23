const {Translate} = require('@google-cloud/translate').v2;
const {TextToSpeechClient} = require("@google-cloud/text-to-speech");

const translate = new Translate();
const textToSpeechClient = new TextToSpeechClient();

exports.base64ToBuffer = (data) => {
  let extension = data.slice(11, 14);
  if (extension !== "png") {
    extension = "jpeg";
  }
  let imgData = data.replace(/^data:image\/png;base64,/, "");
  imgData = imgData.replace(/^data:image\/jpeg;base64,/, "");
  const buffer = Buffer.from(imgData, "base64");
  return {buffer, extension};
};

exports.translateText = async (originalTitle, originalText, target) => {
  const text = [originalTitle, originalText];
  try {
    let [translations] = await translate.translate(text, target);
    translations = Array.isArray(translations) ? translations : [translations];
    return translations;
  }
  catch {
    return null;
  }
};

exports.detectLanguage = async (text) => {
  try {
    let [detections] = await translate.detect(text);
    detections = Array.isArray(detections) ? detections : [detections];
    return detections[0].language;
  }
  catch {
    return null;
  }
};

const mapper = {
  'en': 'en-US',
  'fr': 'fr-FR',
  'ro': 'ro-RO',
  'de': 'de-DE',
  'es': 'es-ES'
};

exports.getAudioFromText = async (text, detectedLanguage) => {
  const request = {
    input: {text: text },
    voice: { languageCode: mapper[detectedLanguage], ssmlGender: "NEUTRAL" },
    audioConfig: { audioEncoding: "MP3" }
  };
  try {
    const [response] = await textToSpeechClient.synthesizeSpeech(request);
    return response.audioContent;
  }
  catch {
    return null;
  }

};