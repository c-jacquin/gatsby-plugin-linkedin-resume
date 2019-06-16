import { extractInfo } from './linkedin';

exports.sourceNodes = async ({ actions }: any) => {
  const { createNode } = actions;

  const linkedInResume = await extractInfo();

  createNode({
    id: 'LinkedInResume',
    ...linkedInResume,
    internal: { contentDigest: JSON.stringify(linkedInResume), type: 'LinkedInResume' },
  });

  return;
};
