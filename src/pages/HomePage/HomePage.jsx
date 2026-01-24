import "./HomePage.css";
import Hero from "../../components/Dashboard/Hero";
import ProvidersList from "../client/ProvidersList/ProvidersList";
import SearchHeader from "../../components/SearchHeader/SearchHeader ";

function HomePage() {
  return (
    <div className="home-content">
      <Hero />
      <SearchHeader />
      <ProvidersList />
    </div>
  );
}

export default HomePage;
