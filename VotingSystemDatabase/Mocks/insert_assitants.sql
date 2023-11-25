INSERT INTO `vote_system`.`assistant` (`id`, `created`, `can_vote`, `unit_id`, `meeting_id`, `meeting_admin_id`)
SELECT
    UUID(),
    NOW(),
    'yes',
    u.`id` AS unit_id,
    m.`id` AS meeting_id,
    m.`admin_id` AS meeting_admin_id
FROM
    `vote_system`.`unit` u
CROSS JOIN `vote_system`.`meeting` m
WHERE
    NOT EXISTS (
        SELECT 1
        FROM `vote_system`.`assistant` a
        WHERE a.`unit_id` = u.`id` AND a.`meeting_id` = m.`id`
    );
