SELECT `first`, `last` FROM `StudentName` WHERE `idS` in (SELECT `idS` FROM `StudentCourse` WHERE `idS` in (SELECT `idS` FROM `StudentCourse` AS SC, `Course` AS C, `ProfessorName` AS P WHERE SC.idC=C.idC AND C.idP=P.idP AND C.name = 'COMP 426' AND P.first='Ketan' AND P.last='Mayer-Patel') AND `idS` in (SELECT `idS` FROM `StudentCourse` AS SC, `Course` AS C, `ProfessorName` AS P WHERE SC.idC=C.idC AND C.idP=P.idP AND C.name = 'COMP 401' AND P.first='Ketan' AND P.last='Mayer-Patel'))