import React from "react";
import { Link } from "react-router-dom";
import "../styles/style_nav.css";

function Navigation({ children }) {
  return (
    <>
      <div className="flex-row-ea">
        <Link to="/category/Cats" className="shop-cats">Shop for cats</Link>
        <Link to="/category/Dogs" className="shop-dogs">Shop for Dogs</Link>
        <Link to="/category/Brands" className="shop-brands">Shop by Brands</Link>
        <Link to="/category/Sale" className="sale">Sale</Link>
        <Link to="/category/Pharmacy" className="pharmacy">Pharmacy</Link>
        <Link to="/category/Adopt" className="adopt">Adopt</Link>
        <Link to="/category/PetParents" className="pet-parents">Pet Parents</Link>
        <Link to="/category/Blog" className="blog">Blog</Link>
      </div>
      <main>
        {children}
      </main>
    </>
  );
}

export default Navigation;
