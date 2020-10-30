import { Parameters } from 'interfaces/compiler/parameters';

const references = {
  typescript: ['ts', 'typescript'],
  javascript: ['js', 'javascript'],
};

export function getLanguage(parameters: Parameters): string {
  const { output } = parameters;
  const language: string = Object.entries(references).filter((x) => x[1].includes(output))[0][0];
  return language;
}

export default {
  references,
  getLanguage,
};
