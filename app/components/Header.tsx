import Link from "next/link";

const Header = () => {
    return (
        <header className="py-6 mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold">Fun with Flags</h1>
            <nav className="flex gap-4 mt-3 md:mt-0 text-sm">
                <Link className="hover:underline" href="/">
                    🌎 Countries
                </Link>
                <Link className="hover:underline" href="/quiz">
                    🎮 Flag Quiz
                </Link>
            </nav>
        </header>
    );
}

export default Header;