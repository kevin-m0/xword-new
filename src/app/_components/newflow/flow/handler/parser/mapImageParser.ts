export const mapImageParser = (images: string[], content: string) => {
    let imageIndex = 0;

    return content.replace(/<<<IMAGE>>>/g, () => {
        if (imageIndex < images.length) {
            return `<<<${images[imageIndex++]}>>>`;
        }
        return ''; // Replace with an empty string if no images are left
    });
};
