-- phpMyAdmin SQL Dump
-- version 4.3.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jul 29, 2016 at 06:25 PM
-- Server version: 5.6.24
-- PHP Version: 5.6.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `sidekeek`
--

-- --------------------------------------------------------

--
-- Table structure for table `bussiness_category`
--

CREATE TABLE IF NOT EXISTS `bussiness_category` (
  `id_cat` int(11) NOT NULL,
  `category_name` varchar(30) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bussiness_category`
--

INSERT INTO `bussiness_category` (`id_cat`, `category_name`) VALUES
(1, 'Pakaian'),
(2, 'Marketing'),
(3, 'Architecture'),
(4, 'Crafts'),
(5, 'Multimedia Design'),
(6, 'Apparel & Accessories'),
(7, 'Textile & Leather'),
(8, 'Cinematography & Photography'),
(9, 'Interactive Games'),
(10, 'Music & Entertainment'),
(11, 'Printing'),
(12, 'IT & Computers'),
(13, 'Food & Beverage'),
(14, 'Furniture');

-- --------------------------------------------------------

--
-- Table structure for table `city`
--

CREATE TABLE IF NOT EXISTS `city` (
  `id_city` int(11) NOT NULL,
  `city_name` varchar(30) NOT NULL,
  `province` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `city`
--

INSERT INTO `city` (`id_city`, `city_name`, `province`) VALUES
(1, 'Bandung', 1),
(2, 'Surabaya', 3);

-- --------------------------------------------------------

--
-- Table structure for table `cycle_id_temp`
--

CREATE TABLE IF NOT EXISTS `cycle_id_temp` (
  `name` varchar(30) NOT NULL,
  `value` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `cycle_id_temp`
--

INSERT INTO `cycle_id_temp` (`name`, `value`) VALUES
('host_temp', 0);

-- --------------------------------------------------------

--
-- Table structure for table `gallery_product`
--

CREATE TABLE IF NOT EXISTS `gallery_product` (
  `id` int(11) NOT NULL,
  `img_base64` varchar(200) NOT NULL,
  `id_product` int(11) NOT NULL,
  `isRepresentation` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `host`
--

CREATE TABLE IF NOT EXISTS `host` (
  `id_host` int(11) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(200) NOT NULL,
  `handphone` varchar(15) NOT NULL,
  `company_name` varchar(30) NOT NULL,
  `company_desc` varchar(1000) NOT NULL,
  `img_base64` varchar(200) DEFAULT NULL,
  `category` int(11) DEFAULT NULL,
  `tagline` varchar(100) DEFAULT NULL,
  `about` varchar(1000) DEFAULT NULL,
  `location` int(11) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `title` varchar(30) DEFAULT NULL,
  `id_tipe` int(11) DEFAULT NULL,
  `statusz` int(5) DEFAULT NULL,
  `unique_code` varchar(12) DEFAULT NULL,
  `region` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `host`
--

INSERT INTO `host` (`id_host`, `email`, `password`, `handphone`, `company_name`, `company_desc`, `img_base64`, `category`, `tagline`, `about`, `location`, `address`, `title`, `id_tipe`, `statusz`, `unique_code`, `region`, `created_at`) VALUES
(13, 'fahrizalseptrianto@gmail.com', '2766e8973102efc6e849454b20fa845b', '0856', 'myName', 'updt My Titel', 'http://localhost:8080/Sidekeek-Server/assets/img/fahrizalseptrianto@gmail.com/accountPicture.jpeg', 1, NULL, 'about', 1, 'jalan jawa', 'updt my Title', 1, 1, 'done', NULL, '2016-07-28 07:50:08'),
(17, 'ijalcavaliers@yahoo.co.id', '2766e8973102efc6e849454b20fa845b', '', 'Rounded Company Name', '', NULL, 1, NULL, NULL, NULL, NULL, 'Rounded Thread Title', 1, 1, 'done', NULL, '2016-07-29 12:19:47');

-- --------------------------------------------------------

--
-- Table structure for table `host_temp`
--

CREATE TABLE IF NOT EXISTS `host_temp` (
  `id_host` int(11) NOT NULL,
  `random_unique` int(11) NOT NULL,
  `email` varchar(30) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `company_name` varchar(30) DEFAULT NULL,
  `img_base64` varchar(200) DEFAULT NULL,
  `category` int(11) DEFAULT NULL,
  `tagline` varchar(100) DEFAULT NULL,
  `profile_desc` varchar(200) DEFAULT NULL,
  `location` int(11) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `title` varchar(30) DEFAULT NULL,
  `id_tipe` int(11) DEFAULT NULL,
  `stat_temp` varchar(100) NOT NULL,
  `region` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE IF NOT EXISTS `message` (
  `id_msg` int(11) NOT NULL,
  `id_host` int(11) NOT NULL,
  `subject` varchar(50) NOT NULL,
  `msg` varchar(500) NOT NULL,
  `from_id_host` int(11) NOT NULL,
  `statusz` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `portofolio`
--

CREATE TABLE IF NOT EXISTS `portofolio` (
  `id_portofolio` int(11) NOT NULL,
  `id_host` int(11) NOT NULL,
  `title` varchar(30) NOT NULL,
  `description` varchar(255) NOT NULL,
  `img_base64` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE IF NOT EXISTS `product` (
  `id_product` int(11) NOT NULL,
  `id_host` int(11) NOT NULL,
  `product_name` varchar(30) NOT NULL,
  `product_desc` varchar(200) NOT NULL,
  `price` int(11) NOT NULL,
  `unique_code` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `province`
--

CREATE TABLE IF NOT EXISTS `province` (
  `id_province` int(11) NOT NULL,
  `province_name` varchar(50) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `province`
--

INSERT INTO `province` (`id_province`, `province_name`) VALUES
(1, 'Jawa Barat'),
(2, 'Jawa Tengah'),
(3, 'Jawa Timur');

-- --------------------------------------------------------

--
-- Table structure for table `session_host`
--

CREATE TABLE IF NOT EXISTS `session_host` (
  `id_session` int(11) NOT NULL,
  `id_host` int(11) NOT NULL,
  `session_code` varchar(100) NOT NULL,
  `signed_in_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_activity` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `session_host`
--

INSERT INTO `session_host` (`id_session`, `id_host`, `session_code`, `signed_in_at`, `last_activity`) VALUES
(1, 13, 'XjoLQBUFRc', '2016-07-28 05:40:01', '2015-10-10 05:12:12'),
(3, 17, 'Y73SIXCH95', '2016-07-29 12:19:58', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tipe`
--

CREATE TABLE IF NOT EXISTS `tipe` (
  `id_tipe` int(11) NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tipe`
--

INSERT INTO `tipe` (`id_tipe`, `name`) VALUES
(1, 'goods'),
(2, 'services');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bussiness_category`
--
ALTER TABLE `bussiness_category`
  ADD PRIMARY KEY (`id_cat`);

--
-- Indexes for table `city`
--
ALTER TABLE `city`
  ADD PRIMARY KEY (`id_city`), ADD KEY `province` (`province`);

--
-- Indexes for table `gallery_product`
--
ALTER TABLE `gallery_product`
  ADD PRIMARY KEY (`id`), ADD KEY `id_product` (`id_product`);

--
-- Indexes for table `host`
--
ALTER TABLE `host`
  ADD PRIMARY KEY (`id_host`), ADD UNIQUE KEY `email` (`email`), ADD KEY `category` (`category`), ADD KEY `location` (`location`), ADD KEY `product_type` (`id_tipe`), ADD KEY `region` (`region`), ADD FULLTEXT KEY `title` (`title`), ADD FULLTEXT KEY `company_name` (`company_name`), ADD FULLTEXT KEY `search` (`title`,`company_name`);

--
-- Indexes for table `host_temp`
--
ALTER TABLE `host_temp`
  ADD PRIMARY KEY (`id_host`), ADD KEY `category` (`category`), ADD KEY `location` (`location`), ADD KEY `product_type` (`id_tipe`), ADD KEY `region` (`region`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id_msg`), ADD KEY `id_host` (`id_host`), ADD KEY `from_id_host` (`from_id_host`);

--
-- Indexes for table `portofolio`
--
ALTER TABLE `portofolio`
  ADD PRIMARY KEY (`id_portofolio`), ADD KEY `id_host` (`id_host`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id_product`), ADD KEY `id_host` (`id_host`), ADD FULLTEXT KEY `product_name` (`product_name`), ADD FULLTEXT KEY `product_desc` (`product_desc`), ADD FULLTEXT KEY `search` (`product_name`,`product_desc`);

--
-- Indexes for table `province`
--
ALTER TABLE `province`
  ADD PRIMARY KEY (`id_province`);

--
-- Indexes for table `session_host`
--
ALTER TABLE `session_host`
  ADD PRIMARY KEY (`id_session`);

--
-- Indexes for table `tipe`
--
ALTER TABLE `tipe`
  ADD PRIMARY KEY (`id_tipe`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bussiness_category`
--
ALTER TABLE `bussiness_category`
  MODIFY `id_cat` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT for table `city`
--
ALTER TABLE `city`
  MODIFY `id_city` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `gallery_product`
--
ALTER TABLE `gallery_product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `host`
--
ALTER TABLE `host`
  MODIFY `id_host` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `host_temp`
--
ALTER TABLE `host_temp`
  MODIFY `id_host` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `id_msg` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `portofolio`
--
ALTER TABLE `portofolio`
  MODIFY `id_portofolio` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id_product` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `province`
--
ALTER TABLE `province`
  MODIFY `id_province` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `session_host`
--
ALTER TABLE `session_host`
  MODIFY `id_session` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `tipe`
--
ALTER TABLE `tipe`
  MODIFY `id_tipe` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `city`
--
ALTER TABLE `city`
ADD CONSTRAINT `city_ibfk_1` FOREIGN KEY (`province`) REFERENCES `province` (`id_province`);

--
-- Constraints for table `gallery_product`
--
ALTER TABLE `gallery_product`
ADD CONSTRAINT `gallery_product_ibfk_1` FOREIGN KEY (`id_product`) REFERENCES `product` (`id_product`);

--
-- Constraints for table `host`
--
ALTER TABLE `host`
ADD CONSTRAINT `host_ibfk_1` FOREIGN KEY (`category`) REFERENCES `bussiness_category` (`id_cat`),
ADD CONSTRAINT `host_ibfk_2` FOREIGN KEY (`location`) REFERENCES `city` (`id_city`),
ADD CONSTRAINT `host_ibfk_3` FOREIGN KEY (`id_tipe`) REFERENCES `tipe` (`id_tipe`),
ADD CONSTRAINT `host_ibfk_4` FOREIGN KEY (`region`) REFERENCES `province` (`id_province`);

--
-- Constraints for table `host_temp`
--
ALTER TABLE `host_temp`
ADD CONSTRAINT `host_temp_ibfk_1` FOREIGN KEY (`category`) REFERENCES `bussiness_category` (`id_cat`),
ADD CONSTRAINT `host_temp_ibfk_2` FOREIGN KEY (`location`) REFERENCES `city` (`id_city`),
ADD CONSTRAINT `host_temp_ibfk_3` FOREIGN KEY (`id_tipe`) REFERENCES `tipe` (`id_tipe`),
ADD CONSTRAINT `host_temp_ibfk_4` FOREIGN KEY (`region`) REFERENCES `province` (`id_province`);

--
-- Constraints for table `portofolio`
--
ALTER TABLE `portofolio`
ADD CONSTRAINT `portofolio_ibfk_1` FOREIGN KEY (`id_host`) REFERENCES `host` (`id_host`);

--
-- Constraints for table `product`
--
ALTER TABLE `product`
ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`id_host`) REFERENCES `host` (`id_host`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
