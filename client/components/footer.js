const Footer = () => {
  return (
    <div className={`bg-light dark:bg-dark`}>
      <footer className="footer">
        <p className="flex justify-center my-4">© 2023 - Nom du site</p>
        <div className="flex justify-center my-4">
          <a href="https://www.facebook.com/" className="footer-link">Facebook</a>
          <a href="https://twitter.com/" className="footer-link">Twitter</a>
          <a href="https://www.instagram.com/" className="footer-link">Instagram</a>
        </div>
        <br></br>
      </footer>
    </div>
  );
};

export default Footer;
