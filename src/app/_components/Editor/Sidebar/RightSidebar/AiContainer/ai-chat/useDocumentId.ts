import { usePathname } from "next/navigation";
export const useDocumentId = () => {
    const pathName = usePathname();
    const documentId = pathName.split("/")[pathName.split("/").length - 1];
    return documentId;
};
