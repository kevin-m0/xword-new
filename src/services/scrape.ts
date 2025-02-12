import axios from "axios";

export const scrapeData = (url: string) => {
	return axios.get(
		`https://scrape.abstractapi.com/v1/?api_key=${process.env.NEXT_PUBLIC_ABSTRACT_API_KEY}&url=${url}&block_ads=true`
	);
};
