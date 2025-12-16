import ContactController from "@/components/contact/ContactController";

export const revalidate = 3600;

export default function Contact() {
    return <ContactController />;
}