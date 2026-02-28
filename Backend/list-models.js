require("dotenv").config();
const axios = require("axios");

async function listModels() {
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
    );

    console.log("AVAILABLE MODELS:");
    response.data.models.forEach((model) => {
      console.log(model.name);
      console.log("Supported:", model.supportedGenerationMethods);
      console.log("----------------------");
    });

  } catch (error) {
    console.error("FULL ERROR:");
    console.error(error.response?.data || error.message);
  }
}

listModels();
/*AVAILABLE MODELS:
models/gemini-2.5-flash
Supported: [
  'generateContent',
  'countTokens',
  'createCachedContent',
  'batchGenerateContent'
]
----------------------
models/gemini-2.5-pro
Supported: [
  'generateContent',
  'countTokens',
  'createCachedContent',
  'batchGenerateContent'
]
----------------------
models/gemini-2.0-flash
Supported: [
  'generateContent',
  'countTokens',
  'createCachedContent',
  'batchGenerateContent'
]
----------------------
models/gemini-2.0-flash-001
Supported: [
  'generateContent',
  'countTokens',
  'createCachedContent',
  'batchGenerateContent'
]
----------------------
models/gemini-2.0-flash-lite-001
Supported: [
  'generateContent',
  'countTokens',
  'createCachedContent',
  'batchGenerateContent'
]
----------------------
models/gemini-2.0-flash-lite
Supported: [
  'generateContent',
  'countTokens',
  'createCachedContent',
  'batchGenerateContent'
]
----------------------
models/gemini-2.5-flash-lite
Supported: [
  'generateContent',
  'countTokens',
  'createCachedContent',
  'batchGenerateContent'
]
----------------------*/