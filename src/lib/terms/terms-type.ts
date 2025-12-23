export default interface TermsType {
  id: string;
  title?: string;
  content: {
    text: string;
    bold: boolean;
  }[];
}
