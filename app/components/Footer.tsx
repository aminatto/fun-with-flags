import { HeartIcon } from "@heroicons/react/24/solid";

const Footer = () => {
    return (
        <header className="py-6 mt-8">
            <p className="flex  justify-center items-center">
                Made with <HeartIcon className="size-4 mx-1"/> by Amanda Minato
            </p>
        </header>
    );
}

export default Footer;