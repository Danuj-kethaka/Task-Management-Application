import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Less Taxi Task Manager",
    description: "Task management system",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}