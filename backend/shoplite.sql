-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Creato il: Mar 18, 2026 alle 08:47
-- Versione del server: 10.4.32-MariaDB
-- Versione PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shoplite`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `clienti`
--

CREATE TABLE `clienti` (
  `id_cliente` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `cognome` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `indirizzo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `clienti`
--

INSERT INTO `clienti` (`id_cliente`, `nome`, `cognome`, `email`, `indirizzo`, `created_at`, `role`, `password`) VALUES
(5, 'Giulio', 'Verdi', 'verdi@mail.com', 'via gabribaldi, 56', '2026-03-17 15:57:57', 'admin', '$2b$10$quiK/KyMGzwzve13u6R4juQB7qYNt0QNGTBScaJOv8I3GHxO/6guG');

-- --------------------------------------------------------

--
-- Struttura della tabella `dettaglio_ordine`
--

CREATE TABLE `dettaglio_ordine` (
  `id_dettaglio` int(11) NOT NULL,
  `id_ordine` int(11) NOT NULL,
  `id_prodotto` int(11) NOT NULL,
  `quantita` int(11) NOT NULL,
  `prezzo_unitario` decimal(10,2) NOT NULL,
  `subtotale` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `dettaglio_pagamento`
--

CREATE TABLE `dettaglio_pagamento` (
  `id_dettaglio_pagamento` int(11) NOT NULL,
  `id_ordine` int(11) NOT NULL,
  `id_pagamento` int(11) NOT NULL,
  `riferimento_transazione` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `ordini`
--

CREATE TABLE `ordini` (
  `id_ordine` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `data_ordine` datetime DEFAULT current_timestamp(),
  `stato` enum('in_attesa','pagato','spedito','annullato') DEFAULT 'in_attesa',
  `totale` decimal(10,2) DEFAULT 0.00,
  `indirizzo_spedizione` varchar(255) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `city` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `pagamenti`
--

CREATE TABLE `pagamenti` (
  `id_pagamento` int(11) NOT NULL,
  `metodo` enum('carta','paypal','bonifico','contrassegno') NOT NULL,
  `importo` decimal(10,2) NOT NULL,
  `stato` enum('in_attesa','completato','fallito','rimborsato') DEFAULT 'in_attesa',
  `data_pagamento` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `prodotti`
--

CREATE TABLE `prodotti` (
  `id_prodotto` int(11) NOT NULL,
  `nome` varchar(150) NOT NULL,
  `descrizione` text DEFAULT NULL,
  `prezzo` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `categoria` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `prodotti`
--

INSERT INTO `prodotti` (`id_prodotto`, `nome`, `descrizione`, `prezzo`, `stock`, `categoria`, `created_at`, `image`) VALUES
(1, 'MSI GeForce RTX 4070 Ventus 2X OC', 'Scheda video NVIDIA RTX 4070 con doppio ventilatore Ventus, overclock di fabbrica, 12GB GDDR6X', 599.99, 15, 'GPU', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=MSI+RTX+4070+Ventus'),
(2, 'Gigabyte GeForce RTX 4070 Gaming OC', 'Scheda video NVIDIA RTX 4070 con sistema di raffreddamento Gaming OC, 12GB GDDR6X', 609.99, 12, 'GPU', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=Gigabyte+RTX+4070'),
(3, 'NVIDIA RTX 4070', 'Scheda video NVIDIA GeForce RTX 4070, 12GB GDDR6X, ray tracing e DLSS 3', 579.99, 20, 'GPU', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=NVIDIA+RTX+4070'),
(4, 'AMD RX 7800 XT', 'Scheda video AMD Radeon RX 7800 XT, 16GB GDDR6, architettura RDNA 3', 499.99, 18, 'GPU', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=AMD+RX+7800+XT'),
(5, 'NVIDIA RTX 4060 Ti', 'Scheda video NVIDIA GeForce RTX 4060 Ti, 8GB GDDR6, ottima per gaming 1080p/1440p', 399.99, 25, 'GPU', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=NVIDIA+RTX+4060+Ti'),
(6, 'AMD RX 7700 XT', 'Scheda video AMD Radeon RX 7700 XT, 12GB GDDR6, architettura RDNA 3', 449.99, 22, 'GPU', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=AMD+RX+7700+XT'),
(7, 'NVIDIA RTX 4070 Ti', 'Scheda video NVIDIA GeForce RTX 4070 Ti, 12GB GDDR6X, alte prestazioni per 4K', 799.99, 10, 'GPU', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=NVIDIA+RTX+4070+Ti'),
(8, 'Intel Core i7-13700K', 'Processore Intel Core i7 di 13a generazione, 16 core (8P+8E), 5.4GHz boost, socket LGA1700', 389.99, 30, 'CPU', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=Intel+i7-13700K'),
(9, 'Intel Core i7-13700KF', 'Processore Intel Core i7 di 13a generazione senza grafica integrata, 16 core, 5.4GHz boost', 369.99, 28, 'CPU', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=Intel+i7-13700KF'),
(10, 'Intel Core i5-13600K', 'Processore Intel Core i5 di 13a generazione, 14 core (6P+8E), 5.1GHz boost, socket LGA1700', 289.99, 35, 'CPU', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=Intel+i5-13600K'),
(11, 'AMD Ryzen 5 7600X', 'Processore AMD Ryzen 5 7600X, 6 core 12 thread, 5.3GHz boost, socket AM5', 249.99, 40, 'CPU', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=AMD+Ryzen+5+7600X'),
(12, 'AMD Ryzen 7 7800X3D', 'Processore AMD Ryzen 7 7800X3D, 8 core con 3D V-Cache, 5.0GHz boost, ottimo per gaming', 449.99, 20, 'CPU', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=AMD+Ryzen+7+7800X3D'),
(13, 'AMD Ryzen 9 7900X', 'Processore AMD Ryzen 9 7900X, 12 core 24 thread, 5.6GHz boost, socket AM5', 449.99, 15, 'CPU', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=AMD+Ryzen+9+7900X'),
(14, 'ASUS ROG Strix B650E-E Gaming WiFi', 'Scheda madre AMD B650E ATX, socket AM5, WiFi 6E, DDR5, PCIe 5.0', 349.99, 12, 'Motherboard', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=ASUS+ROG+B650E'),
(15, 'MSI MAG B760 Tomahawk WiFi', 'Scheda madre Intel B760 ATX, socket LGA1700, WiFi 6E, DDR5/DDR4', 229.99, 18, 'Motherboard', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=MSI+B760+Tomahawk'),
(16, 'Gigabyte B650 Aorus Elite', 'Scheda madre AMD B650 ATX, socket AM5, DDR5, PCIe 5.0, USB 3.2 Gen2', 249.99, 14, 'Motherboard', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=Gigabyte+B650+Aorus'),
(17, 'ASUS TUF Gaming B760-Plus', 'Scheda madre Intel B760 ATX, socket LGA1700, DDR5, robusta e affidabile', 199.99, 20, 'Motherboard', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=ASUS+TUF+B760'),
(18, 'ASRock B650 Steel Legend', 'Scheda madre AMD B650 ATX, socket AM5, DDR5, estetica steel con illuminazione RGB', 219.99, 16, 'Motherboard', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=ASRock+B650+Steel'),
(19, 'Samsung 990 Pro NVMe SSD', 'SSD NVMe PCIe 4.0 M.2, 1TB, velocità lettura fino a 7450 MB/s', 129.99, 50, 'Storage', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=Samsung+990+Pro'),
(20, 'Seagate BarraCuda HDD', 'Hard disk interno 2TB, 7200 RPM, SATA 6Gb/s, cache 256MB', 59.99, 45, 'Storage', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=Seagate+BarraCuda'),
(21, 'WD Black SN850X SSD', 'SSD NVMe PCIe 4.0 M.2, 1TB, velocità lettura fino a 7300 MB/s, ottimizzato per gaming', 139.99, 35, 'Storage', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=WD+Black+SN850X'),
(22, 'Corsair Vengeance DDR5 RAM', 'Kit RAM DDR5 32GB (2x16GB), 5600MHz, CL36, compatibile Intel e AMD AM5', 109.99, 40, 'RAM', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=Corsair+Vengeance+DDR5'),
(23, 'Kingston Fury Beast DDR5 RAM', 'Kit RAM DDR5 32GB (2x16GB), 5200MHz, CL40, basso profilo, plug & play XMP', 99.99, 42, 'RAM', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=Kingston+Fury+DDR5'),
(24, 'Corsair 4000D Airflow', 'Case ATX mid-tower con pannello frontale mesh, ottimo airflow, 2 ventole incluse', 99.99, 25, 'Case', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=Corsair+4000D+Airflow'),
(25, 'Corsair Frame 4000D', 'Case ATX mid-tower Corsair 4000D con pannello frontale solido, design pulito', 89.99, 22, 'Case', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=Corsair+4000D+Frame'),
(26, 'NZXT H510', 'Case ATX mid-tower compatto, pannello laterale in vetro temperato, design minimalista', 79.99, 30, 'Case', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=NZXT+H510'),
(27, 'Lian Li Lancool II', 'Case ATX mid-tower con mesh frontale, supporto radiatori 360mm, 3 ventole incluse', 109.99, 18, 'Case', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=Lian+Li+Lancool+II'),
(28, 'Fractal Design Meshify C', 'Case ATX mid-tower compatto con pannello mesh angolato, eccellente airflow', 94.99, 20, 'Case', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=Fractal+Meshify+C'),
(29, 'Phanteks Eclipse P400A', 'Case ATX mid-tower con pannello frontale mesh D-RGB, 3 ventole DRGB incluse', 89.99, 24, 'Case', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=Phanteks+P400A'),
(30, 'Logitech G Pro X Gaming Headset', 'Cuffie gaming professionali, driver PRO-G 50mm, microfono Blue VO!CE, USB', 129.99, 30, 'Cuffie', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=Logitech+G+Pro+X'),
(31, 'HyperX Cloud II Headset', 'Cuffie gaming con surround virtuale 7.1, driver 53mm, compatibile PC/PS4/Xbox/mobile', 99.99, 35, 'Cuffie', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=HyperX+Cloud+II'),
(32, 'SteelSeries Arctis 7', 'Cuffie gaming wireless 2.4GHz, autonomia 24h, microfono ClearCast retraibile', 149.99, 25, 'Cuffie', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=SteelSeries+Arctis+7'),
(33, 'Logitech G915 TKL', 'Tastiera gaming wireless tenkeyless, switch GL low-profile, LIGHTSPEED 2.4GHz, RGB', 199.99, 20, 'Tastiera', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=Logitech+G915+TKL'),
(34, 'Razer BlackWidow V4', 'Tastiera gaming meccanica, switch Razer Yellow, tasti macro dedicati, RGB Chroma', 139.99, 22, 'Tastiera', '2026-03-17 15:05:53', 'https://placehold.co/400x300?text=Razer+BlackWidow+V4'),
(35, 'prodotto', 'Descrizione prodotto.', 599.99, 14, 'GPU', '2026-03-17 16:03:21', 'https://res.cloudinary.com/dbxysr1a6/image/upload/v1773763281/shoplite/prodotti/1773763280434-Schermata%20del%202026-01-19%2019-17-15.png'),
(36, 'tastiera meccanica', 'una bella tastiera meccanica', 130.00, 1, 'Accessori', '2026-03-17 21:34:50', 'https://res.cloudinary.com/dbxysr1a6/image/upload/v1773783289/shoplite/prodotti/1773783288467-tastiera.jpg');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `clienti`
--
ALTER TABLE `clienti`
  ADD PRIMARY KEY (`id_cliente`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indici per le tabelle `dettaglio_ordine`
--
ALTER TABLE `dettaglio_ordine`
  ADD PRIMARY KEY (`id_dettaglio`),
  ADD KEY `fk_ordine` (`id_ordine`),
  ADD KEY `fk_prodotto` (`id_prodotto`);

--
-- Indici per le tabelle `dettaglio_pagamento`
--
ALTER TABLE `dettaglio_pagamento`
  ADD PRIMARY KEY (`id_dettaglio_pagamento`),
  ADD KEY `fk_ordine_pagamento` (`id_ordine`),
  ADD KEY `fk_pagamento` (`id_pagamento`);

--
-- Indici per le tabelle `ordini`
--
ALTER TABLE `ordini`
  ADD PRIMARY KEY (`id_ordine`),
  ADD KEY `fk_cliente_ordine` (`id_cliente`);

--
-- Indici per le tabelle `pagamenti`
--
ALTER TABLE `pagamenti`
  ADD PRIMARY KEY (`id_pagamento`);

--
-- Indici per le tabelle `prodotti`
--
ALTER TABLE `prodotti`
  ADD PRIMARY KEY (`id_prodotto`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `clienti`
--
ALTER TABLE `clienti`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT per la tabella `dettaglio_ordine`
--
ALTER TABLE `dettaglio_ordine`
  MODIFY `id_dettaglio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `dettaglio_pagamento`
--
ALTER TABLE `dettaglio_pagamento`
  MODIFY `id_dettaglio_pagamento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `ordini`
--
ALTER TABLE `ordini`
  MODIFY `id_ordine` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `pagamenti`
--
ALTER TABLE `pagamenti`
  MODIFY `id_pagamento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `prodotti`
--
ALTER TABLE `prodotti`
  MODIFY `id_prodotto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `dettaglio_ordine`
--
ALTER TABLE `dettaglio_ordine`
  ADD CONSTRAINT `fk_ordine` FOREIGN KEY (`id_ordine`) REFERENCES `ordini` (`id_ordine`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_prodotto` FOREIGN KEY (`id_prodotto`) REFERENCES `prodotti` (`id_prodotto`) ON DELETE CASCADE;

--
-- Limiti per la tabella `dettaglio_pagamento`
--
ALTER TABLE `dettaglio_pagamento`
  ADD CONSTRAINT `fk_ordine_pagamento` FOREIGN KEY (`id_ordine`) REFERENCES `ordini` (`id_ordine`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pagamento` FOREIGN KEY (`id_pagamento`) REFERENCES `pagamenti` (`id_pagamento`) ON DELETE CASCADE;

--
-- Limiti per la tabella `ordini`
--
ALTER TABLE `ordini`
  ADD CONSTRAINT `fk_cliente_ordine` FOREIGN KEY (`id_cliente`) REFERENCES `clienti` (`id_cliente`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
