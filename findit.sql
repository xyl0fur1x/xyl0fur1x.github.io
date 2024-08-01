-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Час створення: Сер 01 2024 р., 23:57
-- Версія сервера: 10.4.32-MariaDB
-- Версія PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База даних: `findit`
--

-- --------------------------------------------------------

--
-- Структура таблиці `posts`
--

CREATE TABLE `posts` (
  `postId` int(50) NOT NULL,
  `userId` int(50) DEFAULT NULL,
  `userName` varchar(21) DEFAULT NULL,
  `header` varchar(51) DEFAULT NULL,
  `description` varchar(201) DEFAULT NULL,
  `lat` double DEFAULT NULL,
  `lng` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп даних таблиці `posts`
--

INSERT INTO `posts` (`postId`, `userId`, `userName`, `header`, `description`, `lat`, `lng`) VALUES
(31, 33, 'yaremko', 'Офіс компанії FindIt', 'Місце, де зародилась та реалізувалась ідея створення соціальної мережі FindIt', 50.398592, 24.235617),
(32, 33, 'yaremko', 'Місце тестування', 'У даній точці проводились тестування функцій соціальної мережі', 50.300396, 24.244531),
(33, 34, 'merlin', 'Водойма для відпочинку', 'Маленька водойма для відпочинку, легкий доступ до води, також є повалене дерево на якому можна відпочити, проте шлях до водойми є важким та довгим', 50.383887, 24.278322),
(34, 34, 'merlin', 'Кішка', 'У даній точці, кожного дня, близько 12-13 години сидить кішка та чекає, поки її погодують', 50.364114, 24.226048),
(35, 33, 'yaremko', '<script>alert(1)</script>', '1234', 50.4037376, 24.2253824);

-- --------------------------------------------------------

--
-- Структура таблиці `subscribers`
--

CREATE TABLE `subscribers` (
  `userId` int(50) NOT NULL,
  `subscribedToId` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп даних таблиці `subscribers`
--

INSERT INTO `subscribers` (`userId`, `subscribedToId`) VALUES
(34, 33);

-- --------------------------------------------------------

--
-- Структура таблиці `userdata`
--

CREATE TABLE `userdata` (
  `userName` varchar(21) NOT NULL,
  `password` varchar(41) NOT NULL,
  `userId` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп даних таблиці `userdata`
--

INSERT INTO `userdata` (`userName`, `password`, `userId`) VALUES
('yaremko', '11223344', 33),
('merlin', '11223344', 34),
('squirrel', '11223344', 35);

-- --------------------------------------------------------

--
-- Структура таблиці `users`
--

CREATE TABLE `users` (
  `userId` int(50) NOT NULL,
  `userName` varchar(21) NOT NULL,
  `userPhotoUrl` varchar(400) DEFAULT NULL,
  `userDescription` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп даних таблиці `users`
--

INSERT INTO `users` (`userId`, `userName`, `userPhotoUrl`, `userDescription`) VALUES
(33, 'yaremko', 'https://wallpapers.com/blog/wp-content/uploads/2023/06/glitter-golden-bokeh-lights-scaled.jpeg', 'Автор та розробник соціальної мережі FindIt'),
(34, 'merlin', 'https://storage.pixteller.com/designs/designs-images/2019-03-27/05/simple-background-backgrounds-passion-simple-1-5c9b95c3a34f9.png', ''),
(35, 'squirrel', 'https://img.freepik.com/free-vector/copy-space-bokeh-spring-lights-background_52683-55649.jpg?w=996&t=st=1719439685~exp=1719440285~hmac=029b5838591ff28b888e7e96dbe08709ac0ebc3b9b09e34c59ab12543824db97', '');

--
-- Індекси збережених таблиць
--

--
-- Індекси таблиці `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`postId`),
  ADD KEY `userId` (`userId`);

--
-- Індекси таблиці `subscribers`
--
ALTER TABLE `subscribers`
  ADD PRIMARY KEY (`userId`,`subscribedToId`),
  ADD KEY `subscribedToId` (`subscribedToId`) USING BTREE;

--
-- Індекси таблиці `userdata`
--
ALTER TABLE `userdata`
  ADD PRIMARY KEY (`userId`);

--
-- Індекси таблиці `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT для збережених таблиць
--

--
-- AUTO_INCREMENT для таблиці `posts`
--
ALTER TABLE `posts`
  MODIFY `postId` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT для таблиці `userdata`
--
ALTER TABLE `userdata`
  MODIFY `userId` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- Обмеження зовнішнього ключа збережених таблиць
--

--
-- Обмеження зовнішнього ключа таблиці `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

--
-- Обмеження зовнішнього ключа таблиці `subscribers`
--
ALTER TABLE `subscribers`
  ADD CONSTRAINT `subscribers_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `subscribers_ibfk_2` FOREIGN KEY (`subscribedToId`) REFERENCES `users` (`userId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
