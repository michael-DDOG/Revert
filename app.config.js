// Dynamic Expo config - extends app.json with environment variables
// This keeps sensitive API keys out of version control

module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      // Anthropic API key from environment variable (not committed to git)
      anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    },
  };
};
