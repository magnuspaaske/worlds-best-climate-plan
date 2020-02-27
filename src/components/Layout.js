import React from 'react';
import Helmet from 'react-helmet';
import Menu from './Menu';
import Footer from './Footer';
import ModalFormProvider from './Form/Modal';

const Layout = ({ children, transparentMenu = false }) => (
  <ModalFormProvider>
    <Helmet>
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="/favicon-96x96.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
    </Helmet>
    <Menu transparent={transparentMenu} />
    {children}
    <Footer />
    <script
      key="cookie-bar"
      type="text/javascript"
      src="https://cdn.jsdelivr.net/npm/cookie-bar/cookiebar-latest.min.js?tracking=1&thirdparty=1&always=1&scrolling=1"
    ></script>
  </ModalFormProvider>
);

export default Layout;
