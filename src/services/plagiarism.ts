import axios from "axios";

export const detectPlagiarism = (content: string) => {
	return axios.post(
		"https://api.edenai.run/v2/text/plagia_detection",
		{
			response_as_dict: false,
			attributes_as_list: false,
			show_original_response: false,
			providers: "originalityai,winstonai",
			text: content,
		},
		{
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_EDENAI_TEST_TOKEN}`,
			},
		}
	);
};
