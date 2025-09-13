import { SchemaType, type Schema } from "@google/generative-ai";

// import { Schema, SchemaType } from "@google/generative-ai";

export const QuoteDataPropsSchema: Schema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      text: { type: SchemaType.STRING },
      author: { type: SchemaType.STRING },
    },
    required: ["text", "author"],
  },
};

export const TextTypingTemplatePhraseSchema: Schema = {
  type: SchemaType.ARRAY,
  items: {type: SchemaType.STRING},
};

export const TextTypingTemplateSchema: Schema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      lines: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
      },
      category: { type: SchemaType.STRING },
      mood: { type: SchemaType.STRING },
    },
    required: ["lines", "category", "mood"],
  },
};
