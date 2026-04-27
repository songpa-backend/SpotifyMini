import Link from "next/link";

export default function Header() {
    return (
        <>
            <h1 style={{color:'white', background: 'black', textAlign: 'center'}}><Link href={"/"}>🎧SpotifyMini</Link></h1>
        </>
    )
}