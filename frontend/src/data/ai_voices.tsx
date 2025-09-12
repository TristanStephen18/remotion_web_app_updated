export type VoiceId =
  | '21m00Tcm4TlvDq8ikWAM'
  | '2EiwWnXFnvU5JabPnv8n'
  | 'CwhRBWXzGAHq8TQ4Fs17'
  | 'EXAVITQu4vr4xnSDxMaL'
  | 'Xb7hH8MSUJpSbSDYk0k2'
  | 'XrExE9yKIg1WjnnlVkGX'
  | 'TX3LPaxmHKxFdv7VOQHJ'
  | 'JBFqnCBsd6RMkjVDRZzb';


export type SampleVoice = 
  | '/ai_voices/rachel.mp3'
  | '/ai_voices/clyde.mp3'
  | '/ai_voices/roger.mp3'
  | '/ai_voices/sarah.mp3'
  | '/ai_voices/alice.mp3'
  | '/ai_voices/mathilda.mp3'
  | '/ai_voices/liam.mp3'
  | '/ai_voices/george.mp3';

export const VOICES: {id: VoiceId; label: string; sampleVoice: SampleVoice}[] = [
  {id: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel (Conversational, Friendly)', sampleVoice: '/ai_voices/rachel.mp3'},
  {id: '2EiwWnXFnvU5JabPnv8n', label: 'Clyde (Characters & Animation)',  sampleVoice: '/ai_voices/clyde.mp3'},
  {id: 'CwhRBWXzGAHq8TQ4Fs17', label: 'Roger (Conversational)', sampleVoice: '/ai_voices/roger.mp3'},
  {id: 'EXAVITQu4vr4xnSDxMaL', label: 'Sarah (Entertainment & TV)', sampleVoice: '/ai_voices/sarah.mp3'},
  {id: 'Xb7hH8MSUJpSbSDYk0k2', label: 'Alice (Advertising)', sampleVoice: '/ai_voices/alice.mp3'},
  {id: 'XrExE9yKIg1WjnnlVkGX', label: 'Mathilda (Informative & Educational)', sampleVoice: '/ai_voices/mathilda.mp3'},
  {id: 'TX3LPaxmHKxFdv7VOQHJ', label: 'Liam (Social Media & Vlogs)', sampleVoice: '/ai_voices/liam.mp3'},
  {id: 'JBFqnCBsd6RMkjVDRZzb', label: 'George (Storytelling)', sampleVoice: '/ai_voices/george.mp3'},
];
