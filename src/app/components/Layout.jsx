import Header from "./Header";

//이 페이지가 모든 페이지의 공통
export default function Layout( {children} ){
    return (
        <>
            <Header/>
            {children}
        </>
    )
}