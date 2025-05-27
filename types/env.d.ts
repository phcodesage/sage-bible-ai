declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_BIBLE_API_KEY: string;
    }
  }
}

export {};