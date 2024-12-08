<?php

/** @var \App\Model\Comment[] $comment */
/** @var \App\Service\Router $router */

$title = 'Comments List';
$bodyClass = 'comment-show';

ob_start(); ?>
    <!-- /app/templates/comment/show.php -->
    <h1><?= $comment->getSubject() ?></h1>
    <article>
        <?= $comment->getContent();?>
    </article>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('comment-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('comment-edit', ['id' => $comment->getId()]) ?>">Edit</a></li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
