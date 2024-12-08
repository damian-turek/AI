<?php

namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Comment;
use App\Service\Router;
use App\Service\Templating;

class CommentController
{
public function indexAction(Templating $templating, Router $router)
{
// Pobranie wszystkich komentarzy
$comments = Comment::findAll();

// Renderowanie widoku z komentarzami
return $templating->render('comment/index', [
'comments' => $comments,
'router' => $router, // Przekazujemy router do widoku
]);
}

public function showAction($id, Templating $templating, Router $router)
{
// Pobieranie komentarza według ID
$comment = Comment::find($id);

// Jeśli komentarz nie istnieje, rzucamy wyjątek
if (!$comment) {
throw new NotFoundException("Comment not found");
}

// Renderowanie widoku komentarza
return $templating->render('comment/show', ['comment' => $comment]);
}

public function createAction($data, Templating $templating, Router $router)
{
// Sprawdzenie, czy metoda to POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
// Tworzenie nowego komentarza
$comment = new Comment();
$comment->setSubject($data['subject']);
$comment->setContent($data['content']);
$comment->save(); // Zapisujemy komentarz

// Przekierowanie na stronę z listą komentarzy
$router->redirect('?action=comment-index');
}

// Renderowanie widoku do tworzenia komentarza
return $templating->render('comment/create');
}

public function editAction($id, $data, Templating $templating, Router $router)
{
// Pobieranie komentarza według ID
$comment = Comment::find($id);

// Jeśli komentarz nie istnieje, rzucamy wyjątek
if (!$comment) {
throw new NotFoundException("Comment not found");
}

// Sprawdzenie, czy metoda to POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
$comment->setSubject($data['subject']);
$comment->setContent($data['content']);
$comment->save(); // Zapisujemy zmieniony komentarz

// Przekierowanie na stronę z listą komentarzy
$router->redirect('?action=comment-index');
}

// Renderowanie widoku edycji komentarza
return $templating->render('comment/edit', ['comment' => $comment]);
}

public function deleteAction($id, Router $router)
{
// Pobieranie komentarza według ID
$comment = Comment::find($id);

// Usuwanie komentarza, jeśli istnieje
if ($comment) {
$comment->delete();
}

// Przekierowanie na stronę z listą komentarzy
$router->redirect('?action=comment-index');
}
}
