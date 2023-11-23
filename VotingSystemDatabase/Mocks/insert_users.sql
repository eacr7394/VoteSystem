INSERT INTO `vote_system`.`user` (`id`, `email`, `name`, `lastname`, `created`, `updated`, `unit_id`)
SELECT
    UUID(), -- Genera un nuevo ID UUID para cada fila
    CONCAT('correo', SUBSTRING(MD5(RAND()), 1, 5), '@example.com'), -- Genera un correo aleatorio
    CONCAT('Nombre', SUBSTRING(MD5(RAND()), 1, 5)),
    CONCAT('Apellido', SUBSTRING(MD5(RAND()), 1, 5)),
    NOW(), -- Fecha y hora actual
    NOW(), -- Fecha y hora actual
    `id` -- Unidad obtenida de la subconsulta
FROM
    `vote_system`.`unit`
WHERE
    `id` NOT IN (
        SELECT `unit_id` FROM `vote_system`.`user`
    );
