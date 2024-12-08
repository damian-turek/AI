<?php
namespace App\Model;

use App\Service\Config;

class Comment
{
private $id;
private $subject;
private $content;

// Konstruktor
public function __construct($id = null, $subject = null, $content = null)
{
$this->id = $id;
$this->subject = $subject;
$this->content = $content;
}

// Gettery i Settery
public function getId()
{
return $this->id;
}

public function setId($id)
{
$this->id = $id;
}

public function getSubject()
{
return $this->subject;
}

public function setSubject($subject)
{
$this->subject = $subject;
}

public function getContent()
{
return $this->content;
}

public function setContent($content)
{
$this->content = $content;
}

// Pobranie wszystkich komentarzy
public static function findAll()
{
$pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
$sql = "SELECT * FROM comment";
$statement = $pdo->prepare($sql);
$statement->execute();
$rows = $statement->fetchAll(\PDO::FETCH_ASSOC);

$comments = [];
foreach ($rows as $row) {
$comments[] = new self($row['id'], $row['subject'], $row['content']);
}

return $comments;
}

// Pobranie komentarza po ID
public static function find($id)
{
$pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
$sql = "SELECT * FROM comment WHERE id = :id";
$statement = $pdo->prepare($sql);
$statement->execute([':id' => $id]);
$row = $statement->fetch(\PDO::FETCH_ASSOC);

if ($row) {
return new self($row['id'], $row['subject'], $row['content']);
}

return null;
}

// Zapisanie komentarza
public function save(): void
{
$pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
if (! $this->getId()) {
// Dodanie nowego komentarza
$sql = "INSERT INTO comment (subject, content) VALUES (:subject, :content)";
$statement = $pdo->prepare($sql);
$statement->execute([
':subject' => $this->getSubject(),
':content' => $this->getContent(),
]);

// Pobranie ID nowego komentarza
$this->setId($pdo->lastInsertId());
} else {
// Aktualizacja istniejącego komentarza
$sql = "UPDATE comment SET subject = :subject, content = :content WHERE id = :id";
$statement = $pdo->prepare($sql);
$statement->execute([
':subject' => $this->getSubject(),
':content' => $this->getContent(),
':id' => $this->getId(),
]);
}
}

// Usunięcie komentarza
public function delete(): void
{
$pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
$sql = "DELETE FROM comment WHERE id = :id";
$statement = $pdo->prepare($sql);
$statement->execute([
':id' => $this->getId(),
]);

// Zresetowanie danych po usunięciu
$this->setId(null);
$this->setSubject(null);
$this->setContent(null);
}
}
