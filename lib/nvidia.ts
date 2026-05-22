import OpenAI from 'openai'

export const nvidia = new OpenAI({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_API_KEY,
})

export const MODELS = {
  chatbot: 'meta/llama-3.1-70b-instruct',
  blogGen: 'meta/llama-3.3-70b-instruct',
  translate: 'meta/llama-3.1-8b-instruct',
} as const
