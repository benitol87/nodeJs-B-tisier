-- phpMyAdmin SQL Dump
-- version 4.2.6deb1
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Sam 24 Janvier 2015 à 10:09
-- Version du serveur :  5.5.41-0ubuntu0.14.10.1-log
-- Version de PHP :  5.5.12-2ubuntu4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `betisier`
--

-- --------------------------------------------------------

--
-- Structure de la table `citation`
--

CREATE TABLE IF NOT EXISTS `citation` (
`cit_num` int(11) NOT NULL,
  `per_num` int(11) NOT NULL,
  `per_num_valide` int(11) DEFAULT NULL,
  `per_num_etu` int(11) NOT NULL,
  `cit_libelle` tinytext NOT NULL,
  `cit_date` date NOT NULL,
  `cit_valide` bit(1) NOT NULL DEFAULT b'0',
  `cit_date_valide` date DEFAULT NULL,
  `cit_date_depo` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=56 ;

--
-- Contenu de la table `citation`
--

INSERT INTO `citation` (`cit_num`, `per_num`, `per_num_valide`, `per_num_etu`, `cit_libelle`, `cit_date`, `cit_valide`, `cit_date_valide`, `cit_date_depo`) VALUES
(1, 55, 1, 53, 'Tous les 4, vous commencez à me casser les --- !!!', '2014-12-25', b'1', '2014-12-25', '2014-12-24 23:00:00'),
(2, 38, 53, 38, 'Les notes, c''est comme l''eau : plus on pompe, plus ça monte', '2014-12-25', b'1', '2014-12-25', '2014-12-24 23:00:00'),
(3, 56, 1, 54, 'C plus fort que toi', '2014-12-25', b'1', '2014-12-25', '2014-12-24 23:00:00'),
(4, 38, 53, 38, 'Ce qui fait marcher l''informatique, c''est la fumée car lorsque la fumée sort du pc, plus rien ne fonctionne', '2014-12-25', b'1', '2014-12-25', '2014-12-24 23:00:00'),
(19, 55, NULL, 3, 'Et surtout notez bien ce que je viens d''effacer !', '2014-12-25', b'0', NULL, '2014-12-24 23:00:00'),
(54, 1, 3, 3, 'Vous avez des prétentions d''un cheval de course et les résultats d''un âne.', '2015-01-15', b'0', '2015-01-14', '2015-01-12 20:58:01'),
(55, 1, NULL, 3, 'Je vous suggère d''arrêter l''informatique. Inscrivez-vous en DUT GEA ou TC', '2015-01-24', b'0', NULL, '2015-01-13 05:27:51');

-- --------------------------------------------------------

--
-- Structure de la table `departement`
--

CREATE TABLE IF NOT EXISTS `departement` (
`dep_num` int(11) NOT NULL,
  `dep_nom` varchar(30) NOT NULL,
  `vil_num` int(11) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Contenu de la table `departement`
--

INSERT INTO `departement` (`dep_num`, `dep_nom`, `vil_num`) VALUES
(1, 'Informatique', 7),
(2, 'GEA', 6),
(3, 'GEA', 7),
(4, 'SRC', 7),
(5, 'HSE', 5),
(6, 'Génie civil', 16);

-- --------------------------------------------------------

--
-- Structure de la table `division`
--

CREATE TABLE IF NOT EXISTS `division` (
`div_num` int(11) NOT NULL,
  `div_nom` varchar(30) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Contenu de la table `division`
--

INSERT INTO `division` (`div_num`, `div_nom`) VALUES
(1, 'Année 1'),
(2, 'Année 2'),
(3, 'Année Spéciale'),
(4, 'Licence Professionnelle');

-- --------------------------------------------------------

--
-- Structure de la table `etudiant`
--

CREATE TABLE IF NOT EXISTS `etudiant` (
  `per_num` int(11) NOT NULL,
  `dep_num` int(11) NOT NULL,
  `div_num` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `etudiant`
--

INSERT INTO `etudiant` (`per_num`, `dep_num`, `div_num`) VALUES
(3, 2, 2),
(38, 6, 1),
(39, 4, 4),
(53, 1, 1),
(54, 3, 2),
(58, 1, 2),
(59, 2, 2),
(64, 2, 1);

-- --------------------------------------------------------

--
-- Structure de la table `fonction`
--

CREATE TABLE IF NOT EXISTS `fonction` (
`fon_num` int(11) NOT NULL,
  `fon_libelle` varchar(30) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=9 ;

--
-- Contenu de la table `fonction`
--

INSERT INTO `fonction` (`fon_num`, `fon_libelle`) VALUES
(1, 'Directeur'),
(2, 'Chef de département'),
(3, 'Technicien'),
(4, 'Secrètaire'),
(5, 'Ingénieur'),
(6, 'Imprimeur'),
(7, 'Enseignant'),
(8, 'Chercheur');

-- --------------------------------------------------------

--
-- Structure de la table `mot`
--

CREATE TABLE IF NOT EXISTS `mot` (
`mot_id` int(11) NOT NULL,
  `mot_interdit` text NOT NULL
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Contenu de la table `mot`
--

INSERT INTO `mot` (`mot_id`, `mot_interdit`) VALUES
(1, 'sexe'),
(2, 'merde'),
(3, 'toutou'),
(4, 'gestion'),
(5, 'mathématique');

-- --------------------------------------------------------

--
-- Structure de la table `personne`
--

CREATE TABLE IF NOT EXISTS `personne` (
`per_num` int(11) NOT NULL,
  `per_nom` varchar(30) NOT NULL,
  `per_prenom` varchar(30) NOT NULL,
  `per_tel` char(14) NOT NULL,
  `per_mail` varchar(30) NOT NULL,
  `per_admin` int(11) NOT NULL,
  `per_login` varchar(20) NOT NULL,
  `per_pwd` varchar(100) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=68 ;

--
-- Contenu de la table `personne`
--

INSERT INTO `personne` (`per_num`, `per_nom`, `per_prenom`, `per_tel`, `per_mail`, `per_admin`, `per_login`, `per_pwd`) VALUES
(1, 'Marley  ', 'Bob', '0555555555', 'Bob@unilim.fr', 0, 'Bob', 'ey8hR6Z0AHuSyw1oVu4LRmDCuYY+CEPfJJKBh/Q+sGI='),
(3, 'Duchemin    ', 'Paul    ', '0555555554', 'paul.d@yahoo.fr', 0, 'Paul    ', 'ey8hR6Z0AHuSyw1oVu4LRmDCuYY+CEPfJJKBh/Q+sGI='),
(38, 'Michu  ', 'Marcel  ', '0555555555', 'Michu@sfr.fr', 0, 'Marcel  ', 'ey8hR6Z0AHuSyw1oVu4LRmDCuYY+CEPfJJKBh/Q+sGI='),
(39, 'Renard ', 'Pierrot ', '0655555555', 'Pierrot@gmail.fr', 0, 'sql ', 'ey8hR6Z0AHuSyw1oVu4LRmDCuYY+CEPfJJKBh/Q+sGI='),
(53, 'Delmas    ', 'Sophie    ', '0789562314', 'Sophie@unilim.fr', 0, 'Soso', 'ey8hR6Z0AHuSyw1oVu4LRmDCuYY+CEPfJJKBh/Q+sGI='),
(54, 'Dupuy ', 'Pascale ', '0554565859', 'pascale@free.fr', 0, 'Pascale ', 'ey8hR6Z0AHuSyw1oVu4LRmDCuYY+CEPfJJKBh/Q+sGI='),
(55, 'Chastagner', 'Michel       ', '0555555555', 'Michel.C@yahoo.fr', 1, 'mc', 'ey8hR6Z0AHuSyw1oVu4LRmDCuYY+CEPfJJKBh/Q+sGI='),
(56, 'Monediere  ', 'Thierrry  ', '0555555552', 'Th.mo@orange.fr', 0, 'TM  ', 'ey8hR6Z0AHuSyw1oVu4LRmDCuYY+CEPfJJKBh/Q+sGI='),
(58, 'Yves  ', 'Quentin  ', '0555555550', 'Y.Q@hotmail.fr', 0, 'yves  ', 'ey8hR6Z0AHuSyw1oVu4LRmDCuYY+CEPfJJKBh/Q+sGI='),
(59, 'Lassont  ', 'Florian  ', '0555555553', 'Florain.L@hotmail.fr', 0, 'florian  ', 'ey8hR6Z0AHuSyw1oVu4LRmDCuYY+CEPfJJKBh/Q+sGI='),
(63, 'Dumont ', 'Jacques ', '0555555554', 'jacques.dumont@unilim.fr', 0, 'jd ', 'ey8hR6Z0AHuSyw1oVu4LRmDCuYY+CEPfJJKBh/Q+sGI='),
(64, 'Martin ', 'Martine ', '0555555555', 'martine.martin@unilim.fr', 0, 'mm', 'ey8hR6Z0AHuSyw1oVu4LRmDCuYY+CEPfJJKBh/Q+sGI='),
(67, 'Beldonne', 'Isabelle', '0555555554', 'Bel.isa@yahoo.fr', 1, 'riri', 'ey8hR6Z0AHuSyw1oVu4LRmDCuYY+CEPfJJKBh/Q+sGI=');

-- --------------------------------------------------------

--
-- Structure de la table `salarie`
--

CREATE TABLE IF NOT EXISTS `salarie` (
  `per_num` int(11) NOT NULL,
  `sal_telprof` varchar(20) NOT NULL,
  `fon_num` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `salarie`
--

INSERT INTO `salarie` (`per_num`, `sal_telprof`, `fon_num`) VALUES
(1, '0123456978', 4),
(55, '0654237865', 7),
(56, '0654237864', 8),
(63, '0654237860', 2),
(67, '0654237860', 2);

-- --------------------------------------------------------

--
-- Structure de la table `ville`
--

CREATE TABLE IF NOT EXISTS `ville` (
`vil_num` int(11) NOT NULL,
  `vil_nom` varchar(100) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=18 ;

--
-- Contenu de la table `ville`
--

INSERT INTO `ville` (`vil_num`, `vil_nom`) VALUES
(5, 'Tulle'),
(6, 'Brive'),
(7, 'Limoges'),
(8, 'Guéret'),
(9, 'Périgueux'),
(10, 'Bordeaux'),
(11, 'Paris'),
(12, 'Toulouse'),
(13, 'Lyon'),
(14, 'Poitiers'),
(15, 'Ambazac'),
(16, 'Egletons'),
(17, 'Orléans');

-- --------------------------------------------------------

--
-- Structure de la table `vote`
--

CREATE TABLE IF NOT EXISTS `vote` (
  `cit_num` int(11) NOT NULL,
  `per_num` int(11) NOT NULL,
  `vot_valeur` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `vote`
--

INSERT INTO `vote` (`cit_num`, `per_num`, `vot_valeur`) VALUES
(1, 38, 11),
(2, 39, 12),
(3, 3, 13),
(3, 38, 14),
(3, 54, 15),
(4, 39, 16),
(54, 38, 17);

--
-- Index pour les tables exportées
--

--
-- Index pour la table `citation`
--
ALTER TABLE `citation`
 ADD UNIQUE KEY `citation_pk` (`cit_num`), ADD KEY `est_auteur_fk` (`per_num`), ADD KEY `valide_fk` (`per_num_valide`), ADD KEY `depose_fk` (`per_num_etu`);

--
-- Index pour la table `departement`
--
ALTER TABLE `departement`
 ADD PRIMARY KEY (`dep_num`), ADD KEY `vil_num` (`vil_num`);

--
-- Index pour la table `division`
--
ALTER TABLE `division`
 ADD PRIMARY KEY (`div_num`);

--
-- Index pour la table `etudiant`
--
ALTER TABLE `etudiant`
 ADD PRIMARY KEY (`per_num`), ADD KEY `dep_num` (`dep_num`), ADD KEY `div_num` (`div_num`);

--
-- Index pour la table `fonction`
--
ALTER TABLE `fonction`
 ADD PRIMARY KEY (`fon_num`);

--
-- Index pour la table `mot`
--
ALTER TABLE `mot`
 ADD PRIMARY KEY (`mot_id`), ADD FULLTEXT KEY `mot_interdit` (`mot_interdit`);

--
-- Index pour la table `personne`
--
ALTER TABLE `personne`
 ADD PRIMARY KEY (`per_num`), ADD UNIQUE KEY `per_login` (`per_login`);

--
-- Index pour la table `salarie`
--
ALTER TABLE `salarie`
 ADD PRIMARY KEY (`per_num`), ADD KEY `fon_num` (`fon_num`);

--
-- Index pour la table `ville`
--
ALTER TABLE `ville`
 ADD PRIMARY KEY (`vil_num`);

--
-- Index pour la table `vote`
--
ALTER TABLE `vote`
 ADD PRIMARY KEY (`cit_num`,`per_num`), ADD KEY `vote_ibfk_3` (`per_num`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `citation`
--
ALTER TABLE `citation`
MODIFY `cit_num` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=56;
--
-- AUTO_INCREMENT pour la table `departement`
--
ALTER TABLE `departement`
MODIFY `dep_num` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT pour la table `division`
--
ALTER TABLE `division`
MODIFY `div_num` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT pour la table `fonction`
--
ALTER TABLE `fonction`
MODIFY `fon_num` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT pour la table `mot`
--
ALTER TABLE `mot`
MODIFY `mot_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT pour la table `personne`
--
ALTER TABLE `personne`
MODIFY `per_num` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=68;
--
-- AUTO_INCREMENT pour la table `ville`
--
ALTER TABLE `ville`
MODIFY `vil_num` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=18;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `citation`
--
ALTER TABLE `citation`
ADD CONSTRAINT `citation_ibfk_1` FOREIGN KEY (`per_num`) REFERENCES `personne` (`per_num`),
ADD CONSTRAINT `citation_ibfk_2` FOREIGN KEY (`per_num_valide`) REFERENCES `personne` (`per_num`),
ADD CONSTRAINT `citation_ibfk_3` FOREIGN KEY (`per_num_etu`) REFERENCES `etudiant` (`per_num`);

--
-- Contraintes pour la table `departement`
--
ALTER TABLE `departement`
ADD CONSTRAINT `departement_ibfk_1` FOREIGN KEY (`vil_num`) REFERENCES `ville` (`vil_num`);

--
-- Contraintes pour la table `etudiant`
--
ALTER TABLE `etudiant`
ADD CONSTRAINT `etudiant_ibfk_1` FOREIGN KEY (`per_num`) REFERENCES `personne` (`per_num`),
ADD CONSTRAINT `etudiant_ibfk_2` FOREIGN KEY (`dep_num`) REFERENCES `departement` (`dep_num`),
ADD CONSTRAINT `etudiant_ibfk_3` FOREIGN KEY (`div_num`) REFERENCES `division` (`div_num`);

--
-- Contraintes pour la table `salarie`
--
ALTER TABLE `salarie`
ADD CONSTRAINT `salarie_ibfk_1` FOREIGN KEY (`per_num`) REFERENCES `personne` (`per_num`),
ADD CONSTRAINT `salarie_ibfk_2` FOREIGN KEY (`fon_num`) REFERENCES `fonction` (`fon_num`);

--
-- Contraintes pour la table `vote`
--
ALTER TABLE `vote`
ADD CONSTRAINT `vote_ibfk_2` FOREIGN KEY (`cit_num`) REFERENCES `citation` (`cit_num`),
ADD CONSTRAINT `vote_ibfk_3` FOREIGN KEY (`per_num`) REFERENCES `etudiant` (`per_num`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
