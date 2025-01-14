"use client"; // Marque ce composant comme un composant client

export default function Banner() {
  return (
    <div
      className="w-full bg-cover bg-center flex items-center justify-center text-white relative"
      style={{
        backgroundImage: "url('/images/cleaning.jpg')", // Chemin vers votre image de bannière
        height: "600px", // Hauteur par défaut pour les petits écrans
        backgroundRepeat: "no-repeat", // Empêche la duplication de l'image
        backgroundSize: "cover", // Assure que l'image couvre toute la bannière
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Contenu */}
      <div className="text-center relative z-10">
        <h2 className="text-3xl sm:text-5xl font-bold mb-8">
          Offre Spéciale de Nettoyage !
        </h2>
        <p className="text-lg sm:text-xl mb-8" style={{ textShadow: '2px 2px 8px rgb(14, 11, 156)' }}>
          Obtenez 20% de réduction sur votre premier service de nettoyage.
        </p>
        <a
          href="https://calendly.com/tarikyabou/15min" // Remplacez par votre lien Calendly
          target="_blank" // Ouvre le lien dans un nouvel onglet
          rel="noopener noreferrer" // Recommandé pour la sécurité avec target="_blank"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 mt-12"
        >
          Réservez Maintenant
        </a>
        {/* Numéro de téléphone */}
        <p className="mt-4 text-lg sm:text-xl" style={{ textShadow: '2px 2px 8px rgb(14, 11, 156)' }}>
          Ou appelez-nous au :{" "}
          <a
            href="tel:+14384082316" // Remplacez par votre numéro de téléphone
            className="text-blue-300 hover:text-blue-400 underline"
          >
            +1 (438) 408-2316
          </a>
        </p>
      </div>
    </div>
  );
}