import { AiFillGithub } from "react-icons/ai";

import "./Footer.css";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer className="footer-container">
      
      <div className="empty-div footer-item"></div>

      <section className="git-links footer-item">
        <article>
          <Link
            to="https://github.com/pablovqueiroz"
            target="_blank"
            className="footer-link"
          >
            <AiFillGithub className="git-icon" />
            <p>Pablo Queiroz</p>
          </Link>
        </article>

        <article>
          <Link
            to="https://github.com/pablovqueiroz/rot-frontend"
            target="_blank"
            className="footer-link"
          >
            <AiFillGithub className="git-icon" />
            <p>Backend Repo</p>
          </Link>
        </article>

        <article>
          <Link
            to="https://github.com/pablovqueiroz/rot-backend"
            target="_blank"
            className="footer-link"
          >
            <AiFillGithub className="git-icon" />
            <p>Frontend Repo</p>
          </Link>
        </article>
      </section>
      <section className="copy-right footer-item">
        <p >© {new Date().getFullYear()} All rights reserved.</p>
      </section>
    </footer>
  );
}
export default Footer;
