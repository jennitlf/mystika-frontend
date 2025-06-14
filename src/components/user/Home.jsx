import React, { useState, useEffect } from "react";
import Consultants from "./Consultants";
import "../../css/user/Home.css";
import "../../css/user/HomeSectionFinal.css";
import Filters from "./Filters";
import Page from "./Page";
import { API } from "../../config";
import { useDebounce } from "../../utils/useDebounce";
import { Link } from "react-router-dom";

const Home = () => {
  const [consultants, setConsultants] = useState([]);
  const [totalConsultants, setTotalConsultants] = useState("");
  const [loading, setLoading] = useState(true);
  const [immediateParams, setImmediateParams] = useState({
    name: "",
    specialties: [],
  });
  const [debouncedParams, setDebouncedParams] = useState({
    minValue: null,
    maxValue: null,
  });
  const debouncedFilter = useDebounce(debouncedParams, 500);
  const [queryString, setQueryString] = useState("limit=9");
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const response = await fetch(
          `${API}general-find?page=${page}&${queryString}`
        );
        const data = await response.json();
        setConsultants(data.data);
        setTotalConsultants(data.meta.total);
        setTotalPage(data.meta.lastPage);
        setPage(parseInt(data.meta.page));
      } catch (error) {
        console.error("Erro ao buscar consultores:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultants();
  }, [queryString, page]);

  useEffect(() => {
    const combinedParams = {
      ...immediateParams,
      ...debouncedFilter,
    };

    setQueryString(
      Object.entries(combinedParams)
        .filter(([key, value]) => {
          if (Array.isArray(value)) return value.length > 0;
          return value !== null && value !== undefined && value !== "";
        })
        .flatMap(([key, value]) => {
          if (Array.isArray(value)) {
            return value.map((item) => `${key}=${encodeURIComponent(item)}`);
          }
          return `${key}=${encodeURIComponent(value)}`;
        })
        .join("&")
    );
  }, [immediateParams, debouncedFilter]);

  if (loading) {
    return <p>Carregando consultores...</p>;
  }

  return (
    <div className="main-home">
      <section className="consultants-home section-1-home">
        <h2 id="title-consultant-page">
          Explore os melhores consultores e encontre o guia ideal para sua jornada!
        </h2>
        <div className="consultants-e-filtes">
          <Filters
            setImmediateParams={setImmediateParams}
            setDebouncedParams={setDebouncedParams}
            immediateParams={immediateParams}
            debouncedParams={debouncedParams}
          />
          {totalConsultants > 0 ? (
            <Consultants consultants={consultants} />
          ) : (
            <div className="loading">
              Não há itens correspondentes à consulta
            </div>
          )}
        </div>
        <Page totalPage={totalPage} page={page} setPage={setPage} />
      </section>
    <section className="final-section">
      <div className="consultor-cta">
        <h2 className="consultor-title">Transforme seu dom em uma profissão.</h2>
        <p className="consultor-description">
          Seja um consultor em nossa plataforma e compartilhe seu conhecimento esotérico com quem busca luz e orientação.
        </p>
        <Link to={'/consultor/register'} target="_blank" className="consultor-button">Cadastre-se como Consultor</Link>
        <div className="consultor-icons">
          <span className="icon tarot-icon" aria-label="Tarot"></span>
          <span className="icon numerology-icon" aria-label="Numerologia"></span>
          <span className="icon astrology-icon" aria-label="Astrologia"></span>
        </div>
      </div>

      <div className="newsletter">
        <h3 className="newsletter-title">Receba previsões e promoções</h3>
        <p className="newsletter-description">
          Cadastre seu e-mail para receber conteúdo exclusivo e ficar por dentro de tudo.
        </p>
        <form className="newsletter-form">
          <input type="email" className="newsletter-input" placeholder="Seu melhor e-mail" required />
          <button type="submit" className="newsletter-button">Quero saber mais!</button>
        </form>
        <small className="privacy-text">Prometemos não enviar spam.</small>
      </div>

      <div className="depoimentos">
        <h3 className="depoimentos-title">Depoimentos Inspiradores</h3>
        <blockquote className="depoimento">
          "O tarot me ajudou a tomar decisões importantes. Gratidão ao consultor João Silva!" <br/>
          <span className="depoimento-author">– Ana P.</span>
        </blockquote>
        <blockquote className="depoimento">
          "Consulta maravilhosa, senti a energia transformadora desde o primeiro contato." <br/>
          <span className="depoimento-author">– Carlos M.</span>
        </blockquote>
      </div>

      <nav className="mapa-site">
        <h3 className="mapa-title">Navegação Rápida</h3>
        <ul className="mapa-links">
          <li><a href="/" className="mapa-link">Home</a></li>

          <li><a href="/blog" className="mapa-link">Blog</a></li>
          <li><a href="/ajuda" className="mapa-link">Ajuda e Suporte</a></li>
          <li><a href="/privacidade" className="mapa-link">Política de Privacidade</a></li>
        </ul>
      </nav>

      <div className="elemento-mistico">
        <p className="fase-lua">Hoje, a <strong>Lua Crescente em Touro</strong> favorece novas oportunidades e projetos!</p>
      </div>

      <div className="redes-sociais">
        <h3 className="redes-title">Acompanhe-nos nas redes sociais</h3>
        <div className="social-icons">
          <button className="social-icon instagram" aria-label="Instagram"></button>
          <button  className="social-icon facebook" aria-label="Facebook"></button>
          <button  className="social-icon tiktok" aria-label="TikTok"></button>
          <button  className="social-icon youtube" aria-label="YouTube"></button>
          <button  className="social-icon whatsapp" aria-label="WhatsApp"></button>
          <button  className="social-icon telegram" aria-label="Telegram"></button>
        </div>
      </div>

      <footer className="final-footer">
        <p className="footer-text">Conectando almas e iluminando caminhos desde 2025.</p>
      </footer>
  </section>

    </div>
    
  );
};

export default Home;

