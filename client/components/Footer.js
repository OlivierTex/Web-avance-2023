const Footer = () => {
  return (
    <div className={`bg-light dark:bg-dark`}>
      <footer className="footer">
        <div className="w-full border-b-2 border-black"></div>

        <p className="flex justify-center my-4 dark:text-white">
          © 2023 - ImageHive{" "}
        </p>
        <p className="flex justify-center my-4 dark:text-white">
          {" "}
          Get your pixels
        </p>
        <div className="flex justify-center my-4">
          <a href="https://www.facebook.com/" className="footer-link">
            Facebook
          </a>
          <a href="https://twitter.com/" className="footer-link">
            Twitter
          </a>
          <a href="https://www.instagram.com/" className="footer-link">
            Instagram
          </a>
        </div>
        <br></br>
      </footer>
    </div>
  );
};

export default Footer;
