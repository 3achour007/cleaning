"use client"; // Marque ce composant comme un composant client

import { useEffect, useState } from "react";
import Banner from "./../../compononts/frBanner"; // Importe le composant Banner
import Link from 'next/link';

export default function Home() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // État pour gérer la visibilité du menu
  const [userCity, setUserCity] = useState<string>("Montréal"); // Ville par défaut

  useEffect(() => {
    // Définit l'année en cours uniquement côté client
    setCurrentYear(new Date().getFullYear());

    // Détecte la ville de l'utilisateur en fonction de son adresse IP
    detectUserCity();
  }, []);

  const detectUserCity = async () => {
    try {
      // Utilise IP-API pour obtenir la ville de l'utilisateur en fonction de son adresse IP
      const response = await fetch("http://ip-api.com/json/?fields=city");
      const data = await response.json();
      if (data.city) {
        setUserCity(data.city);
      }
    } catch (error) {
      console.error("Erreur lors de la détection de la ville :", error);
      // Retour à la ville par défaut en cas d'erreur
      setUserCity("Montréal");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gray-50 text-gray-900">
      {/* En-tête */}
      <header className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center py-4 px-4 sm:px-0">
        {/* Titre et Bouton du Menu Hamburger (Mobile uniquement) */}
        <div className="w-full sm:w-auto flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold cursor-pointer">Eco Friendly Cleaning</h1>
          </Link>

          {/* Bouton du Menu Hamburger (Mobile uniquement) */}
          <button
            className="sm:hidden p-2 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>

        {/* Menu de Navigation */}
        <nav
          className={`${isMenuOpen ? "block" : "hidden"} sm:block w-full sm:w-auto mt-4 sm:mt-0`}
        >
          <ul className="flex flex-col sm:flex-row sm:space-x-4">
            <li>
              <a
                href="/"
                className="block py-2 sm:py-0 hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </a>
            </li>
            <li>
              <a
                href="#services"
                className="block py-2 sm:py-0 hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="block py-2 sm:py-0 hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                À Propos
              </a>
            </li>
            <li>
              <a
                href="#guarantees"
                className="block py-2 sm:py-0 hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Nos Garanties
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="block py-2 sm:py-0 hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
            </li>
            {/* Language Switcher */}
            <li className="flex items-center">
              <a
                href="/" // Link to the English version
                className="block py-2 sm:py-0 hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                English
              </a>
              <span className="mx-2 text-gray-400">|</span>
              <a
                href="/fr" // Link to the French version
                className="block py-2 sm:py-0 hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Français
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Bannière */}
      <Banner />

      {/* Contenu Principal */}
      <main className="flex-1 w-full text-center">
        {/* Section Hero */}
        <section className="py-16 max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4">
            Services de Nettoyage Écologiques à {userCity}
          </h1>
          <p className="text-lg mb-8">
            Des services de nettoyage professionnels et abordables adaptés à votre domicile ou bureau à {userCity}. Nous employons exclusivement des produits de nettoyage biosourcés afin de préserver un environnement plus sain.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="#services"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
            >
              Voir Nos Services
            </a>
            <a
              href="/contact"
              className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg shadow hover:bg-gray-300"
            >
              Nous Contacter
            </a>
          </div>
        </section>

        {/* Section Services */}
        <section id="services" className="py-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">
            Nos Services de Nettoyage à {userCity}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Nettoyage de Bureau */}
            <div className="p-6 bg-white rounded-lg shadow text-center">
              <h3 className="text-xl font-semibold mb-2">
                Nettoyage de Bureau à {userCity}
              </h3>
              <p>
                Gardez votre espace de travail propre, organisé et professionnel avec nos services de nettoyage de bureau experts.
              </p>
            </div>

            {/* Nettoyage de Garage */}
            <div className="p-6 bg-white rounded-lg shadow text-center">
              <h3 className="text-xl font-semibold mb-2">
                Nettoyage de Garage à {userCity}
              </h3>
              <p>
                Transformez votre garage en un espace propre et fonctionnel avec nos solutions de nettoyage de garage approfondies.
              </p>
            </div>

            {/* Nettoyage des Espaces Communs */}
            <div className="p-6 bg-white rounded-lg shadow text-center">
              <h3 className="text-xl font-semibold mb-2">
                Nettoyage des Espaces Communs à {userCity}
              </h3>
              <p>
                Assurez-vous que les espaces partagés comme les halls, les couloirs et les escaliers sont impeccables et accueillants.
              </p>
            </div>

            {/* Nettoyage Résidentiel */}
            <div className="p-6 bg-white rounded-lg shadow text-center">
              <h3 className="text-xl font-semibold mb-2">
                Nettoyage Résidentiel à {userCity}
              </h3>
              <p>
                Profitez d'un domicile propre et confortable avec nos services de nettoyage résidentiel sur mesure.
              </p>
            </div>
          </div>
        </section>

        {/* Section À Propos */}
        <section
          id="about"
          className="py-24 w-[100%] mx-auto bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/nature.jpg')", // Chemin vers votre image de fond
          }}
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">
              À Propos de Nos Services de Nettoyage Écologiques
            </h2>
            <div className="text-lg sm:text-xl text-gray-700 space-y-8 text-left mx-auto w-full sm:w-3/4 lg:w-1/2 px-4 sm:px-0">
              <p>
                Nous sommes plus qu'une entreprise de nettoyage chez <strong className="text-blue-600">Eco Friendly Cleaning</strong>, nous sommes vos partenaires pour améliorer la propreté, la santé et la durabilité de l'environnement. Grâce à notre expérience de plusieurs années dans le domaine, nous avons développé une réputation en offrant des <strong>solutions de nettoyage de qualité supérieure</strong> qui répondent aux besoins spécifiques des foyers et des entreprises.
              </p>
              <p>
                Notre point de distinction réside dans notre dévouement à l'utilisation de produits de nettoyage entièrement biosourcés. À la différence des produits chimiques classiques, nos solutions respectueuses de l'environnement sont provenant d'ingrédients naturels qui garantissent la sécurité de votre famille, de vos animaux de compagnie et de la planète. Il est essentiel de sélectionner des produits biologiques :
              </p>
              <ul className="list-disc list-inside space-y-4 pl-6">
                <li>
                  <strong>Sécurité pour votre bien-être :</strong> Nos produits biologiques ne contiennent aucun produit chimique agressif, toxine ou allergène, assurant ainsi un environnement sécurisé et sain pour tous.
                </li>
                <li>
                  <strong>Environnementales :</strong> En employant des composants biodégradables et durables, nous diminuons notre impact sur l'environnement et participons à un avenir plus respectueux de l'environnement.
                </li>
                <li>
                  <strong>La performance de nettoyage est :</strong> N'abandonnez pas le terme "naturel" - nos produits biologiques sont extrêmement efficaces pour éliminer la saleté, la crasse et les taches, rendant votre espace impeccable.
                </li>
                <li>
                  <strong>Très doux sur les surfaces :</strong> Nos articles sont élaborés pour effectuer un nettoyage approfondi sans causer de dommages à vos meubles, sols ou appareils.
                </li>
              </ul>
              <p>
                Que vous souhaitiez effectuer un nettoyage en profondeur occasionnel ou effectuer un entretien régulier, notre équipe de <strong>professionnels qualifiés</strong> est disponible pour vous offrir un service exceptionnel avec une touche personnelle. Notre attention aux détails, notre fiabilité et notre dévouement à la satisfaction des clients nous font être fiers.
              </p>
              <p>
                Venez nous rejoindre afin de contribuer positivement à l'environnement tout en bénéficiant d'un environnement plus propre et plus sain. <strong className="text-blue-600">Sélectionnez le service de nettoyage écologique</strong> - où la propreté se marie avec la durabilité.
              </p>
            </div>
          </div>
        </section>

        {/* Section Garanties */}
        <section id="guarantees" className="py-16 bg-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Pourquoi Choisir Eeco Friendly Cleaning à {userCity} ?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Expérience */}
              <div className="p-6 bg-white rounded-lg shadow text-center">
                <img
                  src="/images/expertise.jpg" // Chemin vers votre image
                  alt="Expertise éprouvée en services de nettoyage"
                  className="w-full h-48 object-cover mb-4 sm:w-48 sm:h-32"
                />
                <h3 className="text-xl font-semibold mb-2">
                  Expertise Éprouvée
                </h3>
                <p>
                  Avec près d'une décennie d'expérience, nous avons maîtrisé l'art de fournir des services de nettoyage exceptionnels adaptés à vos besoins.
                </p>
              </div>

              {/* Qualité de Service */}
              <div className="p-6 bg-white rounded-lg shadow text-center">
                <img
                  src="/images/quality.png" // Chemin vers votre image
                  alt="Qualité inégalée en services de nettoyage"
                  className="w-full h-48 object-cover mb-4 sm:w-48 sm:h-32"
                />
                <h3 className="text-xl font-semibold mb-2">
                  Qualité Inégalée
                </h3>
                <p>
                Notre fierté réside dans notre capacité à proposer des services de nettoyage de qualité supérieure qui surpassent les attentes, assurant ainsi que votre espace reste impeccable à tout moment.

                </p>
              </div>

              {/* Professionnalisme */}
              <div className="p-6 bg-white rounded-lg shadow text-center">
                <img
                  src="/images/customer.jpeg" // Chemin vers votre image
                  alt="Approche centrée sur le client en services de nettoyage"
                  className="w-full h-48 object-cover mb-4 sm:w-48 sm:h-32"
                />
                <h3 className="text-xl font-semibold mb-2">
                  Approche Centrée sur le Client
                </h3>
                <p>
                  Votre satisfaction est notre priorité. Nous écoutons attentivement vos besoins et fournissons des solutions personnalisées qui vous conviennent.
                </p>
              </div>

              {/* Polyvalence */}
              <div className="p-6 bg-white rounded-lg shadow text-center">
                <img
                  src="/images/Deep-Cleaning.jpg" // Chemin vers votre image
                  alt="Solutions de nettoyage complètes"
                  className="w-full h-48 object-cover mb-4 sm:w-48 sm:h-32"
                />
                <h3 className="text-xl font-semibold mb-2">
                  Solutions Complètes
                </h3>
                <p>
                De la maison aux bureaux et plus encore, nous proposons une variété de services de nettoyage pour satisfaire toutes les exigences.

                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Contact */}
        <section id="contact" className="py-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">
            Contactez-nous pour un Nettoyage Écologique à {userCity}
          </h2>
          <p className="mb-4">
            Pour des questions ou pour réserver nos services, veuillez nous appeler ou nous envoyer un email.
          </p>
          <p>
            <strong>Téléphone :</strong> +1 (123) 456-7890
          </p>
          <p>
            <strong>Email :</strong> info@ecofriendlyclean.ca
          </p>
        </section>
        <section className="w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2794.391986840822!2d-73.5694836844385!3d45.50170297910173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91a6a5b5b5b5b%3A0x5b5b5b5b5b5b5b5b!2s4745%20Rue%20Sainte-Catherine%20E%2C%20Montreal%2C%20QC%20H1V%201Z3!5e0!3m2!1sen!2sca!4v1633020000000!5m2!1sen!2sca"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </section>
      </main>

      {/* Pied de Page */}
      <footer className="w-full py-12 bg-gray-800 text-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Adresse */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Notre Adresse</h4>
              <p className="text-gray-300">
                4745 Rue Sainte-Catherine E<br />
                {userCity}, H1V 1Z3<br />
                Québec
              </p>
            </div>

            {/* Horaires */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Heures d'Ouverture</h4>
              <p className="text-gray-300">
                Lundi - Vendredi : 8h00 - 18h00<br />
                Samedi : 9h00 - 16h00<br />
                Dimanche : Fermé
              </p>
            </div>

            {/* Informations de Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contactez-nous</h4>
              <p className="text-gray-300">
                Téléphone : +1 (438) 408-2316<br />
                Email : info@ecofriendlyclean.ca<br />
              </p>
            </div>

            {/* Liens Rapides */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Liens Rapides</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#services" className="text-gray-300 hover:text-blue-400">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-300 hover:text-blue-400">
                    À Propos
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-300 hover:text-blue-400">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#guarantees" className="text-gray-300 hover:text-blue-400">
                    Nos Garanties
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Diviseur */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              &copy; {new Date().getFullYear()} Eco Friendly Cleaning. Tous droits réservés.
            </p>
            <p className="text-gray-300 mt-2">
              Conçu avec ❤️ par Eco Friendly Cleaning
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}