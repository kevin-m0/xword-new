import { 
  FaMicrophone, FaShareAlt, FaFileAlt, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaYoutube, 
  FaPinterest, FaLinkedin, FaGoogle, FaWordpress, FaAd 
} from 'react-icons/fa';
import { MdEmail, MdFeedback, MdOutlineQuestionAnswer, MdOutlineDescription } from 'react-icons/md';
import { SiTiktok } from 'react-icons/si';

const contentGenIcons: { [key: string]: (props: any) => JSX.Element } = {
  'Promote Podcast Episode': (props) => <FaMicrophone {...props} />,
  'Social Media Carousel': (props) => <FaShareAlt {...props} />,
  'Blog Post': (props) => <FaFileAlt {...props} />,
  'Custom Newsletter': (props) => <MdEmail {...props} />,
  'Lead Magnet': (props) => <FaEnvelope {...props} />,
  'Conversation Starters for Facebook Group': (props) => <FaFacebook {...props} />,
  'Maxims': (props) => <FaFileAlt {...props} />,
  'Session Worksheet': (props) => <FaFileAlt {...props} />,
  'Podcast Analogy': (props) => <FaMicrophone {...props} />,
  'Custom Podcast Title': (props) => <FaMicrophone {...props} />,
  'Host Read Intro': (props) => <FaMicrophone {...props} />,
  'Alternative Voiceover Script': (props) => <FaMicrophone {...props} />,
  'Podcast Conversation Feedback': (props) => <MdFeedback {...props} />,
  'Key Themes': (props) => <FaFileAlt {...props} />,
  'Guest Thank You Email': (props) => <MdEmail {...props} />,
  'LinkedIn Post Creation': (props) => <FaLinkedin {...props} />,
  'Instagram Post Creation': (props) => <FaInstagram {...props} />,
  'Tiktok Post Creation': (props) => <SiTiktok {...props} />,
  'Twitter Post Creation': (props) => <FaTwitter {...props} />,
  'Youtube Post Creation': (props) => <FaYoutube {...props} />,
  'Wordpress Post Creation': (props) => <FaWordpress {...props} />,
  'Newsletter Post Creation': (props) => <MdEmail {...props} />,
  'Pinterest Post Creation': (props) => <FaPinterest {...props} />,
  'Email Newsletter': (props) => <MdEmail {...props} />,
  'Infographics Visual Content': (props) => <FaFileAlt {...props} />,
  'Facebook Ads': (props) => <FaFacebook {...props} />,
  'LinkedIn Posts': (props) => <FaLinkedin {...props} />,
  'Tweeting Idea Prompts': (props) => <FaTwitter {...props} />,
  'Twitter Threads': (props) => <FaTwitter {...props} />,
  'Landing Page': (props) => <FaFileAlt {...props} />,
  'FAQ Creation': (props) => <MdOutlineQuestionAnswer {...props} />,
  'Instagram Reel Creation': (props) => <FaInstagram {...props} />,
  'Tiktok Script Creation': (props) => <SiTiktok {...props} />,
  'Youtube Script Creation': (props) => <FaYoutube {...props} />,
  'Google Ads': (props) => <FaGoogle {...props} />,
  'WordPress Blog Post': (props) => <FaWordpress {...props} />,
  'Product Description': (props) => <MdOutlineDescription {...props} />,
  'Sales Email': (props) => <MdEmail {...props} />,
  'Customer Service Email': (props) => <MdEmail {...props} />,
  'Pinterest Ad': (props) => <FaPinterest {...props} />,
  'M0 Wizard': (props) => <FaAd {...props} /> ,
  'LinkedIn Ad' : (props) => <FaLinkedin {...props} />,
  'Facebook Ad' : (props) => <FaFacebook {...props} />,
  'Instagram Ad' : (props) => <FaInstagram {...props} />, 
  'Tiktok Ad' : (props) => <SiTiktok {...props} />,
  'YouTube Ad' : (props) => <FaYoutube {...props} />,

};

export default contentGenIcons;
