//User
import ListUser from "./Pages/Settings/User/ListUser";
import AjouterUser from "./Pages/Settings/User/AjouterUser";

//Type
import AjouterType from "./Pages/Settings/Type/AjouterType";
import ListType from "./Pages/Settings/Type/ListType";

//Role
import ListRole from "./Pages/Settings/Role/ListRole";
import AjouterRole from "./Pages/Settings/Role/AjouterRole";

//Annee
import AjouterAnnee from "./Pages/Settings/Annee/AjouterAnnee";
import ListAnnee from "./Pages/Settings/Annee/ListAnnee";

//Groupe
import AjouterGroupe from "./Pages/Settings/Groupe/AjouterGroupe";
import ListGroupe from "./Pages/Settings/Groupe/ListGroupe";

//Settings
import Settings from "./Pages/Settings";
import Profile from "./Pages/Profile";
import NotFound from "./Pages/NotFound";
import VisualisationBi from "./Pages/VisualisationBi";

//RootBase
import ListRootBase from "./Pages/Settings/RootBase/ListRootBase";
import AjouterRootBase from "./Pages/Settings/RootBase/AjouterRootBase";

//Sujet
import ListSujet from "./Pages/Settings/Sujet/ListSujet";
import AjouterSujet from "./Pages/Settings/Sujet/AjouterSujet";

//Arborecence
import ListArborecence from "./Pages/Settings/Arborecence/ListArborecence";
import AjouterArborecence from "./Pages/Settings/Arborecence/AjouterArborecence";

//Tache
import AjouterTache from "./Pages/Admin/Tache/AjouterTache";
import ListTache from "./Pages/Admin/Tache/ListTache";

//Tache
import Visualiser from "./Pages/Admin/SousTache/Visualiser";
import Partager from "./Pages/Admin/SousTache/Partager";

//Budget
import DetailBudget from "./Pages/Admin/Budget/DetailBudget";
import ResponsableBudget from "./Pages/Admin/Budget/ResponsableBudget";
import ExportExcel from "./Pages/Admin/Budget/ExportExcel";
import SuiviBudget from "./Pages/Admin/Budget/SuiviBudget";
import UserBudget from "./Pages/Admin/Budget/UserBudget";
import SuiviResponsble from "./Pages/Admin/Budget/VerificationBudget/SuiviResponsble";
import VerifierBudget from "./Pages/Admin/Budget/VerificationBudget/VerifierBudget";
import RedigerBudget from "./Pages/Admin/Budget/VerificationBudget/RedigerBudget";

//P&L
import CreationSell from "./Pages/Admin/P&L/CreationSell";
import ListSell from "./Pages/Admin/P&L/ListSell";
import Visualisation from "./Pages/Admin/P&L/Visualisation/Visualisation";
import DetailGroupe from "./Pages/Admin/P&L/Visualisation/DetailGroupe";
import DetailThemeVis from "./Pages/Admin/P&L/Visualisation/DetailThemeVis";
import DetailThemeVisS from "./Pages/Admin/P&L/Visualisation/DetailThemeVisS";
import GrossSells from "./Pages/Admin/P&L/Visualisation/GrossSells";
import Forecast from "./Pages/Admin/P&L/Forecast/Forecast";
import ListForecast from "./Pages/Admin/P&L/Forecast/ListForecast";
import DetailSell from "./Pages/Admin/P&L/Visualisation/DetailSell";
import DetailThemePL from "./Pages/Admin/P&L/Visualisation/DetailThemePL";
import DetailThemeGroupe from "./Pages/Admin/P&L/Visualisation/DetailThemeGroupe";
//theme
import ExcelTheme from "./Pages/Admin/Theme/ExcelTheme";
import DetailTheme from "./Pages/Admin/Theme/DetailTheme";

//Produit
import ListProduit from "./Pages/Settings/Produit/ListProduit";
import AjouterProduit from "./Pages/Settings/Produit/AjouterProduit";

//LigneIms
import AjouterLigneIms from "./Pages/Settings/LigneIms/AjouterLigneIms";
import ListLigneIms from "./Pages/Settings/LigneIms/ListLigneIms";

//MarcheIms
import ListMarcheIms from "./Pages/Settings/MarcheIms/ListMarcheIms";
import AjouterMarcheIms from "./Pages/Settings/MarcheIms/AjouterMarcheIms";

//MarcheIms
import ListCategorie from "./Pages/Settings/Categorie/ListCategorie";
import AjouterCategorie from "./Pages/Settings/Categorie/AjouterCategorie";

//MarcheIms
import ListPays from "./Pages/Settings/Pays/ListPays";
import AjouterPays from "./Pages/Settings/Pays/AjouterPays";

const Components = {
  ListUser,
  AjouterUser,
  ListRole,
  AjouterRole,
  Settings,
  ListRootBase,
  AjouterRootBase,
  ListSujet,
  AjouterSujet,
  ListArborecence,
  AjouterArborecence,
  Profile,
  NotFound,
  AjouterTache,
  ListTache,
  Visualiser,
  Partager,
  /* ListeBudget, */
  DetailBudget,
  ResponsableBudget,
  ExportExcel,
  ListType,
  AjouterType,
  ExcelTheme,
  DetailTheme,
  SuiviBudget,
  UserBudget,
  SuiviResponsble,
  VerifierBudget,
  RedigerBudget,
  AjouterAnnee,
  ListAnnee,
  AjouterLigneIms,
  ListLigneIms,
  ListProduit,
  AjouterProduit,
  ListMarcheIms,
  AjouterMarcheIms,
  ListCategorie,
  AjouterCategorie,
  CreationSell,
  AjouterPays,
  ListPays,
  ListSell,
  Forecast,
  Visualisation,
  DetailGroupe,
  ListForecast,
  GrossSells,
  DetailSell,
  DetailThemeVis,
  DetailThemePL,
  AjouterGroupe,
  ListGroupe,
  DetailThemeVisS,
  DetailThemeGroupe,
  VisualisationBi
};
export default Components;
