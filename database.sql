-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: bus_booking_db
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `booking_seats`
--

DROP TABLE IF EXISTS `booking_seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_seats` (
  `booking_id` bigint NOT NULL,
  `seat_number` varchar(255) DEFAULT NULL,
  KEY `FKmbi9ciapn0nvat63t0a8tv478` (`booking_id`),
  CONSTRAINT `FKmbi9ciapn0nvat63t0a8tv478` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_seats`
--

LOCK TABLES `booking_seats` WRITE;
/*!40000 ALTER TABLE `booking_seats` DISABLE KEYS */;
INSERT INTO `booking_seats` VALUES (1,'S3'),(1,'S4'),(2,'S1'),(2,'S2'),(2,'S3'),(2,'S4'),(3,'S7'),(3,'S35'),(4,'S9'),(4,'S12'),(5,'S39'),(5,'S40'),(5,'S37'),(5,'S38'),(6,'S8'),(7,'S17'),(7,'S34'),(8,'S5'),(8,'S13');
/*!40000 ALTER TABLE `booking_seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_selected_seats`
--

DROP TABLE IF EXISTS `booking_selected_seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_selected_seats` (
  `booking_id` bigint NOT NULL,
  `seat_number` varchar(255) DEFAULT NULL,
  KEY `FKo61i6m3box3whd17fb8p6vss8` (`booking_id`),
  CONSTRAINT `FKo61i6m3box3whd17fb8p6vss8` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_selected_seats`
--

LOCK TABLES `booking_selected_seats` WRITE;
/*!40000 ALTER TABLE `booking_selected_seats` DISABLE KEYS */;
INSERT INTO `booking_selected_seats` VALUES (9,'1C'),(9,'1D'),(10,'3A'),(10,'3B'),(10,'4A'),(10,'4B'),(10,'3C'),(10,'3D'),(11,'9D'),(12,'2C');
/*!40000 ALTER TABLE `booking_selected_seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `booking_reference` varchar(255) DEFAULT NULL,
  `booking_time` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `nic` varchar(255) DEFAULT NULL,
  `passenger_name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `total_amount` double DEFAULT NULL,
  `bus_id` bigint DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `cancellation_time` datetime(6) DEFAULT NULL,
  `discount_amount` double DEFAULT NULL,
  `original_amount` double DEFAULT NULL,
  `refund_amount` double DEFAULT NULL,
  `baggage_fee` double DEFAULT NULL,
  `boarding_point` varchar(255) DEFAULT NULL,
  `extra_baggage_count` int DEFAULT NULL,
  `dropping_point` varchar(255) DEFAULT NULL,
  `seat_number` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKebb19pi5yjjixd0xjxdfx3ru8` (`bus_id`),
  CONSTRAINT `FKebb19pi5yjjixd0xjxdfx3ru8` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'BK-BF3F95BB','2026-08-19 16:43:25.528523','thenula2002@gmail.com','200233100312','thenuuu','0768202700',3700,1,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'BK-AAC66F8C','2026-08-19 17:21:49.863684','thenula2002@gmail.com','200233100312','rathnayaka','0768202700',4000,5,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,'BK-ECA651D9','2026-08-19 17:30:47.339293','thenula2002@gmail.com','200233100312','thenula dilhara','0768202700',2000,5,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,'BK-E08E005D','2026-08-19 17:35:22.871160','thenula2002@gmail.com','660831460v','Dilhara','0741651814',4400,2,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,'BK-F798A30A','2026-08-20 16:20:37.117214','rathnayakahasindu3@gmail.com','200422300369','Hasindu','0766390065',8800,2,'CONFIRMED',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,'BK-880A5360','2026-08-20 16:53:14.826938','thenula2002@gmail.com','gjk','dtkdghk','dgk',1850,1,'CONFIRMED',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,'BK-C8F2D3F1','2026-08-20 17:22:27.474337','tt@gmail.com','gyukmgy','kdyuky','gyukuyk',3200,1,'CANCELLED','2026-08-20 17:22:51.054139',500,3700,2720,NULL,NULL,NULL,NULL,NULL),(8,'BK-740CD86F','2026-08-22 07:34:14.585634','thenula2002@gmail.com','62+656554165','xfnzcvn','62+156156+',3400,3,'CONFIRMED',NULL,0,3400,0,600,'Colombo Central Terminal',2,NULL,NULL),(9,'BK-9BE6B915','2026-08-22 11:39:41.452917','thenula2002@gmail.com','200233100312','tttttt','0768202700',4000,1,'CONFIRMED',NULL,0,4000,0,300,'Colombo Central',1,'Kandy',NULL),(10,'BK-A234410B','2026-08-22 11:46:34.224997','thenula2002@gmail.com','200233100312','cgdf','0768202700',11700,1,'CONFIRMED',NULL,0,11700,0,600,'Colombo Central',2,'Kandy',NULL),(11,'BK-49672E0D','2026-08-22 16:35:57.277449','thenula2002@gmail.com','456456','ghjgdhj','456748567867',1850,1,'CONFIRMED',NULL,0,1850,0,0,'Colombo Central',0,'Kandy',NULL),(12,'BK-1438A32D','2026-08-28 09:34:27.556179','thenula2002@gmail.com','200233100312','tttttttttt','0768202700',2500,2,'CONFIRMED',NULL,0,2500,0,300,'Colombo Central',1,'Kandy',NULL);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bus_boarding_points`
--

DROP TABLE IF EXISTS `bus_boarding_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bus_boarding_points` (
  `bus_id` bigint NOT NULL,
  `boarding_point` varchar(255) DEFAULT NULL,
  `boarding_points` varchar(255) DEFAULT NULL,
  `point_name` varchar(255) DEFAULT NULL,
  KEY `FKqkwqtpifhmfc75ebxeko0m5ty` (`bus_id`),
  CONSTRAINT `FKqkwqtpifhmfc75ebxeko0m5ty` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bus_boarding_points`
--

LOCK TABLES `bus_boarding_points` WRITE;
/*!40000 ALTER TABLE `bus_boarding_points` DISABLE KEYS */;
INSERT INTO `bus_boarding_points` VALUES (15,NULL,NULL,'Bastian Mawatha'),(15,NULL,NULL,'Kadawatha Interchange'),(15,NULL,NULL,'Nittambuwa'),(15,NULL,NULL,'Kegalle'),(15,NULL,NULL,'Mawanella'),(16,NULL,NULL,'Goodshed Terminal'),(16,NULL,NULL,'Peradeniya'),(16,NULL,NULL,'Mawanella'),(16,NULL,NULL,'Kegalle'),(17,NULL,NULL,'Makumbura Multi-Modal'),(17,NULL,NULL,'Kottawa Interchange'),(17,NULL,NULL,'Dodangoda'),(18,NULL,NULL,'Matara Kotuwegoda'),(18,NULL,NULL,'Galle Pinnaduwa Exit'),(18,NULL,NULL,'Kurundugahahetekma'),(19,NULL,NULL,'Bastian Mawatha'),(19,NULL,NULL,'Kadawatha'),(19,NULL,NULL,'Kurunegala'),(19,NULL,NULL,'Anuradhapura'),(19,NULL,NULL,'Vavuniya'),(20,NULL,NULL,'Jaffna Central Terminal'),(20,NULL,NULL,'Kilinochchi'),(20,NULL,NULL,'Vavuniya'),(20,NULL,NULL,'Anuradhapura'),(21,NULL,NULL,'Bastian Mawatha'),(21,NULL,NULL,'Avissawella'),(21,NULL,NULL,'Ratnapura'),(21,NULL,NULL,'Pelmadulla'),(21,NULL,NULL,'Balangoda'),(22,NULL,NULL,'Bastian Mawatha'),(22,NULL,NULL,'Kadawatha'),(22,NULL,NULL,'Kurunegala'),(22,NULL,NULL,'Dambulla'),(22,NULL,NULL,'Habarana'),(22,NULL,NULL,'Kantale'),(23,NULL,NULL,'Colombo Fort'),(23,NULL,NULL,'Peliyagoda Interchange');
/*!40000 ALTER TABLE `bus_boarding_points` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bus_booked_seats`
--

DROP TABLE IF EXISTS `bus_booked_seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bus_booked_seats` (
  `bus_id` bigint NOT NULL,
  `seat_number` varchar(255) DEFAULT NULL,
  `booked_seats` varchar(255) DEFAULT NULL,
  KEY `FKfkesqj2ha3mxb86ra6xigwpo8` (`bus_id`),
  CONSTRAINT `FKfkesqj2ha3mxb86ra6xigwpo8` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bus_booked_seats`
--

LOCK TABLES `bus_booked_seats` WRITE;
/*!40000 ALTER TABLE `bus_booked_seats` DISABLE KEYS */;
INSERT INTO `bus_booked_seats` VALUES (4,'S1',NULL),(4,'S12',NULL),(4,'S13',NULL),(4,'S14',NULL),(5,'S1',NULL),(5,'S2',NULL),(5,'S3',NULL),(5,'S4',NULL),(5,'S7',NULL),(5,'S35',NULL),(3,'S3',NULL),(3,'S4',NULL),(3,'S18',NULL),(3,'S5',NULL),(3,'S13',NULL),(1,'S1',NULL),(1,'S2',NULL),(1,'S10',NULL),(1,'S15',NULL),(1,'S3',NULL),(1,'S4',NULL),(1,'S8',NULL),(1,'1C',NULL),(1,'1D',NULL),(1,'3A',NULL),(1,'3B',NULL),(1,'4A',NULL),(1,'4B',NULL),(1,'3C',NULL),(1,'3D',NULL),(1,'9D',NULL),(15,'1A',NULL),(15,'1B',NULL),(15,'3C',NULL),(16,'2A',NULL),(16,'2B',NULL),(17,'4A',NULL),(17,'4B',NULL),(19,'1A',NULL),(19,'2A',NULL),(19,'5B',NULL),(21,'6A',NULL),(21,'6B',NULL),(2,'S5',NULL),(2,'S6',NULL),(2,'S7',NULL),(2,'S8',NULL),(2,'S21',NULL),(2,'S9',NULL),(2,'S12',NULL),(2,'S39',NULL),(2,'S40',NULL),(2,'S37',NULL),(2,'S38',NULL),(2,'2C',NULL);
/*!40000 ALTER TABLE `bus_booked_seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bus_held_seats`
--

DROP TABLE IF EXISTS `bus_held_seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bus_held_seats` (
  `bus_id` bigint NOT NULL,
  `expires_at` bigint DEFAULT NULL,
  `seat_number` varchar(255) NOT NULL,
  `hold_expiry_timestamp` bigint DEFAULT NULL,
  PRIMARY KEY (`bus_id`,`seat_number`),
  CONSTRAINT `FKemwaiv1a0g8v98o7kgdkwhc9k` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bus_held_seats`
--

LOCK TABLES `bus_held_seats` WRITE;
/*!40000 ALTER TABLE `bus_held_seats` DISABLE KEYS */;
INSERT INTO `bus_held_seats` VALUES (1,NULL,'6C',1787399039551),(1,NULL,'6D',1787399039551),(1,NULL,'7C',1787399008676),(1,NULL,'7D',1787399008676);
/*!40000 ALTER TABLE `bus_held_seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bus_reviews`
--

DROP TABLE IF EXISTS `bus_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bus_reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `bus_id` bigint DEFAULT NULL,
  `comment` varchar(1000) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `passenger_name` varchar(255) DEFAULT NULL,
  `rating` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bus_reviews`
--

LOCK TABLES `bus_reviews` WRITE;
/*!40000 ALTER TABLE `bus_reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `bus_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bus_route_halts`
--

DROP TABLE IF EXISTS `bus_route_halts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bus_route_halts` (
  `bus_id` bigint NOT NULL,
  `fare_from_origin` double DEFAULT NULL,
  `halt_name` varchar(255) DEFAULT NULL,
  `order_index` int DEFAULT NULL,
  KEY `FKbxk6af1qq8omk2ghsa673sky5` (`bus_id`),
  CONSTRAINT `FKbxk6af1qq8omk2ghsa673sky5` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bus_route_halts`
--

LOCK TABLES `bus_route_halts` WRITE;
/*!40000 ALTER TABLE `bus_route_halts` DISABLE KEYS */;
INSERT INTO `bus_route_halts` VALUES (15,400,'Kadawatha',1),(15,700,'Nittambuwa',2),(15,950,'Warakapola',3),(15,1300,'Kegalle',4),(15,1500,'Mawanella',5),(15,1750,'Peradeniya',6),(15,1850,'Kandy',7),(16,300,'Peradeniya',1),(16,600,'Mawanella',2),(16,900,'Kegalle',3),(16,1200,'Warakapola',4),(16,1600,'Kadawatha',5),(16,1850,'Colombo',6),(17,0,'Makumbura',1),(17,650,'Dodangoda',2),(17,950,'Kurundugahahetekma',3),(17,1350,'Galle',4),(17,1650,'Matara',5),(18,500,'Galle',1),(18,850,'Kurundugahahetekma',2),(18,1200,'Dodangoda',3),(18,1650,'Makumbura',4),(18,1650,'Colombo',5),(19,400,'Kadawatha',1),(19,1100,'Kurunegala',2),(19,1600,'Dambulla',3),(19,2100,'Anuradhapura',4),(19,2600,'Vavuniya',5),(19,3050,'Kilinochchi',6),(19,3400,'Jaffna',7),(20,500,'Kilinochchi',1),(20,1000,'Vavuniya',2),(20,1500,'Anuradhapura',3),(20,2400,'Kurunegala',4),(20,3100,'Kadawatha',5),(20,3400,'Colombo',6),(21,450,'Avissawella',1),(21,900,'Ratnapura',2),(21,1200,'Pelmadulla',3),(21,1600,'Balangoda',4),(21,2000,'Beragala',5),(21,2350,'Bandarawela',6),(21,2600,'Ella',7),(22,400,'Kadawatha',1),(22,1100,'Kurunegala',2),(22,1600,'Dambulla',3),(22,1950,'Habarana',4),(22,2350,'Kantale',5),(22,2750,'Trincomalee',6),(23,200,'Peliyagoda',1),(23,600,'Katunayake',2);
/*!40000 ALTER TABLE `bus_route_halts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buses`
--

DROP TABLE IF EXISTS `buses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `arrival_time` varchar(255) DEFAULT NULL,
  `bus_name` varchar(255) DEFAULT NULL,
  `bus_number` varchar(255) DEFAULT NULL,
  `bus_type` varchar(255) DEFAULT NULL,
  `departure_time` varchar(255) DEFAULT NULL,
  `destination` varchar(255) DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `total_seats` int DEFAULT NULL,
  `average_rating` double DEFAULT NULL,
  `total_reviews` int DEFAULT NULL,
  `current_latitude` double DEFAULT NULL,
  `current_longitude` double DEFAULT NULL,
  `current_status_text` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buses`
--

LOCK TABLES `buses` WRITE;
/*!40000 ALTER TABLE `buses` DISABLE KEYS */;
INSERT INTO `buses` VALUES (1,'09:45 AM','Super Line Express','NA-4589','Luxury A/C','06:30 AM','Kandy','3h 15m',1850,'Colombo',40,NULL,NULL,6.9344,79.8543,'DEPARTED_ORIGIN (At Colombo Bastian Mawatha)'),(2,'11:00 AM','Highway Comfort Trans','ND-1120','Super Luxury Volvo','08:00 AM','Kandy','3h 00m',2200,'Colombo',40,NULL,NULL,NULL,NULL,NULL),(3,'08:45 AM','Southern Blue Rider','WP-8899','Semi-Luxury Express','07:00 AM','Galle','1h 45m',1400,'Colombo',40,NULL,NULL,NULL,NULL,NULL),(4,'05:00 AM','Northern Royal Express','NP-3321','Super Luxury Sleeper','09:00 PM','Jaffna','8h 00m',3500,'Colombo',40,NULL,NULL,NULL,NULL,NULL),(5,'09:00 AM','Thenula Express','NF-7622','Super Luxury Volvo','06:00 AM','Kurunegala','2h 00m',1000,'Colombo',40,NULL,NULL,10.9292,79.8612,'ON_SCHEDULE'),(15,'09:45 AM','Super Line Intercity','ND-4589','Luxury A/C','06:30 AM','Kandy','3h 15m',1850,'Colombo',49,4.8,32,7.0016,79.9542,'APPROACHING_KADAWATHA'),(16,'05:45 PM','Super Line Intercity','ND-4590','Luxury A/C','02:30 PM','Colombo','3h 15m',1850,'Kandy',49,4.7,28,7.2906,80.6337,'BOARDING_AT_KANDY'),(17,'10:00 AM','Southern Highway Cruiser','WP-7821','Super Luxury Volvo','08:00 AM','Matara','2h 00m',1650,'Colombo',45,4.9,54,6.5861,80.0573,'CRUISING_EXPRESSWAY_E01'),(18,'05:00 PM','Southern Highway Cruiser','WP-7822','Super Luxury Volvo','03:00 PM','Colombo','2h 00m',1650,'Matara',45,4.8,41,5.9496,80.5469,'PREPARING_DEPARTURE'),(19,'04:30 AM','Northern Royal Sleeper','NC-9912','Super Luxury Sleeper','08:30 PM','Jaffna','8h 00m',3400,'Colombo',36,4.9,76,7.4863,80.3623,'HALT_KURUNEGALA_STATION'),(20,'03:30 AM','Northern Royal Sleeper','NC-9913','Super Luxury Sleeper','07:30 PM','Colombo','8h 00m',3400,'Jaffna',36,4.9,62,9.6615,80.0255,'BOARDING_AT_JAFFNA'),(21,'04:45 AM','Highland Express Sleeper','UP-3411','Luxury A/C','09:00 PM','Ella','7h 45m',2600,'Colombo',40,4.7,45,6.6828,80.4036,'CROSSING_RATNAPURA'),(22,'05:15 AM','Eastern Pearl Express','EP-5620','Luxury A/C','10:00 PM','Trincomalee','7h 15m',2750,'Colombo',44,4.6,38,7.8731,80.6511,'APPROACHING_DAMBULLA'),(23,'07:45 AM','Airport Express Shuttle','WP-1002','Luxury A/C','07:00 AM','Katunayake','0h 45m',600,'Colombo',35,4.9,19,6.9821,79.8872,'ON_SCHEDULE_E03');
/*!40000 ALTER TABLE `buses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promo_codes`
--

DROP TABLE IF EXISTS `promo_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promo_codes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `code` varchar(255) NOT NULL,
  `discount_percentage` double DEFAULT NULL,
  `flat_discount_amount` double DEFAULT NULL,
  `min_booking_amount` double DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKj9mo0xgfs34t6e3c17anidd83` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promo_codes`
--

LOCK TABLES `promo_codes` WRITE;
/*!40000 ALTER TABLE `promo_codes` DISABLE KEYS */;
INSERT INTO `promo_codes` VALUES (1,_binary '','TRANSIT10',10,NULL,1000,NULL),(2,_binary '','SAVE500',NULL,500,2500,NULL),(3,_binary '','FIRST20',20,NULL,2000,NULL);
/*!40000 ALTER TABLE `promo_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seat_holds`
--

DROP TABLE IF EXISTS `seat_holds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seat_holds` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `bus_id` bigint NOT NULL,
  `expiry_timestamp` bigint NOT NULL,
  `seat_number` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKnhsn6xl6jlew80j6suwhhkdwf` (`bus_id`,`seat_number`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seat_holds`
--

LOCK TABLES `seat_holds` WRITE;
/*!40000 ALTER TABLE `seat_holds` DISABLE KEYS */;
/*!40000 ALTER TABLE `seat_holds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `auth_provider` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `nic` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `profile_picture_url` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'LOCAL','thenula2002@gmail.com','Thenula Dilhara Rathnayaka',NULL,'123456','0768202700',NULL,'PASSENGER');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-10 20:33:07
