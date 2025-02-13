export const getAwsUrl = (key: string) => {
    if (process.env.NEXT_PUBLIC_AWS_IMAGE_BASE_URL) {
        return process.env.NEXT_PUBLIC_AWS_IMAGE_BASE_URL + key;
    }
}