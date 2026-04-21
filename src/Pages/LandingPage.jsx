import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


 
export default function LandingPage() {
  const navigate = useNavigate();
 const { t } = useTranslation();
  return (
    <div className="landing-container">
      <div className="landing-card">
       
 <h1>{t("landing.welcome")}</h1>
        <p>{t("landing.subtitle")}</p>


        <div className="btns-container">
          <button onClick={() => navigate("/login")} className="btn">
       
             {t("landing.login")}
          </button>

          <button onClick={() => navigate("/signup")} className="btn">
        
             {t("landing.createAccount")}
          </button>
        </div>
      </div>
    </div>
  );
}
