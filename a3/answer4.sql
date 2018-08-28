SELECT COUNT(*) FROM (SELECT 'idSC' FROM `StudentCourse` AS SC, `Course` AS C WHERE SC.idC=C.idC GROUP BY SC.idS, C.examDate HAVING COUNT(examDate) > 1) A