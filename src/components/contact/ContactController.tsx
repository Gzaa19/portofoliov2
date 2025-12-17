import { ContactView } from "@/components/contact/ContactView";
import { getSocialLinks } from "@/data";

export default async function ContactController() {
    const socialLinks = await getSocialLinks();

    return (
        <ContactView
            socialLinks={socialLinks}
        />
    );
}
