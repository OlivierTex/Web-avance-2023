const Footer = () => {
  return (
    <div className={`bg-light dark:bg-dark`}>
      <footer className="footer">
        <p className="text-custom5">© 2023 - Nom du site</p>
        <div className="flex justify-center my-4">
          <a href="https://www.facebook.com/" className="ta">Facebook</a>
          <a href="https://twitter.com/" className="ta">Twitter</a>
          <a href="https://www.instagram.com/" className="ta">Instagram</a>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
