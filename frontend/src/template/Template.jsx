import Header from "./Header.jsx"
import Footer from "./Footer.jsx"
import styles from "./Template.module.css"

const Template = ({ children }) => {
    return (
        <>
            <div className={styles.wrapper}>
                <main>
                    <Header/>
                    {children}
                    <Footer/>
                </main>
            </div>
        </>
    )
}

export default Template