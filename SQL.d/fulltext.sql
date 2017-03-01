
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


ALTER TABLE `host` ADD FULLTEXT KEY `title` (`title`);
ALTER TABLE `host` ADD FULLTEXT KEY `company_name` (`company_name`);
ALTER TABLE `host` ADD FULLTEXT KEY `search` (`title`,`company_name`,`company_desc`);

ALTER TABLE `product` ADD FULLTEXT KEY `product_name` (`product_name`);
ALTER TABLE `product` ADD FULLTEXT KEY `product_desc` (`product_desc`);
ALTER TABLE `product` ADD FULLTEXT KEY `search` (`product_name`,`product_desc`);
