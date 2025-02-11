import { space } from "postcss/lib/list";

export const WEBSITE_DOMAIN = "xWord";

export const SITE_TITLE = {
  HOMEPAGE: `${WEBSITE_DOMAIN}`,
  MOST_VIEWED: `Most Viewed | ${WEBSITE_DOMAIN}`,
  STARRED: `Starred | ${WEBSITE_DOMAIN}`,
  SHARED: `Shared | ${WEBSITE_DOMAIN}`,
  SPACES: `Spaces | ${WEBSITE_DOMAIN}`,
  DOCUMENT: (DocumentTitle: string) => `${DocumentTitle} | ${WEBSITE_DOMAIN} `,
  SPACE_PAGE: (SpaceTitle: string) => `${SpaceTitle} | ${WEBSITE_DOMAIN} `,
  SPACE_ONBOARDING: `Create Space | ${WEBSITE_DOMAIN}`,
  SIGN_IN_PAGE: `Sign In | ${WEBSITE_DOMAIN}`,
  SIGN_UP_PAGE: `Sign Up | ${WEBSITE_DOMAIN}`,
  VERIFY_EMAIL_PAGE: `Verify Email | ${WEBSITE_DOMAIN}`,
};

export const SITE_DESCRIPTION = {
  HOMEPAGE: `Transform your writing experience with our AI-powered platform on ${WEBSITE_DOMAIN}! Craft SEO-friendly documents effortlessly, backed by intelligent suggestions, trending topics, and grammar checks. Take collaboration to new heights with live editing and commenting features, allowing real-time teamwork. Organize your content seamlessly in personalized or shared spaces, invite users with customizable access, and share your creations with ease. Elevate your writing journey on [YourWebsiteDomain] with advanced features for unparalleled creativity and collaboration!`,

  MOST_VIEWED: `Discover the charm of our most viewed document on ${WEBSITE_DOMAIN}! Immerse yourself in captivating content crafted with AI precision. This user-friendly masterpiece combines intelligent suggestions, trending topics, and flawless grammar, making it a must-read. Join the community and explore the document that has captured the attention of countless readers. With live collaboration and commenting features, engage in real-time discussions around this popular piece. Discover why this document stands out, and experience the pinnacle of content creation on ${WEBSITE_DOMAIN}!. Explore the most viewed page and be part of a writing revolution!`,
  SHARED: `Discover the beauty of our shared document on ${WEBSITE_DOMAIN}! Immerse yourself in captivating content crafted with AI precision. This user-friendly masterpiece combines intelligent suggestions, trending topics, and flawless grammar, making it a must-read.`,
  STARRED: `Dive into your own curated haven of brilliance on ${WEBSITE_DOMAIN}`,
  SPACES: `tep into the heart of collaboration on ${WEBSITE_DOMAIN} with our Spaces page! Discover a centralized hub showcasing all the spaces you've created and those you've been invited to. Whether it's your personal haven or collaborative ventures, Spaces brings together a tailored collection of documents. Dive into intelligent suggestions, trending topics, and grammar perfection within these organized realms. Engage with live collaboration features and discussions, all neatly arranged on your Spaces page. Join the community and explore the convenience of managing your created and invited spaces seamlessly on [YourWebsiteDomain]. Elevate your collaborative writing experience with Spaces!`,
  Document: (DocumentTitle: string) => {
    return `Embark on a journey through the creation of "${DocumentTitle}" – a document crafted by you on XWord. Immerse yourself in the unique insights and information you've meticulously curated. Whether it's your thoughts, ideas, or a creative endeavor, experience the fulfillment of your creation. XWord is your canvas, and "${DocumentTitle}" is your masterpiece. Explore and relish in the content you've brought to life, exclusively on XWord, where your creativity knows no bounds`;
  },
  SPACE_PAGE: (spacename: string) => {
    return `Welcome to your space , ${spacename}! Here you can manage your documents, collaborate with others, and customize your space. With XWord, you can create your own spaces, invite others to collaborate on them, and share your creations with ease.`;
  },
  SPACE_ONBOARDING: `Forge your creative haven with ${WEBSITE_DOMAIN} 'Create Space' page! Elevate your collaborative journey by crafting personalized spaces where ideas thrive. Whether it's for team projects, personal reflections, or shared endeavors, this is your canvas to curate. Immerse yourself in intelligent suggestions, trending topics, and seamless grammar checks tailored to your creative vision. Experience the power of live collaboration and discussions, turning your space into a dynamic hub of innovation. Join the community and shape your writing environment effortlessly on XWord's 'Create Space' page. Unleash your creativity and let your ideas flourish,`,
  SIGN_IN_PAGE: `Welcome to  ${WEBSITE_DOMAIN} – where your writing journey begins! Sign in to access a world of creativity and collaboration. Your portal to intelligent suggestions, trending topics, and seamless grammar checks. Dive into the realm of live collaboration and discussions, where your ideas come to life. Join the community and unlock the full potential of  ${WEBSITE_DOMAIN}. Sign in now to embark on a writing adventure tailored just for you`,
  SIGN_UP_PAGE: `Join the creative community at  ${WEBSITE_DOMAIN}! Sign up now to embark on a writing adventure filled with intelligent suggestions, trending topics, and seamless grammar checks. As a member, you'll have access to live collaboration features, discussions, and a vibrant space for your ideas to flourish. Start your journey by creating an account and be part of the  ${WEBSITE_DOMAIN} community – where creativity knows no bounds. Sign up today and unleash the full potential of your writing experience!`,
  VERIFY_EMAIL_PAGE: `Welcome to ${WEBSITE_DOMAIN}! Just one more step to unlock the full spectrum of creativity. Check your inbox for a verification email. Click the link inside to confirm your email and officially join our vibrant community. Once verified, you'll gain access to intelligent suggestions, trending topics, seamless grammar checks, and live collaboration features. Thank you for choosing ${WEBSITE_DOMAIN} – where your writing journey takes flight. Verify your email now and dive into a world of limitless creativity`,
};
