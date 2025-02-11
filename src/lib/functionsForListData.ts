// FUNCTION FOR THE LIST DATA

export function findListType(htmlString: string) {
  const match = htmlString.match(/^<([ou]l)\b/i);
  return match ? match[1] : "ul";
}

export function findListElements(htmlString: string) {
  const regex = /<li\b[^>]*>.*?<\/li>/gi;
  return htmlString.match(regex) || [];
}
export function removeLi_tag(htmlString: string) {
  return htmlString.replace(/<li\b[^>]*>(.*?)<\/li>/gi, "$1");
}
