import Image from "next/image";

const PromptsIcons = ({ promptTitle }: { promptTitle: string }) => {
    const iconsMap: { [key: string]: string } = {
        instagram: "/images/contentverse/instagram.svg",
        reel: "/images/contentverse/reels.svg",
        linkedin: "/images/contentverse/linkedin.svg",
        twitter: "/images/contentverse/x-twitter.svg",
        tweeting: "/images/contentverse/x-twitter.svg",
        tiktok: "/images/contentverse/tiktok.png",
        blog: "/images/contentverse/blog.svg",
        pinterest: "/images/contentverse/pinterest.svg",
        facebook: "/images/contentverse/facebook.svg",
        youtube: "/images/contentverse/youtube.svg",
        email: "/images/contentverse/cold-email.svg",
        case: "/images/contentverse/case-study.svg",
        job: "/images/contentverse/jd.svg",
        faq: "/images/contentverse/faq.svg",
        sales: "/images/contentverse/promo-email.svg",
        customer: "/images/contentverse/welcome-series.svg",
        product: "/images/contentverse/product-demo.svg",
        newsletter: "/images/contentverse/newsletter-ideas.svg",
        sms: "/images/contentverse/sms-msg-copy.svg",
        google: "/images/contentverse/google.svg",
        wordpress: "/images/contentverse/wordpress.svg",
        shopify: "/images/contentverse/shopify.svg",
        landing: "/images/contentverse/landing-page.svg",
        amazon: "/images/contentverse/amazon.svg",
        wizard: "/images/contentverse/about-us.svg",
        podcast: "/images/contentverse/podcast.svg",
        voiceover: "/images/contentverse/voiceover.svg",
        carousel: "/images/contentverse/carousel.png",
        video: "/images/contentverse/video.svg",
        default: "/images/contentverse/billing-and-payments.svg",
    };

    // New logic for specific cases
    const socialMediaPlatforms = ["linkedin", "instagram", "tiktok", "youtube", "pinterest", "twitter"];
    const words = promptTitle.toLowerCase().split(" ");

    // Check if the prompt contains "Video to" followed by a social media platform
    if (words.includes("video") && words.includes("to")) {
        const socialPlatform = words.find((word) =>
            socialMediaPlatforms.includes(word)
        );
        if (socialPlatform) {
            return (
                <Image
                    src={iconsMap[socialPlatform] || iconsMap["default"]}
                    alt={promptTitle}
                    height={20}
                    width={20}
                />
            );
        }
    }

    // Existing logic for general matching
    const matchedIconKey =
        words.find((word) =>
            Object.keys(iconsMap).some((key) =>
                word.toLowerCase().includes(key.toLowerCase())
            )
        ) || "default";

    const iconPath =
        iconsMap[matchedIconKey.toLowerCase()] || iconsMap["default"];

    return (
        <Image
            src={iconPath}
            alt={promptTitle}
            height={20}
            width={20}
        />
    );
};

export default PromptsIcons;