-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Oct 07, 2016 at 04:02 PM
-- Server version: 10.1.16-MariaDB
-- PHP Version: 7.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sidekeek`
--

-- --------------------------------------------------------

--
-- Table structure for table `bussiness_category`
--

CREATE TABLE `bussiness_category` (
  `id_cat` int(11) NOT NULL,
  `category_name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bussiness_category`
--

INSERT INTO `bussiness_category` (`id_cat`, `category_name`) VALUES
(1, 'Apparel'),
(2, 'Architecture'),
(3, 'Crafts'),
(4, 'Entertainment'),
(5, 'Event'),
(6, 'Food & Beverage'),
(7, 'IT'),
(8, 'Marketing'),
(9, 'Merchandise'),
(10, 'Multimedia Design'),
(11, 'Printing');

-- --------------------------------------------------------

--
-- Table structure for table `city`
--

CREATE TABLE `city` (
  `id_city` int(11) NOT NULL,
  `city_name` varchar(30) NOT NULL,
  `province` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `city`
--

INSERT INTO `city` (`id_city`, `city_name`, `province`) VALUES
(1, 'Bandung', 1);

-- --------------------------------------------------------

--
-- Table structure for table `cycle_id_temp`
--

CREATE TABLE `cycle_id_temp` (
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

CREATE TABLE `gallery_product` (
  `id` int(11) NOT NULL,
  `img_base64` varchar(200) NOT NULL,
  `id_product` int(11) NOT NULL,
  `isRepresentation` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `gallery_product`
--

INSERT INTO `gallery_product` (`id`, `img_base64`, `id_product`, `isRepresentation`) VALUES
(22, 'http://localhost/Sidekeek-Server/assets/img/fahrizalseptrianto@gmail.com/products/product-10/product-22_m0UT0.jpeg', 10, 1);

-- --------------------------------------------------------

--
-- Table structure for table `host`
--

CREATE TABLE `host` (
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
  `sumrate_totalreview` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MYISAM;

--
-- Dumping data for table `host`
--

INSERT INTO `host` (`id_host`, `email`, `password`, `handphone`, `company_name`, `company_desc`, `img_base64`, `category`, `tagline`, `about`, `location`, `address`, `title`, `id_tipe`, `statusz`, `unique_code`, `region`, `sumrate_totalreview`, `created_at`) VALUES
(1, 'fahrizalseptrianto@gmail.com', '202cb962ac59075b964b07152d234b70', '0982384', 'Copmany Name Edit Transact', 'Transctin dulu atuh', 'http://localhost/Sidekeek-Server/assets/img/fahrizalseptrianto@gmail.com/accountPicture.jpeg', 11, NULL, 'About edit transact', 1, 'Jalan Jawa Transact', '$$May niuw transact', 1, 1, 'done', NULL, '23_4', '2016-10-02 17:44:41'),
(2, 'ijalcavaliersz@yahoo.co.id', '202cb962ac59075b964b07152d234b70', '', 'Transact Copmany mczal', '', NULL, 9, NULL, NULL, NULL, NULL, 'Transact Title Thread Company ', 1, 1, 'done', NULL, NULL, '2016-10-06 16:12:56'),
(3, 'ijalcavaliers@yahoo.co.id', '202cb962ac59075b964b07152d234b70', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'hKE9ZiyOf4', NULL, NULL, '2016-10-06 16:14:30');

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
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

CREATE TABLE `portofolio` (
  `id_portofolio` int(11) NOT NULL,
  `id_host` int(11) NOT NULL,
  `title` varchar(30) NOT NULL,
  `description` varchar(255) NOT NULL,
  `img_base64` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `portofolio`
--

INSERT INTO `portofolio` (`id_portofolio`, `id_host`, `title`, `description`, `img_base64`) VALUES
(15, 1, 'Nice porto done', '#1 this is me wearing this suit of happiness', 'http://localhost/Sidekeek-Server/assets/img/fahrizalseptrianto@gmail.com/portofolios/portofolio16.png');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id_product` int(11) NOT NULL,
  `id_host` int(11) NOT NULL,
  `product_name` varchar(30) NOT NULL,
  `product_desc` varchar(200) NOT NULL,
  `img_rep` varchar(255) NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=MYISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id_product`, `id_host`, `product_name`, `product_desc`, `img_rep`, `price`) VALUES
(1, 1, 'produk 33', 'Produk zachri AKA pucet', '', 250),
(10, 1, '$UPDATED$ Title', '$UPDATED$ My Description nich', 'http://localhost/Sidekeek-Server/assets/img/fahrizalseptrianto@gmail.com/products/product-10/product-22_m0UT0.jpeg', 221500);

-- --------------------------------------------------------

--
-- Table structure for table `province`
--

CREATE TABLE `province` (
  `id_province` int(11) NOT NULL,
  `province_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `province`
--

INSERT INTO `province` (`id_province`, `province_name`) VALUES
(1, 'Jawa Barat');

-- --------------------------------------------------------

--
-- Table structure for table `review_host`
--

CREATE TABLE `review_host` (
  `id` int(11) NOT NULL,
  `id_host` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `rate` tinyint(4) NOT NULL,
  `comment` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `review_host`
--

INSERT INTO `review_host` (`id`, `id_host`, `name`, `rate`, `comment`) VALUES
(1, 1, 'MamaDedehhh', 5, 'ma ma ma ma comment'),
(2, 1, 'MamaDedehhh', 1, 'ma ma ma ma comment'),
(3, 1, 'MamaDedehhh', 5, 'ma ma ma ma comment'),
(4, 1, 'TRANSACT', 12, 'Transact Begin');

-- --------------------------------------------------------

--
-- Table structure for table `session_host`
--

CREATE TABLE `session_host` (
  `id_session` int(11) NOT NULL,
  `id_host` int(11) NOT NULL,
  `session_code` varchar(100) NOT NULL,
  `signed_in_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_activity` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `session_host`
--

INSERT INTO `session_host` (`id_session`, `id_host`, `session_code`, `signed_in_at`, `last_activity`) VALUES
(1, 1, 'e58O3gKvcQ', '2016-10-02 17:46:20', '2016-10-06 16:15:28'),
(2, 2, 'E3rMm3h9d1', '2016-10-06 16:13:29', '2016-10-06 16:13:29');

-- --------------------------------------------------------

--
-- Table structure for table `tipe`
--

CREATE TABLE `tipe` (
  `id_tipe` int(11) NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tipe`
--

INSERT INTO `tipe` (`id_tipe`, `name`) VALUES
(1, 'goods'),
(2, 'services');

-- --------------------------------------------------------

--
-- Table structure for table `unlinked_path`
--

CREATE TABLE `unlinked_path` (
  `id` int(11) NOT NULL,
  `path` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_host` int(11) NOT NULL,
  `obj_erro` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
