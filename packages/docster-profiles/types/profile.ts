export interface IProfile {
  profileName: string;
  acceptedFileTypes: Array<string>;
  providers: Array<string>;
  prompt: string;
  schema: object;
  csvConversionOptions: object;
}
