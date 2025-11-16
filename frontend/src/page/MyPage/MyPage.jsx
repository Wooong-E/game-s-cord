import styles from "./MyPage.module.css"
import Sidebar from "./Sidebar"
import user2 from "../../assets/user2.png"


function MyPage(){

    return(
        <div className={styles.wrapper}>
            <Sidebar/>
            <div className={styles.section}>
                <h1>마이페이지</h1>
                <div style={{display: "flex", marginLeft:"80px"}}>
                    <div style={{margin: "0px 50px", display:"flex", flexDirection:"column"}}>
                        <div className={styles.imgbox}>
                            <img src={user2} style={{width:"200px"}}></img>
                        </div>
                        <div className={styles.modify}>프로필 수정하기</div>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", marginLeft: "100px"}}>

                        <div className={styles.title}>닉네임</div>
                        <div className={styles.data} style={{marginBottom:"50px"}}>User 2</div>

                        <div className={styles.title}>성별</div>
                        <div className={styles.data} style={{marginBottom:"50px"}}>여성</div>

                        <div className={styles.title}>생년월일</div>
                        <div className={styles.data} style={{marginBottom:"50px"}}>2004 . 06 . 13</div>

                        <div className={styles.title}>자기소개</div>
                        <div className={styles.data}>자기소개 입니다.</div>

                    </div>
                </div>
            </div>
        </div>
    )
} 
export default MyPage